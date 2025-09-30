// src/widgets/stablecoin-market-cap/model/useStablecoinData.ts

import { useEffect, useState } from "react";
import {
  getStablecoinGlobalData,
  getMarketChartHistory,
} from "../api/stablecoinApi";

// Структура данных, которую хук отдает компоненту
export interface StablecoinStats {
  marketCap: number;
  change: number;
  chartData: { value: number }[];
}

export const useStablecoinData = () => {
  const [stats, setStats] = useState<StablecoinStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Выполняем оба запроса параллельно для скорости
        const [globalDataResponse, chartDataResponse] = await Promise.all([
          getStablecoinGlobalData(),
          getMarketChartHistory(),
        ]);

        // Собираем итоговый объект с данными
        const combinedStats: StablecoinStats = {
          marketCap: globalDataResponse.data.stablecoin_market_cap.usd,
          change: globalDataResponse.data.stablecoin_24h_percentage_change.usd,
          chartData: chartDataResponse.market_caps.map((cap) => ({
            value: cap[1], // Берем только значение капитализации
          })),
        };

        setStats(combinedStats);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, isLoading, error };
};
