"use client";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { PositionWithCrypto } from "@/features/trade/api/useOpenPositions";
import Image from "next/image";

interface OpenPositionCardProps {
  position: PositionWithCrypto;
  onClose: (positionId: string) => void;
  isClosing?: boolean;
}

export const OpenPositionCard = ({
  position,
  onClose,
  isClosing = false,
}: OpenPositionCardProps) => {
  const investedAmount = parseFloat(position.investedAmount);
  const currentValue = parseFloat(position.currentValue || "0");
  const profitLoss = parseFloat(position.profitLoss || "0");
  const profitLossPercent = (profitLoss / investedAmount) * 100;

  const isProfit = profitLoss >= 0;
  const isLong = position.type === "LONG";

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {position.cryptocurrency.imageUrl && (
              <Image
                src={position.cryptocurrency.imageUrl}
                alt={position.cryptocurrency.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className="font-semibold text-base">
                {position.cryptocurrency.name.toUpperCase()}
              </h3>
              <p className="text-xs text-muted-foreground">
                {position.cryptocurrency.symbol}
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold ${
              isLong
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {isLong ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {position.type}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Invested</p>
            <p className="font-semibold">${investedAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current Value</p>
            <p className="font-semibold">${currentValue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Entry Price</p>
            <p className="font-semibold">
              ${parseFloat(position.entryPrice).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Current Price</p>
            <p className="font-semibold">
              ${parseFloat(position.currentPrice || "0").toLocaleString()}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center justify-between p-3 rounded-lg mb-3 ${
            isProfit ? "bg-green-500/10" : "bg-red-500/10"
          }`}
        >
          <span className="text-sm font-medium">Profit/Loss</span>
          <div className="text-right">
            <p
              className={`font-bold ${
                isProfit ? "text-green-500" : "text-red-500"
              }`}
            >
              {isProfit ? "+" : ""}${profitLoss.toFixed(2)}
            </p>
            <p
              className={`text-xs ${
                isProfit ? "text-green-500" : "text-red-500"
              }`}
            >
              {isProfit ? "+" : ""}
              {profitLossPercent.toFixed(2)}%
            </p>
          </div>
        </div>

        <Button
          onClick={() => onClose(position.id)}
          disabled={isClosing}
          className="w-full"
          variant="destructive"
        >
          {isClosing ? (
            <>
              <X className="w-4 h-4 mr-2 animate-spin" />
              Closing...
            </>
          ) : (
            <>
              <X className="w-4 h-4 mr-2" />
              Close Position
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Opened: {new Date(position.openedAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
};
