"use client";
import {
  telegramSelectors,
  useTelegramStore,
} from "@/entities/telegram/model/store";
import SettingsList from "@/widgets/settings-list/ui/SettingsList";
import { ArrowDown, ArrowRightLeft, ArrowUp, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";

import {
  useBalance,
  AssetBalance,
} from "@/entities/balance/api/useTotalBalance";
import { useAssetPrices } from "@/entities/market/api/useAssetPrices";

const Profile = () => {
  const displayName = useTelegramStore(telegramSelectors.displayName);
  const user = useTelegramStore(telegramSelectors.user);
  const userId = useTelegramStore(telegramSelectors.userId);

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <p className="text-muted-foreground">User ID not found</p>
      </div>
    );
  }

  const { balance, isLoading: isLoadingBalance } = useBalance(userId);

  const assetIdsToFetch = useMemo(() => {
    if (!balance) return [];
    return balance.map(
      (asset: AssetBalance) => asset.cryptocurrency.coingeckoId,
    );
  }, [balance]);

  const { prices, isLoadingPrices } = useAssetPrices(assetIdsToFetch);

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

  const isLoading = isLoadingBalance || isLoadingPrices;

  // Функция для получения инициалов
  const getInitials = () => {
    if (!user) return "U";
    const firstInitial = user.first_name?.[0] || "";
    const lastInitial = user.last_name?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase() || "U";
  };

  // Генерация цвета на основе userId
  const getAvatarColor = () => {
    if (!user?.id) return "bg-zinc-700";
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    return colors[user.id % colors.length];
  };

  return (
    <div className="flex flex-col mx-4 gap-4 pb-20">
      <div className="flex flex-row justify-between items-center mt-4">
        <p className="text-lg font-semibold">Profile</p>
      </div>

      <div className="flex flex-col items-center gap-2 w-full mt-4">
        {/* Аватарка с инициалами */}
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ${getAvatarColor()}`}
        >
          {getInitials()}
        </div>
        <p className="font-medium">{displayName}</p>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <p className="font-semibold text-2xl">Total balance:</p>
        <div className="text-4xl h-12 flex items-center">
          {isLoading ? (
            <Loader2 className="w-9 h-9 animate-spin" />
          ) : (
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
