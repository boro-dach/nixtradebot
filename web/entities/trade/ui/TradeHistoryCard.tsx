"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { formatCurrency } from "@/shared/lib/formatters";
// 1. Импортируем тип для закрытой ПОЗИЦИИ
import { ClosedPosition } from "@/features/trade/api/useClosedPositions";

// 2. Компонент теперь принимает `position` вместо `trade`
export const TradeHistoryCard = ({
  position,
}: {
  position: ClosedPosition;
}) => {
  const profitLoss = Number(position.profitLoss || 0);
  const isProfit = profitLoss >= 0;

  // Форматируем дату закрытия
  const formattedDate = position.closedAt
    ? new Date(position.closedAt).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <Card className="mb-3 bg-zinc-900 border-zinc-800">
      <CardContent className="p-4 flex justify-between items-center">
        {/* Левая часть: информация о сделке */}
        <div>
          <p className="font-bold flex items-center">
            {position.cryptocurrency.symbol.toUpperCase()}
            <span
              className={`ml-2 text-sm font-semibold ${
                position.type === "LONG" ? "text-green-500" : "text-red-500"
              }`}
            >
              {position.type}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
        </div>
        {/* Правая часть: финансовый результат */}
        <div className="text-right">
          <p
            className={`font-bold text-lg ${
              isProfit ? "text-green-500" : "text-red-500"
            }`}
          >
            {isProfit ? "+" : ""}
            {formatCurrency(profitLoss)}
          </p>
          <p className="text-sm text-muted-foreground">
            Invested: {formatCurrency(Number(position.investedAmount))}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
