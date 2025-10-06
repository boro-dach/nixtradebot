"use client";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/shared/ui/card";
import { formatMarketCap } from "../lib/formatMarketCap";
import { mockStablecoinData } from "../model/data";

interface StablecoinMarketCapWidgetProps {
  marketCap: number;
}

export const StablecoinMarketCapWidget = ({
  marketCap,
}: StablecoinMarketCapWidgetProps) => {
  const stats = mockStablecoinData;
  const isPositive = stats.change >= 0;

  const chartStrokeColor = "#E2E8F0";
  const chartGradientColor = "#A3E635";

  return (
    <Card className="w-full p-4 bg-zinc-900/90 border-zinc-700/80">
      <CardContent className="p-0 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-50">
              {formatMarketCap(marketCap)}
            </p>
            <p className="text-sm font-semibold text-green-400">
              {isPositive ? "+" : ""}
              {stats.change.toFixed(2)}%
            </p>
          </div>
          <p className="text-sm text-zinc-400">Stablecoins Market Cap</p>
        </div>

        <div className="h-12 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.chartData}>
              <defs>
                <linearGradient
                  id="chartGradientStatic"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartGradientColor}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartGradientColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartStrokeColor}
                strokeWidth={2}
                fill="url(#chartGradientStatic)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
