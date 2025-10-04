"use client";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { ChevronDown, Clipboard } from "lucide-react";
import { useState } from "react";

const adresses = {
  ETH: "0x61F6C55caAf6D50b4c8764A17916DB6af61079ed",
  USDT: "TDKKeUvjmaog2JgFuLD7NqVvrbjnMfu5pF",
  BTC: "bc1qaytwrtzttgusr2dph76wz2pjrhzdjqtzz5qk3y",
  TON: "UQAL4wSs8g145h4704Q1to_mPCjCBEZAv0NVsIjmMFODqy8H",
  SBP: "+79026275096 Озон Амир.А",
};

const Deposit = () => {
  const [method, setMethod] = useState<
    "ETH" | "USDT" | "BTC" | "TON" | "SBP"
  >();
  const [value, setValue] = useState<number>();

  return (
    <div className="flex flex-col gap-2 p-4">
      <p className="font-semibold text-lg mb-4">Deposit</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"outline"}
            className={`flex flex-row w-full items-center justify-between gap-1 cursor-pointer ${
              method ? "text-white" : "text-zinc-400"
            }`}
          >
            {method ? method : "Select Method"}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem
            onClick={() => {
              setMethod("ETH");
            }}
          >
            Ethereum
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setMethod("USDT");
            }}
          >
            Tether TRC20
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setMethod("BTC");
            }}
          >
            Bitcoin
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setMethod("TON");
            }}
          >
            TON
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setMethod("SBP");
            }}
          >
            SBP (RUB)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Input
        className="text-sm"
        placeholder="Amount of deposit:"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      ></Input>
      {value && method ? (
        <div className="flex flex-col items-center mt-4 gap-2">
          Переведите {value} {method} на адрес:
          <Button
            variant={"ghost"}
            onClick={() => {
              navigator.clipboard.writeText(adresses[method]);
            }}
            className="font-mono text-sm break-all cursor-pointer"
            title="Click to copy"
          >
            {adresses[method]}
            <Clipboard />
          </Button>
          <Button className="w-full mt-2 cursor-pointer">Я перевел</Button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Deposit;
