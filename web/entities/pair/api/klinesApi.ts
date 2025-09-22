import { binanceApi } from "@/shared/api/binance";
import { ICandlestick } from "../model/types";

export const getPairKlines = async (
  symbol: string,
  interval: string,
  limit = 100
): Promise<ICandlestick[]> => {
  const rawData = await binanceApi.get<any[][]>("klines", {
    symbol,
    interval,
    limit,
  });

  // Форматируем данные под требования lightweight-charts
  return rawData.map((d) => ({
    time: d[0] / 1000,
    open: parseFloat(d[1]),
    high: parseFloat(d[2]),
    low: parseFloat(d[3]),
    close: parseFloat(d[4]),
  }));
};
