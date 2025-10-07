"use client";
import { Button } from "@/shared/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { telegramSelectors, useTelegramStore } from "@/entities/telegram";
import { useTotalBalance } from "@/entities/balance/api/useTotalBalance";

export const Header = () => {
  const userId = useTelegramStore(telegramSelectors.userId);
  const displayName = useTelegramStore(telegramSelectors.displayName);
  const { totalBalance, isLoading } = useTotalBalance(userId);

  const formatCurrency = (value: number | null) => {
    if (isLoading || value === null)
      return <Loader2 className="w-4 h-4 animate-spin" />;
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

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
          <span className="font-semibold">{formatCurrency(totalBalance)}</span>
        </Button>
      </div>
    </div>
  );
};
