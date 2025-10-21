import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateTransactionDto,
  GetTransactionByIdDto,
  GetTransactionsByUserDto,
} from './dto/transaction.dto';
import { Prisma, Status, TransactionType } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  private async getVatPercentage(): Promise<number> {
    const config = await this.prisma.config.findUnique({
      where: { key: 'VAT_PERCENTAGE' },
    });
    return config ? parseFloat(config.value) : 0;
  }

  private async calculateVat(amount: Prisma.Decimal): Promise<Prisma.Decimal> {
    const vatPercentage = await this.getVatPercentage();
    return amount.mul(vatPercentage).div(100);
  }

  private async applyVat(amount: Prisma.Decimal): Promise<{
    originalAmount: Prisma.Decimal;
    vatAmount: Prisma.Decimal;
    finalAmount: Prisma.Decimal;
  }> {
    const vatAmount = await this.calculateVat(amount);
    const finalAmount = amount.sub(vatAmount);

    return {
      originalAmount: amount,
      vatAmount,
      finalAmount,
    };
  }

  async create(dto: CreateTransactionDto) {
    const user = await this.prisma.user.findUnique({
      where: { tgid: dto.user_id },
      include: {
        transactions: {
          where: {
            type: TransactionType.WITHDRAW,
            status: Status.CONFIRMED,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Пользователь с ID ${dto.user_id} не найден.`,
      );
    }

    if (dto.type === TransactionType.WITHDRAW && user.isBannedWithdraw) {
      throw new BadRequestException(
        'Вывод средств заблокирован администратором.',
      );
    }

    if (dto.type === TransactionType.WITHDRAW && user.hasStopLimit) {
      const totalWithdrawn = user.transactions.reduce(
        (sum, tx) => sum.add(tx.amount),
        new Prisma.Decimal(0),
      );

      const requestedAmount = new Prisma.Decimal(dto.amount);
      const totalAfterWithdraw = totalWithdrawn.add(requestedAmount);

      if (totalAfterWithdraw.gt(user.stopLimit)) {
        throw new BadRequestException(
          `Превышен лимит на вывод средств. ` +
            `Лимит: $${user.stopLimit}, ` +
            `Уже выведено: $${totalWithdrawn.toFixed(2)}, ` +
            `Доступно: $${new Prisma.Decimal(user.stopLimit).sub(totalWithdrawn).toFixed(2)}`,
        );
      }
    }

    let currency = await this.prisma.cryptocurrency.findUnique({
      where: { coingeckoId: dto.coingeckoId },
    });

    if (!currency) {
      currency = await this.prisma.cryptocurrency.create({
        data: {
          coingeckoId: dto.coingeckoId,
          symbol: dto.coingeckoId.toUpperCase(),
          name: dto.coingeckoId,
        },
      });
    }

    let finalAmount = new Prisma.Decimal(dto.amount);
    let vatAmount = new Prisma.Decimal(0);

    if (dto.type === TransactionType.WITHDRAW) {
      const vatCalculation = await this.applyVat(finalAmount);
      vatAmount = vatCalculation.vatAmount;
      finalAmount = vatCalculation.finalAmount;

      const assetBalance = await this.prisma.assetBalance.findUnique({
        where: {
          userId_cryptocurrencyId: {
            userId: dto.user_id,
            cryptocurrencyId: currency.id,
          },
        },
      });

      const requestedAmount = new Prisma.Decimal(dto.amount);

      if (!assetBalance || assetBalance.amount.lt(requestedAmount)) {
        throw new BadRequestException(
          'Недостаточно средств на балансе для создания заявки на вывод.',
        );
      }
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        user_id: dto.user_id,
        type: dto.type,
        cryptocurrencyId: currency.id,
        amount: finalAmount, // Сохраняем сумму после вычета НДС
      },
      include: { currency: true, user: true },
    });

    const vatPercentage = await this.getVatPercentage();

    const notificationPayload = {
      user_id: transaction.user_id,
      crypto_name: transaction.currency.name,
      amount: transaction.amount.toString(),
      original_amount: dto.amount.toString(),
      vat_amount: vatAmount.toString(),
      vat_percentage: vatPercentage,
      tx_type: transaction.type,
      transaction_id: transaction.id,
    };

    try {
      const notifyUrl =
        process.env.NOTIFICATION_API_URL ||
        'http://localhost:8000/notify-transaction';
      await firstValueFrom(
        this.httpService.post(notifyUrl, notificationPayload),
      );
    } catch (error) {
      console.error(
        'CRITICAL: Failed to send transaction notification!',
        error.message,
      );
    }

    // Возвращаем транзакцию с информацией об НДС
    return {
      ...transaction,
      vatInfo:
        dto.type === TransactionType.WITHDRAW
          ? {
              originalAmount: dto.amount,
              vatAmount: vatAmount.toNumber(),
              vatPercentage,
              finalAmount: finalAmount.toNumber(),
            }
          : null,
    };
  }

  async getAll() {
    return this.prisma.transaction.findMany({
      include: {
        user: true,
        currency: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async getById(dto: GetTransactionByIdDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: dto.id },
      include: { user: true, currency: true },
    });
    if (!transaction) {
      throw new NotFoundException(`Транзакция с ID ${dto.id} не найдена.`);
    }
    return transaction;
  }

  async getByUser(dto: GetTransactionsByUserDto) {
    return this.prisma.transaction.findMany({
      where: { user_id: dto.user_id },
      include: { currency: true },
      orderBy: { id: 'desc' },
    });
  }

  async accept(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id },
        include: { user: { include: { referredBy: true } } },
      });
      if (!transaction)
        throw new NotFoundException(`Транзакция с ID ${id} не найдена.`);
      if (transaction.status !== Status.PROCESSING) {
        throw new BadRequestException(
          `Подтвердить можно только транзакцию в статусе PROCESSING.`,
        );
      }

      if (
        transaction.type === TransactionType.DEPOSIT &&
        transaction.user.referredById
      ) {
        const referrerId = transaction.user.referredById;
        const bonusAmount = transaction.amount.mul(0.1); // 10%

        const usdtCurrency = await tx.cryptocurrency.findUnique({
          where: { coingeckoId: 'tether' },
        });
        if (!usdtCurrency) {
          console.error(
            'CRITICAL: USDT currency not found, cannot apply referral bonus.',
          );
        } else {
          await tx.assetBalance.upsert({
            where: {
              userId_cryptocurrencyId: {
                userId: referrerId,
                cryptocurrencyId: usdtCurrency.id,
              },
            },
            update: { amount: { increment: bonusAmount } },
            create: {
              userId: referrerId,
              cryptocurrencyId: usdtCurrency.id,
              amount: bonusAmount,
            },
          });
          await tx.transaction.create({
            data: {
              user_id: referrerId,
              type: TransactionType.DEPOSIT,
              cryptocurrencyId: usdtCurrency.id,
              amount: bonusAmount,
              status: Status.CONFIRMED,
            },
          });
        }
      }

      const whereBalance = {
        userId_cryptocurrencyId: {
          userId: transaction.user_id,
          cryptocurrencyId: transaction.cryptocurrencyId,
        },
      };

      if (transaction.type === TransactionType.DEPOSIT) {
        await tx.assetBalance.upsert({
          where: whereBalance,
          update: { amount: { increment: transaction.amount } },
          create: {
            userId: transaction.user_id,
            cryptocurrencyId: transaction.cryptocurrencyId,
            amount: transaction.amount,
          },
        });
      }

      if (transaction.type === TransactionType.WITHDRAW) {
        const currentBalance = await tx.assetBalance.findUnique({
          where: whereBalance,
        });
        if (!currentBalance || currentBalance.amount.lt(transaction.amount)) {
          throw new BadRequestException('Недостаточно средств для вывода.');
        }
        await tx.assetBalance.update({
          where: whereBalance,
          data: { amount: { decrement: transaction.amount } },
        });

        await this.checkAndBlockWithdrawIfNeeded(
          tx,
          transaction.user_id,
          transaction.amount,
        );
      }

      return tx.transaction.update({
        where: { id },
        data: { status: Status.CONFIRMED },
        include: { user: true, currency: true },
      });
    });
  }

  async reject(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction)
      throw new NotFoundException(`Транзакция с ID ${id} не найдена.`);
    if (transaction.status !== Status.PROCESSING) {
      throw new BadRequestException(
        `Отклонить можно только транзакцию в статусе PROCESSING.`,
      );
    }

    return this.prisma.transaction.update({
      where: { id },
      data: { status: Status.REJECTED },
      include: { user: true, currency: true },
    });
  }

  private async checkAndBlockWithdrawIfNeeded(
    tx: any,
    userId: string,
    justWithdrawnAmount: Prisma.Decimal,
  ): Promise<void> {
    const user = await tx.user.findUnique({
      where: { tgid: userId },
      include: {
        transactions: {
          where: {
            type: TransactionType.WITHDRAW,
            status: Status.CONFIRMED,
          },
        },
      },
    });

    if (!user || !user.hasStopLimit) {
      return;
    }

    const totalWithdrawn = user.transactions.reduce(
      (sum, transaction) => sum.add(transaction.amount),
      new Prisma.Decimal(0),
    );

    if (totalWithdrawn.gte(user.stopLimit) && !user.isBannedWithdraw) {
      await tx.user.update({
        where: { tgid: userId },
        data: { isBannedWithdraw: true },
      });

      console.log(
        `🔒 AUTO-BLOCKED: User ${userId} reached stop limit. ` +
          `Total withdrawn: $${totalWithdrawn.toFixed(2)}, ` +
          `Limit: $${user.stopLimit}`,
      );

      try {
        const notifyUrl =
          process.env.NOTIFICATION_API_URL ||
          'http://localhost:8000/notify-stop-limit';
        await firstValueFrom(
          this.httpService.post(notifyUrl, {
            user_id: userId,
            total_withdrawn: totalWithdrawn.toString(),
            stop_limit: user.stopLimit.toString(),
            blocked: true,
          }),
        );
      } catch (error) {
        console.error('Failed to send stop limit notification:', error.message);
      }
    }
  }

  async getWithdrawStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { tgid: userId },
      include: {
        transactions: {
          where: {
            type: TransactionType.WITHDRAW,
            status: Status.CONFIRMED,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден.`);
    }

    const totalWithdrawn = user.transactions.reduce(
      (sum, tx) => sum.add(tx.amount),
      new Prisma.Decimal(0),
    );

    const remainingLimit = user.hasStopLimit
      ? new Prisma.Decimal(user.stopLimit).sub(totalWithdrawn)
      : null;

    const vatPercentage = await this.getVatPercentage();

    return {
      totalWithdrawn: totalWithdrawn.toNumber(),
      stopLimit: user.stopLimit,
      hasStopLimit: user.hasStopLimit,
      remainingLimit: remainingLimit ? remainingLimit.toNumber() : null,
      isBannedWithdraw: user.isBannedWithdraw,
      transactionsCount: user.transactions.length,
      currentVatPercentage: vatPercentage,
    };
  }

  async calculateWithdrawPreview(amount: number) {
    const requestedAmount = new Prisma.Decimal(amount);
    const vatCalculation = await this.applyVat(requestedAmount);
    const vatPercentage = await this.getVatPercentage();

    return {
      requestedAmount: amount,
      vatPercentage,
      vatAmount: vatCalculation.vatAmount.toNumber(),
      finalAmount: vatCalculation.finalAmount.toNumber(),
      message: `После вычета НДС (${vatPercentage}%) вы получите: ${vatCalculation.finalAmount.toFixed(2)}`,
    };
  }
}
