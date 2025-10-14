"use client";
import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { TrendingUp, TrendingDown, Loader2, ChevronDown } from "lucide-react";
import Image from "next/image";

// API и другие компоненты
import {
  useMarketAssets,
  MarketAsset,
} from "@/entities/market/api/useMarketAssets";
import { useOpenPosition } from "@/features/trade/api/useOpenPosition";
import { useOpenPositions } from "@/features/trade/api/useOpenPositions";
import { useClosePosition } from "@/features/trade/api/useClosePosition";
import { PairSelectDrawer } from "@/features/pair-select/ui/PairSelectDrawer";
import TimeframeSelect from "@/features/timeframe-select/ui/TimeframeSelect";
import { TradingChart } from "./TradingChart";
import { OpenPositionCard } from "@/entities/trade/ui/OpenPositionCard";

export const TradingTerminal = ({ userId }: { userId: string }) => {
  const { data: marketAssets, isLoading: isLoadingAssets } = useMarketAssets();
  const { mutate: openPosition, isPending: isOpeningPosition } =
    useOpenPosition();
  const { data: openPositions, isLoading: isLoadingPositions } =
    useOpenPositions(userId);
  const { mutate: closePosition, isPending: isClosingPosition } =
    useClosePosition();

  // Состояния UI
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [currentTimeframe, setCurrentTimeframe] = useState("7");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [closingPositionId, setClosingPositionId] = useState<string | null>(
    null
  );

  // Установка актива по умолчанию (Bitcoin)
  useEffect(() => {
    if (marketAssets && !selectedAsset) {
      setSelectedAsset(
        marketAssets.find((a) => a.id === "bitcoin") || marketAssets[0]
      );
    }
  }, [marketAssets, selectedAsset]);

  const handleTrade = (direction: "LONG" | "SHORT") => {
    if (!amount || !userId || !selectedAsset) return;
    const tradeAmount = parseFloat(amount);
    if (isNaN(tradeAmount) || tradeAmount <= 0) {
      alert("Введите корректную сумму");
      return;
    }

    openPosition({
      userId: userId,
      assetCoingeckoId: selectedAsset.id,
      amount: tradeAmount,
      type: direction,
    });
  };

  const handleClosePosition = (positionId: string) => {
    setClosingPositionId(positionId);
    closePosition(
      { positionId, userId },
      {
        onSettled: () => {
          setClosingPositionId(null);
        },
      }
    );
  };

  // Получаем данные напрямую из `selectedAsset`
  const price = selectedAsset?.current_price || 0;
  const priceChange = selectedAsset?.price_change_percentage_24h || 0;
  const isPositive = priceChange >= 0;

  if (isLoadingAssets || !selectedAsset) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-4">
      {/* Обертка для "шторки" выбора актива */}
      <PairSelectDrawer
        onSelectPair={setSelectedAsset}
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      >
        {/* Кнопка-триггер для открытия "шторки" */}
        <div className="px-4">
          <Button
            variant="outline"
            className="flex items-center justify-between w-full text-lg py-6"
          >
            <div className="flex items-center gap-2">
              <Image
                src={selectedAsset.image}
                alt={selectedAsset.name}
                width={28}
                height={28}
              />
              <span className="font-bold">{selectedAsset.name}</span>
            </div>
            <ChevronDown size={20} />
          </Button>
        </div>
      </PairSelectDrawer>

      {/* Цена и процент изменения */}
      <div className="px-4 py-2 mt-2">
        <div className="flex items-center justify-between">
          <div className="text-right w-full">
            <div className="text-xl font-bold">${price.toLocaleString()}</div>
            <div
              className={`text-sm flex items-center justify-end ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Открытые позиции */}
      {!isLoadingPositions && openPositions && openPositions.length > 0 && (
        <div className="px-4 my-4">
          <h3 className="font-semibold text-lg mb-3">Open Positions</h3>
          <div className="flex flex-col gap-3">
            {openPositions.map((position) => (
              <OpenPositionCard
                key={position.id}
                position={position}
                onClose={handleClosePosition}
                isClosing={
                  isClosingPosition && closingPositionId === position.id
                }
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 px-4 my-4">
        <TimeframeSelect onTimescaleChange={setCurrentTimeframe} />
      </div>

      <TradingChart assetId={selectedAsset.id} days={currentTimeframe} />

      {/* Форма открытия позиции */}
      <div className="p-4 flex flex-col gap-4 items-center">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in USD"
        />
        <div className="grid grid-cols-2 grid-rows-1 gap-4 w-full">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3"
            disabled={isOpeningPosition || !amount}
            onClick={() => handleTrade("LONG")}
          >
            {isOpeningPosition ? (
              <Loader2 className="animate-spin" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            Купить
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3"
            disabled={isOpeningPosition || !amount}
            onClick={() => handleTrade("SHORT")}
          >
            {isOpeningPosition ? (
              <Loader2 className="animate-spin" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-2" />
            )}
            Продать
          </Button>
        </div>
      </div>
    </div>
  );
};
