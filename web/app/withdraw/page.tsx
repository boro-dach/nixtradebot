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
import Link from "next/link";
import { useState } from "react";

const Withdraw = () => {
  const [method, setMethod] = useState<
    "ETH" | "USDT" | "BTC" | "TON" | "SBP"
  >();
  const [value, setValue] = useState<number>();

  return (
    <div className="flex flex-col gap-2 p-4">
      <p className="font-semibold text-lg mb-4">Withdraw</p>
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
        <div className="flex flex-col items-center mt-4 gap-2 text-center">
          <p>Введите адрес на который желаете вывести средства:</p>
          <Input />
          <p className="text-sm text-left text-zinc-400">
            Тщательно проверьте адрес который указываете на ошибки. Если адрес
            будет указан неверно, средства возврату{" "}
            <span className="text-red-400">не подлежат.</span>
          </p>
          <Link href="/gratulation" className="w-full">
            <Button className="w-full mt-2 cursor-pointer">Вывести</Button>
          </Link>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Withdraw;
