"use client";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { ChevronDown, Clipboard, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCreateTransaction } from "@/features/transaction/api/useCreateTransaction";
import {
  telegramSelectors,
  useTelegramStore,
} from "@/entities/telegram/model/store";

const addresses = {
  ethereum: "0x61F6C55caAf6D50b4c8764A17916DB6af61079ed",
  tether: "TDKKeUvjmaog2JgFuLD7NqVvrbjnMfu5pF",
  bitcoin: "zbc1qaytwrtzttgusr2dph76wz2pjrhzdjqtzz5qk3y",
  toncoin: "UQAL4wSs8g145h4704Q1to_mPCjCBEZAv0NVsIjmMFODqy8H",
  SBP: "+79026275096 Озон Амир.А",
};

const methodToCoingeckoId: Record<string, string> = {
  ethereum: "ethereum",
  tether: "tether",
  bitcoin: "bitcoin",
  toncoin: "the-open-network",
  SBP: "rub-sbp",
};

const Deposit = () => {
  const [method, setMethod] = useState<keyof typeof addresses>();
  const [value, setValue] = useState<string>("");
  const { mutate, isPending } = useCreateTransaction();
  const userId = useTelegramStore(telegramSelectors.userId);

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
        <p className="text-muted-foreground">User ID not found</p>
      </div>
    );
  }

  const handleCreateTransaction = () => {
    if (!method || !value) return;
    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    mutate({
      user_id: userId.toString(),
      type: "DEPOSIT",
      coingeckoId: methodToCoingeckoId[method],
      amount: amount,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="font-semibold text-lg">Deposit</p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"outline"}
            className={`flex flex-row w-full items-center justify-between gap-1 ${
              method ? "text-white" : "text-zinc-400"
            }`}
          >
            {method
              ? addresses[method] === addresses.SBP
                ? "SBP (RUB)"
                : method.charAt(0).toUpperCase() + method.slice(1)
              : "Select Method"}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full" align="start">
          <DropdownMenuItem onClick={() => setMethod("ethereum")}>
            Ethereum
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMethod("tether")}>
            Tether TRC20
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMethod("bitcoin")}>
            Bitcoin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMethod("toncoin")}>
            TON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMethod("SBP")}>
            SBP (RUB)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        type="number"
        className="text-sm"
        placeholder="Amount of deposit:"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {value && method && (
        <div className="flex flex-col gap-3 mt-2">
          <p className="font-semibold text-center ">
            Переведите {value} {method.toUpperCase()} на адрес:
          </p>

          <div className="relative">
            <div className="p-3 bg-muted rounded-lg break-all text-xs font-mono text-center">
              {addresses[method]}
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(addresses[method]);
                alert("Address copied!");
              }}
              className="w-full mt-2"
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Copy Address
            </Button>
          </div>

          <Button
            className="w-full mt-4"
            onClick={handleCreateTransaction}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Я перевел"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Deposit;
