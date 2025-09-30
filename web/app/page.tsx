"use client";
import { useTelegramStore, telegramSelectors } from "@/entities/telegram";
import Balance from "@/widgets/balance/ui/balance";
import Deposit from "@/features/deposit/ui/deposit";
import Help from "@/features/help/ui/help";
import Trade from "@/features/trade/ui/trade";
import Withdraw from "@/features/withdraw/ui/withdraw";
import ActivesList from "@/widgets/actives-list/ui/actives-list";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  Ellipsis,
  List,
  Share2,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  BarChart3,
  Users,
  Home,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/chart";
import ChartWithTimescale from "@/widgets/chart-with-timescale/ui/ChartWithTimescale";
import { StablecoinMarketCapWidget } from "@/widgets/stablecoin-market-cap/ui/StablecoinMarketCap";
import { DEXsVolumeWidget } from "@/widgets/dexs-volume/ui/DEXsVolume";
import { TotalHoldersWidget } from "@/widgets/total-holders/ui/TotalHolders";

const Main = () => {
  const user = useTelegramStore(telegramSelectors.user);
  const userId = useTelegramStore(telegramSelectors.userId);
  const isLoading = useTelegramStore(telegramSelectors.isLoading);
  const error = useTelegramStore(telegramSelectors.error);
  const isAuthenticated = useTelegramStore(telegramSelectors.isAuthenticated);
  const displayName = useTelegramStore(telegramSelectors.displayName);
  const webApp = useTelegramStore(telegramSelectors.webApp);
  const [isStarred, setIsStarred] = useState<boolean>(false);

  return (
    <div className="flex flex-col flex-1 bg-background mx-4 gap-2">
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
              <DropdownMenuContent>
                <DropdownMenuItem>Ethereum</DropdownMenuItem>
                <DropdownMenuItem>Bitcoin</DropdownMenuItem>
                <DropdownMenuItem>Other</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-lg font-semibold">
              Ethereum{" "}
              <span className="text-sm text-muted-foreground font-normal">
                ETH
              </span>
            </p>
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
            <Button variant={"secondary"} className="w-8 h-8 cursor-pointer">
              <Share2 />
            </Button>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex flex-row mt-4 gap-2 items-end">
          <p className="text-3xl font-bold">$2,628.43</p>
          <div className="flex items-center gap-1 mb-1">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <p className="text-red-500 font-medium">-3.2%</p>
          </div>
        </div>
      </div>

      <ChartWithTimescale />
      <StablecoinMarketCapWidget />
      <div className="grid grid-cols-2 grid-rows-1 gap-2">
        <DEXsVolumeWidget />
        <TotalHoldersWidget />
      </div>
    </div>
  );
};

export default Main;
