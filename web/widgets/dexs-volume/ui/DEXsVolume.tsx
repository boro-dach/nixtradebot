"use client";
import { Card, CardContent } from "@/shared/ui/card";
import { mockDEXsVolumeData } from "../model/data";
import { formatStatValue } from "@/shared/lib/formatters";

interface DEXsVolumeWidgetProps {
  volume: number;
}

export const DEXsVolumeWidget = ({ volume }: DEXsVolumeWidgetProps) => {
  const stats = mockDEXsVolumeData;
  const isPositive = stats.change >= 0;

  return (
    <Card className="w-full p-4 bg-zinc-900/90 border-zinc-700/80">
      <CardContent className="p-0 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-slate-50">
            {formatStatValue(volume, "currency")}
          </p>
          <p className="text-sm font-semibold text-green-400">
            {isPositive ? "+" : ""}
            {stats.change.toFixed(2)}%
          </p>
        </div>
        <p className="text-sm text-zinc-400">24h Volume</p>
      </CardContent>
    </Card>
  );
};
