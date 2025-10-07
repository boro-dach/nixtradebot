import { Card, CardContent } from "@/shared/ui/card";
import { TradeHistoryItem } from "../model/types";

export const TradeHistoryCard = ({ trade }: { trade: TradeHistoryItem }) => {
  // Логика определения типа сделки и активов
  const isBuy = trade.toCryptocurrency.symbol !== "USDT";
  const tradeType = isBuy ? "Buy" : "Sell";
  const assetSymbol = isBuy
    ? trade.toCryptocurrency.symbol
    : trade.fromCryptocurrency.symbol;
  const amountTraded = isBuy
    ? parseFloat(trade.toAmount)
    : parseFloat(trade.fromAmount);
  const totalValue = isBuy
    ? parseFloat(trade.fromAmount)
    : parseFloat(trade.toAmount);

  return (
    <Card className="mb-3">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="font-bold flex items-center">
            <span
              className={`${isBuy ? "text-green-500" : "text-red-500"} mr-2`}
            >
              {tradeType}
            </span>
            {assetSymbol}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(trade.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">
            {amountTraded.toFixed(6)} {assetSymbol}
          </p>
          <p className="text-sm text-muted-foreground">
            ${totalValue.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
