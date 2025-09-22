"use client";
import { useState } from "react";
import { TradingChart } from "./TradingChart";
import { ICryptoPair } from "@/entities/pair/model/types";
import { PairSelectDrawer } from "@/features/pair-select/ui/PairSelectDrawer";
import { TimeframeSelect } from "@/features/timeframe-select/ui/TimeframeSelect";

// FSD: Виджет является владельцем состояния и оркеструет взаимодействие фич и сущностей.
export const TradingTerminal = () => {
  const [currentPair, setCurrentPair] = useState<ICryptoPair>({
    symbol: "BTCUSDT",
    name: "Bitcoin",
    // icon: () => <></> /* Заглушка иконки */,
  });
  const [currentTimeframe, setCurrentTimeframe] = useState("1h");

  return (
    <div className="flex flex-col h-full">
      <PairSelectDrawer
        selectedPair={currentPair}
        onSelectPair={setCurrentPair}
      />

      <div className="px-4 mt-4">
        <TimeframeSelect
          defaultValue={currentTimeframe}
          onSelectTimeframe={setCurrentTimeframe}
        />
      </div>

      <TradingChart pair={currentPair.symbol} interval={currentTimeframe} />

      <div className="mt-auto">{/* <TradeControls /> */}</div>
    </div>
  );
};
