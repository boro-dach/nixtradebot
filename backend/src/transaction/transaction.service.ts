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

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTransactionDto) {
    const user = await this.prisma.user.findUnique({
      where: { tgid: dto.user_id },
    });
    if (!user) {
      throw new NotFoundException(
        `Пользователь с ID ${dto.user_id} не найден.`,
      );
    }

    const currency = await this.prisma.cryptocurrency.findUnique({
      where: { id: dto.cryptocurrencyId },
    });
    if (!currency) {
      throw new NotFoundException(
        `Криптовалюта с ID ${dto.cryptocurrencyId} не найдена.`,
      );
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        user_id: dto.user_id,
        type: dto.type,
        cryptocurrencyId: dto.cryptocurrencyId,
        // Теперь тип Prisma.Decimal будет найден
        amount: new Prisma.Decimal(dto.amount),
      },
    });

    return transaction;
  }

  async getAll() {
    return this.prisma.transaction.findMany({
      include: {
        user: true,
        currency: true,
      },
    });
  }

  async getById(dto: GetTransactionByIdDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: dto.id },
      include: {
        user: true,
        currency: true,
      },
    });
    if (!transaction) {
      throw new NotFoundException(`Транзакция с ID ${dto.id} не найдена.`);
    }
    return transaction;
  }

  async getByUser(dto: GetTransactionsByUserDto) {
    return this.prisma.transaction.findMany({
      where: { user_id: dto.user_id },
      include: {
        currency: true,
      },
      orderBy: {
        // createdAt: 'desc', // Пример сортировки
      },
    });
  }

  async accept(id: string) {
    // prisma.$transaction принимает callback с типизированным клиентом
    return this.prisma.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        throw new NotFoundException(`Транзакция с ID ${id} не найдена.`);
      }

      if (transaction.status !== Status.PROCESSING) {
        throw new BadRequestException(
          `Транзакцию можно подтвердить только из статуса PROCESSING.`,
        );
      }

      const uniqueBalanceIdentifier = {
        userId_cryptocurrencyId: {
          userId: transaction.user_id,
          cryptocurrencyId: transaction.cryptocurrencyId,
        },
      };

      if (transaction.type === TransactionType.DEPOSIT) {
        await prisma.assetBalance.upsert({
          where: uniqueBalanceIdentifier,
          update: {
            amount: {
              increment: transaction.amount,
            },
          },
          create: {
            userId: transaction.user_id,
            cryptocurrencyId: transaction.cryptocurrencyId,
            amount: transaction.amount,
          },
        });
      }

      if (transaction.type === TransactionType.WITHDRAW) {
        const currentBalance = await prisma.assetBalance.findUnique({
          where: uniqueBalanceIdentifier,
        });
        if (!currentBalance || currentBalance.amount.lt(transaction.amount)) {
          throw new BadRequestException('Недостаточно средств для вывода.');
        }

        await prisma.assetBalance.update({
          where: uniqueBalanceIdentifier,
          data: {
            amount: {
              decrement: transaction.amount,
            },
          },
        });
      }

      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: { status: Status.CONFIRMED },
      });

      return updatedTransaction;
    });
  }

  async reject(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Транзакция с ID ${id} не найдена.`);
    }
    if (transaction.status !== Status.PROCESSING) {
      throw new BadRequestException(
        `Транзакцию можно отклонить только из статуса PROCESSING.`,
      );
    }

    return this.prisma.transaction.update({
      where: { id },
      data: { status: Status.REJECTED },
    });
  }
}
