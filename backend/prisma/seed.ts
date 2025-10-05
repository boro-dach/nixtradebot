// prisma/seed.ts

import { PrismaClient } from '../generated/prisma';

// Инициализируем Prisma Client
const prisma = new PrismaClient();

// Определяем интерфейс для данных, которые мы получаем от API
interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
}

async function main() {
  console.log('Начало сидинга...');

  try {
    // 1. Получаем топ-100 криптовалют с CoinGecko
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1',
    );

    if (!response.ok) {
      throw new Error(`Ошибка API! Статус: ${response.status}`);
    }

    const coins: CoinGeckoCoin[] = await response.json();
    console.log(`Получено ${coins.length} криптовалют с CoinGecko.`);

    // 2. Подготавливаем данные для записи в базу данных
    const cryptoData = coins.map((coin) => ({
      coingeckoId: coin.id,
      symbol: coin.symbol.toUpperCase(), // Приводим символ к верхнему регистру
      name: coin.name,
      imageUrl: coin.image,
    }));

    // 3. Очищаем таблицу перед добавлением новых данных (опционально, но полезно для повторного запуска)
    await prisma.cryptocurrency.deleteMany({});
    console.log('Старые данные из таблицы Cryptocurrency удалены.');

    // 4. Добавляем все новые данные в таблицу одной командой
    await prisma.cryptocurrency.createMany({
      data: cryptoData,
    });

    console.log(
      'Сидинг успешно завершен! 100 криптовалют добавлены в базу данных.',
    );
  } catch (error) {
    console.error('Произошла ошибка во время сидинга:', error);
    process.exit(1);
  } finally {
    // 5. Всегда отключаемся от базы данных в конце
    await prisma.$disconnect();
  }
}

// Запускаем main функцию
main();
