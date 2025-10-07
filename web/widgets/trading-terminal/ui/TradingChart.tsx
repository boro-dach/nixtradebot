"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/chart";

interface ChartData {
  timestamp: number;
  price: number;
}

interface TradingChartProps {
  assetId: string;
  days: string;
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(173 50% 80%)",
  },
} satisfies ChartConfig;

export const TradingChart = ({ assetId, days }: TradingChartProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;

        console.log("Fetching chart for:", assetId, "days:", days);

        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${assetId}/market_chart`,
          {
            headers: {
              "x-cg-demo-api-key": apiKey,
            },
            params: {
              vs_currency: "usd",
              days: days,
            },
          }
        );

        const prices = response.data.prices;
        const formattedData: ChartData[] = prices.map(
          (priceData: [number, number]) => ({
            timestamp: priceData[0],
            price: priceData[1],
          })
        );

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (assetId && days) {
      fetchChartData();
    }
  }, [assetId, days]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] px-4">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-price)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-price)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  try {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return "Invalid Date";
                    return date.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  } catch {
                    return "Invalid Date";
                  }
                }}
                formatter={(value) => `$${Number(value).toLocaleString()}`}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="price"
            type="monotone"
            fill="url(#fillPrice)"
            stroke="var(--color-price)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
