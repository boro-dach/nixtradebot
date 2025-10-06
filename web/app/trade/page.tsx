"use client";
import { TradingTerminal } from "@/widgets/trading-terminal/ui/TradingTerminal";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Wallet, History, TrendingUp, Info } from "lucide-react";
import { useState } from "react";
import { telegramSelectors, useTelegramStore } from "@/entities/telegram";

export default function TradingPage() {
  const [activeTab, setActiveTab] = useState<"trade" | "history" | "info">(
    "trade"
  );
  const userId = useTelegramStore(telegramSelectors.userId);
  const displayName = useTelegramStore(telegramSelectors.displayName);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar */}
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
            <span className="font-semibold">$0.00</span>
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b bg-card">
        <button
          onClick={() => setActiveTab("trade")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "trade"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Trade
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "history"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="w-4 h-4 inline mr-2" />
          History
        </button>
        <button
          onClick={() => setActiveTab("info")}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "info"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Info className="w-4 h-4 inline mr-2" />
          Info
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "trade" && <TradingTerminal />}

        {activeTab === "history" && (
          <div className="p-4 h-full overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Trade History</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <History className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No trades yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your trading history will appear here
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "info" && (
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
                    Cryptocurrency trading involves significant risk. Only trade
                    with funds you can afford to lose.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
