import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MarketService } from '../market/market.service';
import {
  ClosePositionDto,
  ExecuteSwapDto,
  OpenPositionDto,
} from './dto/trade.dto';
import { PositionStatus, Prisma } from '@prisma/client';

@Injectable()
export class TradeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly marketService: MarketService,
  ) {}

  /**
   * Логика для прямого обмена (свапа) активов.
   */
  async executeSwap(dto: ExecuteSwapDto) {
    const { userId, fromAssetCoingeckoId, toAssetCoingeckoId, fromAmount } =
      dto;

    if (fromAssetCoingeckoId === toAssetCoingeckoId) {
      throw new BadRequestException('Нельзя обменять актив на самого себя.');
    }

    const [fromAssetPriceData, toAssetPriceData] = await Promise.all([
      this.marketService.getAssetPrice(fromAssetCoingeckoId),
      this.marketService.getAssetPrice(toAssetCoingeckoId),
    ]);

    if (!fromAssetPriceData || !toAssetPriceData) {
      throw new InternalServerErrorException(
        'Не удалось получить курсы валют.',
      );
    }
    const fromAssetPrice = fromAssetPriceData.current_price;
    const toAssetPrice = toAssetPriceData.current_price;

    const toAmount = (fromAmount * fromAssetPrice) / toAssetPrice;

    return this.prisma.$transaction(async (tx) => {
      const fromCurrency = await tx.cryptocurrency.findUnique({
        where: { coingeckoId: fromAssetCoingeckoId },
      });
      const toCurrency = await tx.cryptocurrency.findUnique({
        where: { coingeckoId: toAssetCoingeckoId },
      });

      if (!fromCurrency || !toCurrency) {
        throw new NotFoundException('Один из активов не найден в системе.');
      }

      const fromAssetBalance = await tx.assetBalance.findUnique({
        where: {
          userId_cryptocurrencyId: {
            userId,
            cryptocurrencyId: fromCurrency.id,
          },
        },
      });
      if (!fromAssetBalance || fromAssetBalance.amount.lt(fromAmount)) {
        throw new BadRequestException('Недостаточно средств для обмена.');
      }

      await tx.assetBalance.update({
        where: { id: fromAssetBalance.id },
        data: { amount: { decrement: new Prisma.Decimal(fromAmount) } },
      });

      await tx.assetBalance.upsert({
        where: {
          userId_cryptocurrencyId: { userId, cryptocurrencyId: toCurrency.id },
        },
        update: { amount: { increment: new Prisma.Decimal(toAmount) } },
        create: {
          userId,
          cryptocurrencyId: toCurrency.id,
          amount: new Prisma.Decimal(toAmount),
        },
      });

      await tx.trade.create({
        data: {
          userId,
          fromCryptocurrencyId: fromCurrency.id,
          fromAmount: new Prisma.Decimal(fromAmount),
          toCryptocurrencyId: toCurrency.id,
          toAmount: new Prisma.Decimal(toAmount),
          executedPrice: new Prisma.Decimal(fromAssetPrice / toAssetPrice),
        },
      });

      return { message: 'Обмен успешно выполнен.' };
    });
  }

  /**
   * Логика для открытия торговой позиции (LONG/SHORT).
   */
  async openPosition(dto: OpenPositionDto) {
    // Ищем актив по coingeckoId для надежности
    const asset = await this.prisma.cryptocurrency.findUnique({
      where: { coingeckoId: dto.assetCoingeckoId },
    });

    if (!asset) {
      throw new NotFoundException(
        `Актив ${dto.assetCoingeckoId} не найден в базе. Запустите синхронизацию.`,
      );
    }

    const marketData = await this.marketService.getAssetPrice(
      asset.coingeckoId,
    );
    const entryPrice = marketData.current_price;
    const coinAmount = dto.amount / entryPrice;

    const position = await this.prisma.position.create({
      data: {
        userId: dto.userId,
        cryptocurrencyId: asset.id,
        type: dto.type,
        status: PositionStatus.OPEN,
        entryPrice: new Prisma.Decimal(entryPrice),
        amount: new Prisma.Decimal(coinAmount),
        investedAmount: new Prisma.Decimal(dto.amount),
        currentPrice: new Prisma.Decimal(entryPrice),
        currentValue: new Prisma.Decimal(dto.amount),
        profitLoss: new Prisma.Decimal(0),
      },
      include: { cryptocurrency: true },
    });

    return position;
  }

  /**
   * Логика для закрытия торговой позиции.
   */
  async closePosition(dto: ClosePositionDto) {
    const position = await this.prisma.position.findUnique({
      where: { id: dto.positionId },
      include: { cryptocurrency: true },
    });

    if (!position || position.userId !== dto.userId)
      throw new NotFoundException('Позиция не найдена');
    if (position.status === PositionStatus.CLOSED)
      throw new BadRequestException('Позиция уже закрыта');
    if (!position.cryptocurrency.coingeckoId)
      throw new BadRequestException('Актив не настроен для торговли');

    const user = await this.prisma.user.findUnique({
      where: { tgid: dto.userId },
    });
    const marketData = await this.marketService.getAssetPrice(
      position.cryptocurrency.coingeckoId,
      user?.isLucky ? dto.userId : undefined,
    );

    const currentPrice = marketData.current_price;
    const currentValue = position.amount.toNumber() * currentPrice;
    const profitLoss = currentValue - position.investedAmount.toNumber();

    // В рамках одной транзакции закрываем позицию и начисляем/списываем баланс USDT
    return this.prisma.$transaction(async (tx) => {
      // Находим USDT в базе
      const usdtCurrency = await tx.cryptocurrency.findUnique({
        where: { coingeckoId: 'tether' },
      });
      if (!usdtCurrency)
        throw new InternalServerErrorException('USDT не найден в системе.');

      // Рассчитываем итоговую сумму к начислению
      const finalAmount = position.investedAmount.toNumber() + profitLoss;

      // Начисляем/списываем USDT
      await tx.assetBalance.upsert({
        where: {
          userId_cryptocurrencyId: {
            userId: dto.userId,
            cryptocurrencyId: usdtCurrency.id,
          },
        },
        update: { amount: { increment: new Prisma.Decimal(finalAmount) } },
        create: {
          userId: dto.userId,
          cryptocurrencyId: usdtCurrency.id,
          amount: new Prisma.Decimal(finalAmount),
        },
      });

      // Закрываем позицию
      return tx.position.update({
        where: { id: dto.positionId },
        data: {
          status: PositionStatus.CLOSED,
          currentPrice: new Prisma.Decimal(currentPrice),
          currentValue: new Prisma.Decimal(currentValue),
          profitLoss: new Prisma.Decimal(profitLoss),
          closedAt: new Date(),
        },
        include: { cryptocurrency: true },
      });
    });
  }

  /**
   * Получение и обновление P/L для открытых позиций.
   */
  async getOpenPositions(userId: string) {
    const positions = await this.prisma.position.findMany({
      where: { userId, status: PositionStatus.OPEN },
      include: { cryptocurrency: true },
      orderBy: { openedAt: 'desc' },
    });

    const user = await this.prisma.user.findUnique({ where: { tgid: userId } });

    // Используем Promise.all для параллельного обновления данных
    const updatedPositions = await Promise.all(
      positions.map(async (position) => {
        if (!position.cryptocurrency.coingeckoId) return position;

        const marketData = await this.marketService.getAssetPrice(
          position.cryptocurrency.coingeckoId,
          user?.isLucky ? userId : undefined,
        );

        const currentPrice = marketData.current_price;
        const currentValue = position.amount.toNumber() * currentPrice;
        const profitLoss = currentValue - position.investedAmount.toNumber();

        // Обновляем позицию в БД
        return this.prisma.position.update({
          where: { id: position.id },
          data: {
            currentPrice: new Prisma.Decimal(currentPrice),
            currentValue: new Prisma.Decimal(currentValue),
            profitLoss: new Prisma.Decimal(profitLoss),
          },
          include: { cryptocurrency: true },
        });
      }),
    );

    return updatedPositions;
  }

  /**
   * Получение закрытых позиций.
   */
  async getClosedPositions(userId: string) {
    return this.prisma.position.findMany({
      where: { userId, status: PositionStatus.CLOSED },
      include: { cryptocurrency: true },
      orderBy: { closedAt: 'desc' },
    });
  }

  /**
   * Получение всех позиций.
   */
  async getAllPositions(userId: string) {
    return this.prisma.position.findMany({
      where: { userId },
      include: { cryptocurrency: true },
      orderBy: { openedAt: 'desc' },
    });
  }
}
