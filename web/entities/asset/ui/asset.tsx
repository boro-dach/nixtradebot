"use client";

import Image from "next/image";
import { formatCurrency } from "@/shared/lib/formatters";
import { PortfolioAsset } from "@/app/portfolio/page";

export const AssetRow = ({ asset }: { asset: PortfolioAsset }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
      {/* Левая часть: Иконка и название */}
      <div className="flex items-center gap-4">
        {/* Проверяем, есть ли imageUrl */}
        {asset.imageUrl ? (
          // Если есть - используем next/image
          <Image
            src={asset.imageUrl}
            alt={asset.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          // Если нет - показываем заглушку с первой буквой символа
          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-white">
            {asset.symbol.slice(0, 1)}
          </div>
        )}
        <div>
          <p className="font-bold text-white">{asset.name}</p>
          <p className="text-sm text-zinc-400">{asset.symbol}</p>
        </div>
      </div>

      {/* Правая часть: Стоимость и количество */}
      <div className="text-right">
        <p className="font-bold text-white">{formatCurrency(asset.value)}</p>
        <p className="text-sm text-zinc-400">
          {asset.amount.toLocaleString("en-US", { maximumFractionDigits: 6 })}{" "}
          {asset.symbol}
        </p>
      </div>
    </div>
  );
};
