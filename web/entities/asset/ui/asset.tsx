import { Asset } from "../model/types";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/shared/lib/formatters";

interface AssetRowProps {
  asset: Asset;
}

export const AssetRow = ({ asset }: AssetRowProps) => {
  const totalValue = asset.amount * asset.price;
  const isPositive = asset.priceChange >= 0;

  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
      <div className="flex items-center gap-4">
        <asset.icon className="w-8 h-8" style={{ color: asset.color }} />
        <div>
          <p className="font-bold text-white">{asset.name}</p>
          <div className="flex items-center gap-2 text-sm">
            <p className="text-zinc-400">{formatCurrency(asset.price)}</p>
            <p className={isPositive ? "text-green-400" : "text-red-400"}>
              {formatPercentage(asset.priceChange)}
            </p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-white">{formatNumber(asset.amount)}</p>
        <p className="text-sm text-zinc-400">{formatCurrency(totalValue)}</p>
      </div>
    </div>
  );
};
