import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Prisma } from '@prisma/client';
import { ExecuteTradeDto, TradeType } from './dto/trade.dto';

@Injectable()
export class TradeService {
  private readonly COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async getMarketData(assetSymbol: string) {
    const asset = await this.prisma.cryptocurrency.findUnique({
      where: { symbol: assetSymbol },
    });
    if (!asset || !asset.coingeckoId) {
      throw new NotFoundException(
        `Актив ${assetSymbol} не найден или для него не настроен coingeckoId.`,
      );
    }

    try {
      const url = `${this.COINGECKO_API_URL}/simple/price?ids=${asset.coingeckoId}&vs_currencies=usd&include_24hr_change=true`;
      const response = await firstValueFrom(this.httpService.get(url));
      const data = response.data[asset.coingeckoId];

      if (!data) {
        throw new Error('API не вернуло данные для актива.');
      }

      return {
        price: data.usd,
        priceChange24hPercent: data.usd_24h_change,
      };
    } catch (error) {
      console.error('Ошибка API CoinGecko:', error.message);
      throw new BadRequestException(
        `Не удалось получить рыночные данные для ${assetSymbol}`,
      );
    }
  }

  async executeTrade(dto: ExecuteTradeDto) {
    // 1. Получаем из БД информацию об активах и пользователе
    const assetToTrade = await this.prisma.cryptocurrency.findUnique({
      where: { symbol: dto.assetToTradeSymbol },
    });
    const baseAsset = await this.prisma.cryptocurrency.findUnique({
      where: { symbol: dto.baseAssetSymbol },
    });

    if (!assetToTrade || !baseAsset || !assetToTrade.coingeckoId) {
      throw new NotFoundException(
        'Один из активов не найден или не настроен для торговли.',
      );
    }

    // 2. Получаем актуальную рыночную цену
    const marketData = await this.getMarketData(dto.assetToTradeSymbol);
    const currentPrice = marketData.price;

    // 3. Рассчитываем суммы для обмена, используя Decimal для точности
    const amountToTrade = new Prisma.Decimal(dto.amountInBaseAsset).div(
      currentPrice,
    );
    const amountInBase = new Prisma.Decimal(dto.amountInBaseAsset);

    const fromAsset =
      dto.tradeType === TradeType.BUY ? baseAsset : assetToTrade;
    const toAsset = dto.tradeType === TradeType.BUY ? assetToTrade : baseAsset;
    const amountToDecrement =
      dto.tradeType === TradeType.BUY ? amountInBase : amountToTrade;
    const amountToIncrement =
      dto.tradeType === TradeType.BUY ? amountToTrade : amountInBase;

    // 4. Выполняем все операции в рамках одной атомарной транзакции
    return this.prisma.$transaction(async (tx) => {
      // 4.1. Находим баланс списываемого актива и блокируем его
      const fromBalance = await tx.assetBalance.findUnique({
        where: {
          userId_cryptocurrencyId: {
            userId: dto.userId,
            cryptocurrencyId: fromAsset.id,
          },
        },
      });

      // 4.2. Проверяем, достаточно ли средств
      if (!fromBalance || fromBalance.amount.lt(amountToDecrement)) {
        throw new BadRequestException(
          `Недостаточно средств на балансе ${fromAsset.symbol}.`,
        );
      }

      // 4.3. Списываем средства
      await tx.assetBalance.update({
        where: { id: fromBalance.id },
        data: { amount: { decrement: amountToDecrement } },
      });

      // 4.4. Зачисляем средства (upsert создаст баланс, если его нет)
      await tx.assetBalance.upsert({
        where: {
          userId_cryptocurrencyId: {
            userId: dto.userId,
            cryptocurrencyId: toAsset.id,
          },
        },
        update: { amount: { increment: amountToIncrement } },
        create: {
          userId: dto.userId,
          cryptocurrencyId: toAsset.id,
          amount: amountToIncrement,
        },
      });

      // 4.5. СОЗДАЕМ ЗАПИСЬ В ИСТОРИИ СДЕЛОК
      const tradeRecord = await tx.trade.create({
        data: {
          userId: dto.userId,
          fromCryptocurrencyId: fromAsset.id,
          fromAmount: amountToDecrement,
          toCryptocurrencyId: toAsset.id,
          toAmount: amountToIncrement,
          executedPrice: new Prisma.Decimal(currentPrice),
        },
      });

      return tradeRecord; // Возвращаем созданную запись о сделке
    });
  }

  async getHistoryByUser(userId: string) {
    const trades = await this.prisma.trade.findMany({
      where: { userId },
      include: {
        fromCryptocurrency: {
          select: { symbol: true, name: true, imageUrl: true },
        },
        toCryptocurrency: {
          select: { symbol: true, name: true, imageUrl: true },
        },
      },
      // Сортируем по дате, чтобы последние сделки были вверху
      orderBy: {
        createdAt: 'desc',
      },
    });

    return trades;
  }
}
