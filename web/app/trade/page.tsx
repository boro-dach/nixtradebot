"use client";
import { useState } from "react";

import { Card, CardContent } from "@/shared/ui/card";
import { History, TrendingUp, Info } from "lucide-react";
import { TradingTerminal } from "@/widgets/trading-terminal/ui/TradingTerminal";
import { TradeHistoryList } from "@/widgets/trade-history-list/ui/TradeHistoryList";
import { Header } from "@/widgets/header/ui/header";

const TradingInfo = () => (
  <div className="p-4 h-full overflow-auto">
    <h2 className="text-lg font-semibold mb-4">Trading Info</h2>
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">How it works</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Choose a cryptocurrency from the list</li>
            <li>• Enter the amount you want to trade</li>
            <li>• Click Buy to go long or Sell to go short</li>
            <li>• Monitor your position in real-time</li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Trading Fees</h3>
          <p className="text-sm text-muted-foreground">
            Standard trading fee: 0.1%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Risk Warning</h3>
          <p className="text-sm text-muted-foreground">
            Cryptocurrency trading involves significant risk. Only trade with
            funds you can afford to lose.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default function TradingPage() {
  // Единственное состояние страницы - какая вкладка активна в данный момент.
  const [activeTab, setActiveTab] = useState<"trade" | "history" | "info">(
    "trade"
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      {/* 2. Навигация по вкладкам. Управляет локальным состоянием страницы. */}
      <div className="flex border-b bg-card">
        <button
          onClick={() => setActiveTab("trade")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "trade"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Trade
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "history"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="w-4 h-4" />
          History
        </button>
        <button
          onClick={() => setActiveTab("info")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === "info"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Info className="w-4 h-4" />
          Info
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "trade" && <TradingTerminal />}
        {activeTab === "history" && <TradeHistoryList />}
        {activeTab === "info" && <TradingInfo />}
      </div>
    </div>
  );
}
