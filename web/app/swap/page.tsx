"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { ChevronDown } from "lucide-react";
import React from "react";

const Swap = () => {
  const [firstCurrency, setFirstCurrency] = React.useState("USDT");
  const [secondCurrency, setSecondCurrency] = React.useState("ETH");
  const [firstAmount, setFirstAmount] = React.useState(0);
  const [secondAmount, setSecondAmount] = React.useState(0);

  const currencies = ["USDT", "ETH", "BTC", "BNB", "XRP", "ADA", "SOL"];

  return (
    <div className="flex flex-col gap-2 pb-16 m-4 h-full">
      <p className="text-lg font-semibold">Exchange</p>
      <div className="grid grid-cols-1 grid-rows-2 gap-2 w-full mt-4">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <p>From</p>
            <p className="text-zinc-400">Balance: 1500 USD</p>
          </CardHeader>
          <CardContent className="grid grid-cols-3 grid-rows-1">
            <Input
              value={firstAmount}
              onChange={(e) => setFirstAmount(Number(e.target.value))}
              className="text-2xl font-semibold border-none !bg-transparent p-0 focus-visible:ring-0"
            />
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-between">
            <p className="text-zinc-400 text-sm">=$375</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="flex flex-row items-center gap-1"
                >
                  {firstCurrency} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-24">
                {currencies.map((currency) => (
                  <Button
                    key={currency}
                    variant="ghost"
                    className="flex flex-row justify-start w-full text-left"
                    onClick={() => setFirstCurrency(currency)}
                  >
                    {currency}
                  </Button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <p>To</p>
            <p className="text-zinc-400">Balance: 1500 USD</p>
          </CardHeader>
          <CardContent className="grid grid-cols-3 grid-rows-1">
            <Input
              value={secondAmount}
              onChange={(e) => setSecondAmount(Number(e.target.value))}
              className="text-2xl font-semibold border-none !bg-transparent p-0 focus-visible:ring-0"
            />
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-between">
            <p className="text-zinc-400 text-sm">=$375</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="flex flex-row items-center gap-1"
                >
                  {secondCurrency} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-24">
                {currencies.map((currency) => (
                  <Button
                    key={currency}
                    variant="ghost"
                    className="flex flex-row justify-start w-full text-left"
                    onClick={() => setSecondCurrency(currency)}
                  >
                    {currency}
                  </Button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      </div>
      <Button className="mt-auto">Swap</Button>
    </div>
  );
};

export default Swap;
