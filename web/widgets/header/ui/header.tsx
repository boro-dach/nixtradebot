// Файл: Header.tsx

"use client";
import { Button } from "@/shared/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { telegramSelectors, useTelegramStore } from "@/entities/telegram";
import {
  useBalance,
  AssetBalance,
} from "@/entities/balance/api/useTotalBalance";
import { useAssetPrices } from "@/entities/market/api/useAssetPrices";
import { useMemo } from "react";

export const Header = () => {
  const userId = 843961428;
  const displayName = useTelegramStore(telegramSelectors.displayName);

  const { balance, isLoading: isLoadingBalance } = useBalance(userId);

  const assetIdsToFetch = useMemo(() => {
    if (!balance) return [];
    return balance.map(
      (asset: AssetBalance) => asset.cryptocurrency.coingeckoId
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

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const isLoading = isLoadingBalance || isLoadingPrices;

  return (
    <div className="px-4 py-3 border-b bg-card">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Trading</h1>
          <p className="text-sm text-muted-foreground">
            {displayName || "User"}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Wallet className="w-4 h-4" />
          <span className="font-semibold">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              formatCurrency(totalBalanceValue)
            )}
          </span>
        </Button>
      </div>
    </div>
  );
};
