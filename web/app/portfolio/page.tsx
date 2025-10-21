"use client";

import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";

import { AssetsList } from "@/widgets/assets-list/ui/AssetsList";
import { PortfolioDonutChart } from "@/widgets/portfolio-donut-chart/ui/PortfolioDonutChart";

import {
  useBalance,
  AssetBalance,
} from "@/entities/balance/api/useTotalBalance";
import { useAssetPrices } from "@/entities/market/api/useAssetPrices";

import { PortfolioAsset } from "@/entities/asset/model/types";
import {
  telegramSelectors,
  useTelegramStore,
} from "@/entities/telegram/model/store";

const Portfolio = () => {
  const userId = useTelegramStore(telegramSelectors.userId);

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <p className="text-muted-foreground">User ID not found</p>
      </div>
    );
  }

  const { balance: userBalances, isLoading: isLoadingBalance } =
    useBalance(userId);

  const assetIdsToFetch = useMemo(() => {
    if (!userBalances) return [];
    return userBalances.map(
      (asset: AssetBalance) => asset.cryptocurrency.coingeckoId,
    );
  }, [userBalances]);

  const { prices, isLoadingPrices } = useAssetPrices(assetIdsToFetch);

  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const nameFixes: Record<string, string> = {
    "the-open-network": "TON",
  };

  const portfolioAssets: PortfolioAsset[] = useMemo(() => {
    if (!userBalances || !prices || prices.size === 0) return [];

    return userBalances.map((asset) => {
      const coingeckoId = asset.cryptocurrency.coingeckoId;
      const amount = parseFloat(asset.amount);
      const price = prices.get(coingeckoId) || 0;

      const displayName =
        nameFixes[coingeckoId] || capitalize(asset.cryptocurrency.name);

      return {
        id: asset.id,
        name: displayName,
        symbol: asset.cryptocurrency.symbol.toUpperCase(),
        amount,
        price,
        value: amount * price,
      };
    });
  }, [userBalances, prices]);

  const isLoading = isLoadingBalance || isLoadingPrices;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-4 gap-4 pb-20">
      <div className="flex flex-row justify-between items-center mt-4">
        <p className="text-lg font-semibold">Portfolio</p>
      </div>

      <PortfolioDonutChart assets={portfolioAssets} />
      <AssetsList assets={portfolioAssets} />
    </div>
  );
};

export default Portfolio;
