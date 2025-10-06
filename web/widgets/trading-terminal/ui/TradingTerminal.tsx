"use client";
import { useState, useEffect } from "react";
import { TradingChart } from "./TradingChart";
import { ICryptoPair } from "@/entities/pair/model/types";
import { PairSelectDrawer } from "@/features/pair-select/ui/PairSelectDrawer";
import { Button } from "@/shared/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { telegramSelectors, useTelegramStore } from "@/entities/telegram";
import { subtractBalance } from "@/entities/balance/api/substract";
import axios from "axios";
import TimeframeSelect from "@/features/timeframe-select/ui/TimeframeSelect";

interface CoinGeckoPrice {
  id: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export const TradingTerminal = () => {
  const userId = useTelegramStore(telegramSelectors.userId);

  const [currentPair, setCurrentPair] = useState<ICryptoPair>({
    symbol: "bitcoin",
    name: "Bitcoin",
  });
  const [currentTimeframe, setCurrentTimeframe] = useState("7");
  const [amount, setAmount] = useState<number | undefined>();
  const [price, setPrice] = useState<CoinGeckoPrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            headers: {
              "x-cg-demo-api-key": apiKey,
            },
            params: {
              vs_currency: "usd",
              ids: currentPair.symbol,
            },
          }
        );

        if (response.data && response.data[0]) {
          setPrice(response.data[0]);
        }
      } catch (err) {
        setError("Failed to fetch price");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, [currentPair.symbol]);

  const handleTrade = async (direction: "up" | "down") => {
    if (!amount || !userId) return;

    try {
      await subtractBalance({ amount, tgid: userId });
      // Handle trade logic here
    } catch (err) {
      console.error("Trade failed:", err);
    }
  };

  const isPositive = price ? price.price_change_percentage_24h >= 0 : false;

  return (
    <div className="flex flex-col h-full">
      <PairSelectDrawer
        selectedPair={currentPair}
        onSelectPair={setCurrentPair}
      />

      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{currentPair.name}</h2>
          <div className="text-right">
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-sm text-red-500">{error}</div>
            ) : price ? (
              <div>
                <div className="text-xl font-bold">
                  ${price.current_price.toLocaleString()}
                </div>
                <div
                  className={`text-sm flex items-center ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {isPositive ? "+" : ""}
                  {price.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <TimeframeSelect onTimescaleChange={setCurrentTimeframe} />
      </div>

      <TradingChart assetId={currentPair.symbol} days={currentTimeframe} />

      <div className="mt-auto p-4 flex flex-col gap-4 items-center">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount in USD"
          min="0"
          step="0.01"
        />
        <div className="grid grid-cols-2 grid-rows-1 gap-4 w-full">
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3"
            disabled={loading || !amount}
            onClick={() => handleTrade("down")}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Down
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3"
            disabled={loading || !amount}
            onClick={() => handleTrade("up")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Up
          </Button>
        </div>
      </div>
    </div>
  );
};
