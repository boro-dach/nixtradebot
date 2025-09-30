// src/widgets/stablecoin-market-cap/ui/data.ts

// Структура данных, которую использует наш компонент
export interface StablecoinStats {
  marketCap: number;
  change: number;
  chartData: { value: number }[];
}

export const mockStablecoinData: StablecoinStats = {
  marketCap: 121630000000, // 121.63b
  change: 12.0,
  chartData: [
    { value: 2500 },
    { value: 3100 },
    { value: 2400 },
    { value: 3400 },
    { value: 3100 },
    { value: 3900 },
    { value: 4500 },
    { value: 4900 },
    { value: 4600 },
    { value: 4100 },
  ],
};
