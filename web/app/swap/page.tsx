"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { ChevronDown, Loader2, RefreshCw } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";

import {
  useMarketAssets,
  MarketAsset,
} from "@/entities/market/api/useMarketAssets";
import {
  useBalance,
  AssetBalance,
} from "@/entities/balance/api/useTotalBalance";
import { useExecuteSwap } from "@/entities/trade/api/useExecuteSwap";
import {
  telegramSelectors,
  useTelegramStore,
} from "@/entities/telegram/model/store";

const Swap = () => {
  const userId = useTelegramStore(telegramSelectors.userId);

  // Early return if userId is undefined
  if (!userId) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <p className="text-muted-foreground">User ID not found</p>
      </div>
    );
  }

  const { data: marketAssets, isLoading: isLoadingAssets } = useMarketAssets();
  const { balance: userBalances, isLoading: isLoadingBalances } =
    useBalance(userId);

  const [fromAsset, setFromAsset] = useState<MarketAsset | null>(null);
  const [toAsset, setToAsset] = useState<MarketAsset | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");

  const { mutate: executeSwap, isPending: isSwapping } = useExecuteSwap();

  useEffect(() => {
    if (marketAssets && marketAssets.length > 1) {
      if (!fromAsset)
        setFromAsset(
          marketAssets.find((a) => a.symbol.toLowerCase() === "usdt") ||
            marketAssets[0],
        );
      if (!toAsset)
        setToAsset(
          marketAssets.find((a) => a.symbol.toLowerCase() === "btc") ||
            marketAssets[1],
        );
    }
  }, [marketAssets, fromAsset, toAsset]);

  useEffect(() => {
    if (!fromAsset || !toAsset || !fromAmount) {
      setToAmount("");
      return;
    }
    const amount = parseFloat(fromAmount);
    if (!isNaN(amount) && amount > 0 && toAsset.current_price > 0) {
      const rate = fromAsset.current_price / toAsset.current_price;
      const result = amount * rate;
      setToAmount(result.toFixed(6));
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromAsset, toAsset]);

  const fromAmountInUsd = useMemo(() => {
    if (!fromAsset || !fromAmount) return 0;
    const amount = parseFloat(fromAmount);
    return isNaN(amount) ? 0 : amount * fromAsset.current_price;
  }, [fromAmount, fromAsset]);

  const toAmountInUsd = useMemo(() => {
    if (!toAsset || !toAmount) return 0;
    const amount = parseFloat(toAmount);
    return isNaN(amount) ? 0 : amount * toAsset.current_price;
  }, [toAmount, toAsset]);

  const handleSwapAssets = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
  };

  const handleExecute = () => {
    if (!fromAsset || !toAsset || !fromAmount) return;
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) return;

    executeSwap({
      userId: userId.toString(),
      fromAssetCoingeckoId: fromAsset.id,
      toAssetCoingeckoId: toAsset.id,
      fromAmount: amount,
    });
  };

  const getBalanceForAsset = (assetId: string | undefined): number => {
    if (!assetId || !userBalances) return 0;
    const balance = userBalances.find(
      (b) =>
        b.cryptocurrency.coingeckoId.toLowerCase() === assetId.toLowerCase(),
    );
    return balance ? parseFloat(balance.amount) : 0;
  };

  const isLoading = isLoadingAssets || isLoadingBalances;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-16 m-4 h-full">
      <p className="text-lg font-semibold">Exchange</p>

      <Card>
        <CardHeader className="flex flex-row justify-between text-sm text-zinc-400">
          <p>From</p>
          <p>
            You have:{" "}
            {getBalanceForAsset(fromAsset?.id).toLocaleString("en-US", {
              maximumFractionDigits: 4,
            })}
          </p>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <Input
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            className="text-2xl font-semibold border-none !bg-transparent p-0 focus-visible:ring-0 w-2/3"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                {fromAsset && (
                  <Image
                    src={fromAsset.image}
                    alt={fromAsset.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span className="font-bold">
                  {fromAsset?.symbol.toUpperCase()}
                </span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto">
              {marketAssets?.map((asset) => (
                <DropdownMenuItem
                  key={asset.id}
                  onClick={() => setFromAsset(asset)}
                >
                  <Image
                    src={asset.image}
                    alt={asset.name}
                    width={20}
                    height={20}
                    className="mr-2 rounded-full"
                  />
                  {asset.symbol.toUpperCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-between">
          <p className="text-zinc-400 text-sm">
            ≈ $
            {fromAmountInUsd.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </p>
        </CardFooter>
      </Card>

      <div className="flex justify-center my-2">
        <Button size="icon" variant="outline" onClick={handleSwapAssets}>
          <RefreshCw size={16} />
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between text-sm text-zinc-400">
          <p>To</p>
          <p>
            You have:{" "}
            {getBalanceForAsset(toAsset?.id).toLocaleString("en-US", {
              maximumFractionDigits: 4,
            })}
          </p>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <Input
            value={toAmount}
            readOnly
            placeholder="0.0"
            className="text-2xl font-semibold border-none !bg-transparent p-0 focus-visible:ring-0 w-2/3"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                {toAsset && (
                  <Image
                    src={toAsset.image}
                    alt={toAsset.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span className="font-bold">
                  {toAsset?.symbol.toUpperCase()}
                </span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto">
              {marketAssets?.map((asset) => (
                <DropdownMenuItem
                  key={asset.id}
                  onClick={() => setToAsset(asset)}
                >
                  <Image
                    src={asset.image}
                    alt={asset.name}
                    width={20}
                    height={20}
                    className="mr-2 rounded-full"
                  />
                  {asset.symbol.toUpperCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-between">
          <p className="text-zinc-400 text-sm">
            ≈ $
            {toAmountInUsd.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </p>
        </CardFooter>
      </Card>

      <Button
        className="mt-auto"
        onClick={handleExecute}
        disabled={isSwapping || !fromAmount || parseFloat(fromAmount) <= 0}
      >
        {isSwapping ? <Loader2 className="animate-spin" /> : "Swap"}
      </Button>
    </div>
  );
};

export default Swap;
