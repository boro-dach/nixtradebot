"use client";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { mockAssets } from "@/entities/asset/model/data";
import { formatCurrency, formatPercentage } from "@/shared/lib/formatters";

export const PortfolioDonutChart = () => {
  const { totalBalance, chartData } = useMemo(() => {
    const total = mockAssets.reduce(
      (sum, asset) => sum + asset.amount * asset.price,
      0
    );
    const data = mockAssets.map((asset) => ({
      name: asset.name,
      value: asset.amount * asset.price,
      color: asset.color,
      percentage: ((asset.amount * asset.price) / total) * 100,
    }));
    return { totalBalance: total, chartData: data };
  }, []);

  const portfolioChange = 33.2;

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Диаграмма */}
      <div className="relative w-64 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={105}
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
        {/* Текст в центре */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-zinc-400 text-sm">Total balance</p>
          <p className="text-3xl font-bold text-white mt-1">
            {formatCurrency(totalBalance)}
          </p>
          <p className={`text-green-400 font-semibold mt-1`}>
            {formatPercentage(portfolioChange)}
          </p>
        </div>
      </div>

      {/* Легенда */}
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
