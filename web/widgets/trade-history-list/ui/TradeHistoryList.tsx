"use client";
import { useState, useEffect } from "react";
import { telegramSelectors, useTelegramStore } from "@/entities/telegram";

import { Card, CardContent } from "@/shared/ui/card";
import { History, Loader2 } from "lucide-react";
import { TradeHistoryItem } from "@/entities/trade/model/types";
import { fetchTradeHistory } from "@/entities/trade/api";
import { TradeHistoryCard } from "@/entities/trade/ui/TradeHistoryCard";

export const TradeHistoryList = () => {
  const userId = useTelegramStore(telegramSelectors.userId);
  const [history, setHistory] = useState<TradeHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);
    fetchTradeHistory(userId)
      .then(setHistory)
      .catch((err) => console.error("Failed to fetch history:", err))
      .finally(() => setIsLoading(false));
  }, [userId]);

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Trade History</h2>
      {isLoading ? (
        <div className="text-center p-8">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" />
        </div>
      ) : history.length > 0 ? (
        history.map((trade) => (
          <TradeHistoryCard key={trade.id} trade={trade} />
        ))
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <History className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No trades yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
