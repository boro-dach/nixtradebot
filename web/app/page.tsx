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

const Main = () => {
  const user = useTelegramStore(telegramSelectors.user);
  const userId = useTelegramStore(telegramSelectors.userId);
  const isLoading = useTelegramStore(telegramSelectors.isLoading);
  const error = useTelegramStore(telegramSelectors.error);
  const isAuthenticated = useTelegramStore(telegramSelectors.isAuthenticated);
  const displayName = useTelegramStore(telegramSelectors.displayName);
  const webApp = useTelegramStore(telegramSelectors.webApp);
  const [isStarred, setIsStarred] = useState<boolean>(false);

  // Chart data
  const chartData = [
    { month: "Sep", price: 2650 },
    { month: "Oct", price: 2580 },
    { month: "Nov", price: 2720 },
    { month: "Dec", price: 2690 },
    { month: "Jan", price: 2628 },
  ];

  const chartConfig = {
    price: {
      label: "Price",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col p-4 pb-0">
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

        {/* Time Period Buttons */}
        <div className="grid grid-cols-7 bg-zinc-800 mt-4 rounded-lg">
          <Button variant={"ghost"} size="sm" className="text-xs">
            1D
          </Button>
          <Button variant={"ghost"} size="sm" className="text-xs">
            7D
          </Button>
          <Button variant={"outline"} size="sm" className="text-xs">
            1M
          </Button>
          <Button variant={"ghost"} size="sm" className="text-xs">
            1Y
          </Button>
          <Button variant={"ghost"} size="sm" className="text-xs">
            All
          </Button>
          <Button variant={"ghost"} size="sm" className="text-xs">
            Log
          </Button>
          <Button variant={"ghost"} size="sm" className="w-full">
            <Ellipsis className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chart */}
      <ChartContainer className="m-4" config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="mobile"
            type="natural"
            fill="var(--color-mobile)"
            fillOpacity={0.4}
            stroke="var(--color-mobile)"
            stackId="a"
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>

      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <TrendingUp className="w-4 h-4 mr-2" />
            Price
          </Button>
          <Button variant="outline" className="flex-1">
            Market cap
          </Button>
          <Button variant="outline" className="flex-1">
            Vol
          </Button>
          <Button variant="ghost" size="icon">
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ETH Analytics Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">ETH analytics</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            See all
          </Button>
        </div>

        <div className="space-y-4">
          {/* Market Cap */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Stablecoins Market Cap
                  </p>
                  <p className="text-xl font-bold">$121,63b</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700"
                    >
                      +10.00%
                    </Badge>
                  </div>
                </div>
                <div className="w-16 h-8 bg-muted rounded flex items-end justify-center">
                  <div className="w-1 h-2 bg-green-500 rounded-sm mr-0.5"></div>
                  <div className="w-1 h-4 bg-green-500 rounded-sm mr-0.5"></div>
                  <div className="w-1 h-6 bg-green-500 rounded-sm mr-0.5"></div>
                  <div className="w-1 h-3 bg-green-500 rounded-sm"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volume and Holders */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">DEX's Volume</p>
                <p className="text-lg font-bold">$674b</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-700"
                  >
                    +12.00%
                  </Badge>
                </div>
                <Progress value={65} className="mt-2 h-1" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Holders</p>
                <p className="text-lg font-bold">104m</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-700"
                  >
                    +5.5%
                  </Badge>
                </div>
                <div className="flex items-center mt-2">
                  <Users className="w-3 h-3 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto border-t bg-background">
        <div className="flex justify-around py-2">
          <Button variant="ghost" className="flex-1 flex flex-col gap-1 h-12">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col gap-1 h-12">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">Chat</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col gap-1 h-12">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Settings</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col gap-1 h-12">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs">Analytics</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex flex-col gap-1 h-12">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Main;
