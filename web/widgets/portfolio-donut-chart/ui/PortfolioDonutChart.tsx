// Файл: src/widgets/portfolio-donut-chart/ui/PortfolioDonutChart.tsx

"use client";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency, formatPercentage } from "@/shared/lib/formatters";
import { PortfolioAsset } from "@/entities/asset/model/types";

// Определяем цвета (можно вынести в константы)
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export const PortfolioDonutChart = ({
  assets,
}: {
  assets: PortfolioAsset[];
}) => {
  const { totalBalance, chartData } = useMemo(() => {
    if (!assets || assets.length === 0) {
      return { totalBalance: 0, chartData: [] };
    }

    // Считаем общую сумму прямо из подготовленных данных
    const total = assets.reduce((sum, asset) => sum + asset.value, 0);

    const data = assets.map((asset, index) => ({
      name: asset.name,
      value: asset.value,
      color: COLORS[index % COLORS.length],
      percentage: (asset.value / total) * 100,
    }));

    return { totalBalance: total, chartData: data };
  }, [assets]);

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="relative w-72 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={110}
              outerRadius={120}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-zinc-400 text-sm">Total balance</p>
          <p className="text-3xl font-bold text-white mt-1">
            {formatCurrency(totalBalance)}
          </p>
          {/* <p className={`text-green-400 font-semibold mt-1`}>
            {formatPercentage(portfolioChange)}
          </p> */}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white">{entry.name}</span>
            <span className="text-zinc-400">
              {entry.percentage.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
