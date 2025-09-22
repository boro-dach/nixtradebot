export interface ICryptoPair {
  symbol: string; // e.g., "BTCUSDT"
  name: string; // e.g., "Bitcoin"
}

export interface ICandlestick {
  time: number; // Unix timestamp в секундах
  open: number;
  high: number;
  low: number;
  close: number;
}
