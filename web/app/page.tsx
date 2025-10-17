"use client";
import { useTelegramStore, telegramSelectors } from "@/entities/telegram";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { List, Share2, Star, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import ChartWithTimescale from "@/widgets/chart-with-timescale/ui/ChartWithTimescale";
import { StablecoinMarketCapWidget } from "@/widgets/stablecoin-market-cap/ui/StablecoinMarketCap";
import { DEXsVolumeWidget } from "@/widgets/dexs-volume/ui/DEXsVolume";
import { TotalHoldersWidget } from "@/widgets/total-holders/ui/TotalHolders";
import { getAssets } from "@/entities/asset/api/get-assets";

// Типы данных
interface Asset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

const Main = () => {
  const user = useTelegramStore(telegramSelectors.user);
  const userId = useTelegramStore(telegramSelectors.userId);
  const displayName = useTelegramStore(telegramSelectors.displayName);

  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Расчет статистики
  const stats = {
    totalMarketCap: assets.reduce((sum, asset) => sum + asset.market_cap, 0),
    total24hVolume: assets.reduce((sum, asset) => sum + asset.total_volume, 0),
    stablecoinMarketCap: assets
      .filter((asset) =>
        ["usdt", "usdc", "dai", "usds", "pyusd", "usde", "bsc-usd"].includes(
          asset.symbol.toLowerCase()
        )
      )
      .reduce((sum, asset) => sum + asset.market_cap, 0),
  };

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await getAssets();
        setAssets(data);
        // По умолчанию выбираем Ethereum
        const ethereum = data.find((asset: Asset) => asset.id === "ethereum");
        if (ethereum) {
          setSelectedAsset(ethereum);
        }
      } catch (err) {
        console.error("Failed to fetch assets:", err);
      }
    };

    fetchAssets();
  }, []);

  // Фильтрация ассетов по поиску
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  // Форматирование процентов
  const formatPercent = (percent: number) => {
    const formatted = Math.abs(percent).toFixed(2);
    return percent >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  if (!selectedAsset) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading assets...</p>
      </div>
    );
  }

  const priceChange = selectedAsset.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <div className="flex flex-col flex-1 bg-background mx-4 gap-2 pb-20">
      <div className="flex flex-col mt-4 pb-0">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"secondary"}
                  className="w-8 h-8 cursor-pointer"
                >
                  <List />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-[400px] overflow-y-auto w-[300px]">
                <div className="px-2 py-2 sticky top-0 bg-background z-10 border-b">
                  <input
                    type="text"
                    placeholder="Search assets..."
                    className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {filteredAssets.map((asset) => (
                  <DropdownMenuItem
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{asset.name}</span>
                      <span className="text-xs text-muted-foreground uppercase">
                        {asset.symbol}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <img
                src={selectedAsset.image}
                alt={selectedAsset.name}
                className="w-6 h-6 rounded-full"
              />
              <p className="text-lg font-semibold">
                {selectedAsset.name}{" "}
                <span className="text-sm text-muted-foreground font-normal uppercase">
                  {selectedAsset.symbol}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-2 items-center">
            <Button
              variant={"secondary"}
              className="w-8 h-8 cursor-pointer"
              onClick={() => setIsStarred(!isStarred)}
            >
              <Star
                className={isStarred ? "fill-yellow-400 text-yellow-400" : ""}
              />
            </Button>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex flex-row mt-4 gap-2 items-end">
          <p className="text-3xl font-bold">
            {formatPrice(selectedAsset.current_price)}
          </p>
          <div className="flex items-center gap-1 mb-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <p
              className={`font-medium ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {formatPercent(priceChange)}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex flex-row gap-4 mt-2 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Market Cap: </span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
              maximumFractionDigits: 2,
            }).format(selectedAsset.market_cap)}
          </div>
          <div>
            <span className="font-medium">24h Volume: </span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
              maximumFractionDigits: 2,
            }).format(selectedAsset.total_volume)}
          </div>
        </div>
      </div>

      <ChartWithTimescale
        assetId={selectedAsset.id}
        symbol={selectedAsset.symbol}
      />
      <StablecoinMarketCapWidget marketCap={stats.stablecoinMarketCap} />

      <div className="grid grid-cols-2 grid-rows-1 gap-2">
        <DEXsVolumeWidget volume={stats.total24hVolume} />
        <TotalHoldersWidget totalAssets={assets.length} />
      </div>
    </div>
  );
};

export default Main;
