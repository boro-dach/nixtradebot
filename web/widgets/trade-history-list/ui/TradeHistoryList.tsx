"use client";

import { Card, CardContent } from "@/shared/ui/card";
import { History, Loader2 } from "lucide-react";
// 1. Импортируем хук для ПОЗИЦИЙ
import { useClosedPositions } from "@/features/trade/api/useClosedPositions";
import { TradeHistoryCard } from "@/entities/trade/ui/TradeHistoryCard";

export const TradeHistoryList = ({ userId }: { userId: string }) => {
  // 2. Используем правильный хук
  const { data: positions, isLoading } = useClosedPositions(userId);

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Trade History</h2>
      {isLoading ? (
        <div className="text-center p-8">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" />
        </div>
      ) : positions && positions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {positions.map((position) => (
            <TradeHistoryCard key={position.id} position={position} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <History className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No closed positions yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
