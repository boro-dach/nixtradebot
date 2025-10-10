// Файл: Profile.tsx

"use client";

import {
  telegramSelectors,
  useTelegramStore,
} from "@/entities/telegram/model/store";
import SettingsList from "@/widgets/settings-list/ui/SettingsList";
import { ArrowDown, ArrowRightLeft, ArrowUp, Loader2 } from "lucide-react"; // 1. Импортируем иконку лоадера
import Link from "next/link";
import React, { useMemo } from "react"; // 2. Импортируем useMemo

// 3. Импортируем наши хуки и типы
import {
  useBalance,
  AssetBalance,
} from "@/entities/balance/api/useTotalBalance";
import { useAssetPrices } from "@/entities/market/api/useAssetPrices";

const Profile = () => {
  const displayName = useTelegramStore(telegramSelectors.displayName);
  const userId = 843961428;
  const { balance, isLoading: isLoadingBalance } = useBalance(userId);

  const assetIdsToFetch = useMemo(() => {
    if (!balance) return [];
    return balance.map(
      (asset: AssetBalance) => asset.cryptocurrency.coingeckoId
    );
  }, [balance]);

  // 6. Запрашиваем цены для этих ID с CoinGecko
  const { prices, isLoadingPrices } = useAssetPrices(assetIdsToFetch);

  // 7. Считаем итоговую сумму
  const totalBalanceValue = useMemo(() => {
    if (!balance || !prices || prices.size === 0) {
      return 0;
    }
    return balance.reduce((total: number, asset: AssetBalance) => {
      const amount = parseFloat(asset.amount);
      const price = prices.get(asset.cryptocurrency.coingeckoId) || 0;
      return total + amount * price;
    }, 0);
  }, [balance, prices]);

  // 8. Определяем общий статус загрузки
  const isLoading = isLoadingBalance || isLoadingPrices;

  // --- КОНЕЦ ЛОГИКИ БАЛАНСА ---

  return (
    <div className="flex flex-col mx-4 gap-4 pb-20">
      <div className="flex flex-row justify-between items-center mt-4">
        <p className="text-lg font-semibold">Profile</p>
      </div>
      <div className="flex flex-col items-center gap-2 w-full mt-4">
        <div className="bg-zinc-900 p-12 rounded-full"></div>
        <p>{displayName}</p>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <p className="font-semibold text-2xl">Total balance:</p>

        {/* 9. Отображаем баланс или лоадер */}
        <div className="text-4xl h-12 flex items-center">
          {" "}
          {/* Обертка для стабильной высоты */}
          {isLoading ? (
            <Loader2 className="w-9 h-9 animate-spin" />
          ) : (
            // Форматируем сумму для отображения
            `$${totalBalanceValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 grid-rows-1 gap-2 h-28">
        <Link
          href={"/deposit"}
          className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 bg-zinc-900"
        >
          <div className="bg-white p-2 rounded-full">
            <ArrowDown color="black" />
          </div>
          <p>Deposit</p>
        </Link>
        <Link
          href={"/swap"}
          className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 bg-zinc-900"
        >
          <div className="bg-white p-2 rounded-full">
            <ArrowRightLeft color="black" />
          </div>
          <p>Exchange</p>
        </Link>
        <Link
          href={"/withdraw"}
          className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 bg-zinc-900"
        >
          <div className="bg-white p-2 rounded-full">
            <ArrowUp color="black" />
          </div>
          <p>Withdraw</p>
        </Link>
      </div>
      <div className="mt-8">
        <SettingsList />
      </div>
    </div>
  );
};

export default Profile;
