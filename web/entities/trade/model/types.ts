export interface TradeHistoryItem {
  id: string;
  createdAt: string;
  fromAmount: string;
  toAmount: string;
  executedPrice: string;
  fromCryptocurrency: {
    symbol: string;
    name: string;
    imageUrl: string | null;
  };
  toCryptocurrency: {
    symbol: string;
    name: string;
    imageUrl: string | null;
  };
}
