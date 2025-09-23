"use client";
import { useState } from "react";
import { TradingChart } from "./TradingChart";
import { ICryptoPair } from "@/entities/pair/model/types";
import { PairSelectDrawer } from "@/features/pair-select/ui/PairSelectDrawer";
import { TimeframeSelect } from "@/features/timeframe-select/ui/TimeframeSelect";
import { Button } from "@/shared/ui/button"; // Импортируйте хук
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCryptoPrice } from "../lib/hooks/useCryptoPrice";
import { Input } from "@/shared/ui/input";
import { telegramSelectors, useTelegramStore } from "@/entities/telegram";
import { subtractBalance } from "@/entities/balance/api/substract";

export const TradingTerminal = () => {
  const userId = useTelegramStore(telegramSelectors.userId);

  const [currentPair, setCurrentPair] = useState<ICryptoPair>({
    symbol: "BTCUSDT",
    name: "Bitcoin",
  });
  const [currentTimeframe, setCurrentTimeframe] = useState("1h");
  const [amount, setAmount] = useState<number | undefined>();

  const { price, loading, error } = useCryptoPrice(currentPair.symbol);

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
              <div className="text-sm text-gray-500">Загрузка...</div>
            ) : error ? (
              <div className="text-sm text-red-500">Ошибка: {error}</div>
            ) : price ? (
              <div>
                <div className="text-xl font-bold">${price.price}</div>
                <div
                  className={`text-sm flex items-center ${
                    parseFloat(price.priceChangePercent) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {parseFloat(price.priceChangePercent) >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {price.priceChangePercent}%
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <TimeframeSelect
          defaultValue={currentTimeframe}
          onSelectTimeframe={setCurrentTimeframe}
        />
      </div>

      <TradingChart pair={currentPair.symbol} interval={currentTimeframe} />

      <div className="mt-auto p-4 flex flex-col gap-4 items-center">
        <Input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
          placeholder="Сумма в USD"
        />
        <div className="grid grid-cols-2 grid-rows-1 gap-4 w-full">
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3"
            disabled={loading}
            onClick={() => {
              subtractBalance({ amount: amount, tgid: userId });
            }}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Вниз
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3"
            disabled={loading}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Вверх
          </Button>
        </div>
      </div>
    </div>
  );
};
