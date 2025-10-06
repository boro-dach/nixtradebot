"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import TimescaleSelector from "./TimescaleSelector";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTimescaleStore } from "../model/store";

interface ChartData {
  date: string;
  price: number;
  volume: number;
}

interface ChartWithTimescaleProps {
  assetId: string;
  symbol: string;
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(173 50% 80%)",
  },
  volume: {
    label: "Volume",
    color: "hsl(255 50% 85%)",
  },
} satisfies ChartConfig;

// Маппинг опций на количество дней
const timescaleMap: Record<string, string> = {
  "1D": "1",
  "7D": "7",
  "1M": "30",
  "1Y": "365",
  All: "max",
};

const ChartWithTimescale = ({ assetId, symbol }: ChartWithTimescaleProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selected = useTimescaleStore((state) => state.selected);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const days = timescaleMap[selected] || "7";

        console.log(
          "Fetching data for:",
          assetId,
          "period:",
          selected,
          "days:",
          days
        );

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

        // Преобразуем данные в нужный формат
        const prices = response.data.prices;
        const volumes = response.data.total_volumes;

        const formattedData: ChartData[] = prices.map(
          (priceData: [number, number], index: number) => ({
            date: new Date(priceData[0]).toISOString(),
            price: priceData[1],
            volume: volumes[index] ? volumes[index][1] : 0,
          })
        );

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [assetId, selected]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[250px]">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <TimescaleSelector />
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
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
            <linearGradient id="fillVolume" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-volume)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-volume)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
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
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
                formatter={(value, name) => {
                  if (name === "price") {
                    return `$${Number(value).toFixed(2)}`;
                  }
                  return `$${Number(value).toLocaleString()}`;
                }}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="volume"
            type="natural"
            fill="url(#fillVolume)"
            stroke="var(--color-volume)"
            stackId="a"
          />
          <Area
            dataKey="price"
            type="natural"
            fill="url(#fillPrice)"
            stroke="var(--color-price)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default ChartWithTimescale;
