"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { History, TrendingUp, Info } from "lucide-react";
import { TradingTerminal } from "@/widgets/trading-terminal/ui/TradingTerminal";
import { TradeHistoryList } from "@/widgets/trade-history-list/ui/TradeHistoryList";
import { Header } from "@/widgets/header/ui/header";

const userId = "843961428";

const useConfig = () => {
  const [config, setConfig] = useState({
    vatPercentage: 0,
    minDeposit: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/config/all`
        );
        if (response.ok) {
          const data = await response.json();
          setConfig({
            vatPercentage: data.config.vatPercentage || 0,
            minDeposit: data.config.minDeposit || 0,
            loading: false,
          });
        } else {
          setConfig((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Failed to fetch config:", error);
        setConfig((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchConfig();

    const interval = setInterval(fetchConfig, 30000);
    return () => clearInterval(interval);
  }, []);

  return config;
};

const TradingInfo = ({
  vatPercentage,
  loading,
}: {
  vatPercentage: number;
  loading: boolean;
}) => (
  <div className="p-4">
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
          <h3 className="font-semibold mb-2">Trading Fees (VAT)</h3>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Current VAT rate:{" "}
                <span className="font-semibold text-foreground">
                  {vatPercentage}%
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                This fee is applied to withdrawals and trading operations
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Fee Calculation Example</h3>
          {!loading && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>If you withdraw $1000:</p>
              <p>
                • VAT ({vatPercentage}%): $
                {((1000 * vatPercentage) / 100).toFixed(2)}
              </p>
              <p>
                • You receive: $
                {(1000 - (1000 * vatPercentage) / 100).toFixed(2)}
              </p>
            </div>
          )}
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
  const [activeTab, setActiveTab] = useState<"trade" | "history" | "info">(
    "trade"
  );
  const { vatPercentage, minDeposit, loading } = useConfig();

  return (
    <div className="flex flex-col bg-background">
      <Header />

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

      {!loading && vatPercentage > 0 && (
        <div className="bg-muted/50 px-4 py-2 text-xs text-center border-b">
          <span className="text-muted-foreground">
            Current VAT:{" "}
            <span className="font-semibold text-foreground">
              {vatPercentage}%
            </span>{" "}
            • Applied to withdrawals and trades
          </span>
        </div>
      )}

      <div className="flex-1 ">
        {activeTab === "trade" && <TradingTerminal userId={userId} />}
        {activeTab === "history" && <TradeHistoryList userId={userId} />}
        {activeTab === "info" && (
          <TradingInfo vatPercentage={vatPercentage} loading={loading} />
        )}
      </div>
    </div>
  );
}
