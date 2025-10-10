// Файл: Deposit.tsx

"use client";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { ChevronDown, Clipboard, Loader2 } from "lucide-react"; // 1. Импортируем Loader2
import { useState } from "react";
// 2. Импортируем наш новый хук
import { useCreateTransaction } from "@/features/transaction/api/useCreateTransaction";

// Словарь адресов остается без изменений
const addresses = {
  ethereum: "0x61F6C55caAf6D50b4c8764A17916DB6af61079ed",
  tether: "TDKKeUvjmaog2JgFuLD7NqVvrbjnMfu5pF", // TRC20 USDT
  bitcoin: "zbc1qaytwrtzttgusr2dph76wz2pjrhzdjqtzz5qk3y",
  toncoin: "UQAL4wSs8g145h4704Q1to_mPCjCBEZAv0NVsIjmMFODqy8H",
  SBP: "+79026275096 Озон Амир.А",
};

// Сопоставление метода с coingeckoId, который поймет бэкенд
const methodToCoingeckoId: Record<string, string> = {
  ethereum: "ethereum",
  tether: "tether",
  bitcoin: "bitcoin",
  toncoin: "the-open-network", // У CoinGecko ID для TON - 'the-open-network'
  SBP: "rub-sbp", // Условный ID для SBP, который ваш бэкенд должен уметь обработать
};

const Deposit = () => {
  const [method, setMethod] = useState<keyof typeof addresses>();
  const [value, setValue] = useState<string>(""); // Лучше использовать строку для инпута

  // 3. Получаем функцию `mutate` и статус загрузки из хука
  const { mutate, isPending } = useCreateTransaction();

  const handleCreateTransaction = () => {
    if (!method || !value) return;

    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // 4. Вызываем `mutate` с данными для API
    mutate({
      user_id: "843961428", // Этот ID должен быть динамическим
      type: "DEPOSIT",
      coingeckoId: methodToCoingeckoId[method],
      amount: amount,
    });
  };

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
            {method
              ? addresses[method] === addresses.SBP
                ? "SBP (RUB)"
                : method.charAt(0).toUpperCase() + method.slice(1)
              : "Select Method"}
            <ChevronDown />
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
        type="number" // Используем type="number" для удобства ввода
        className="text-sm"
        placeholder="Amount of deposit:"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && method ? (
        <div className="flex flex-col items-center mt-4 gap-2">
          Переведите {value} {method.toUpperCase()} на адрес:
          <Button
            variant={"ghost"}
            onClick={() => navigator.clipboard.writeText(addresses[method])}
            className="font-mono text-sm break-all cursor-pointer h-auto py-2"
            title="Click to copy"
          >
            {addresses[method]}
            <Clipboard className="ml-2 w-4 h-4" />
          </Button>
          {/* 5. Заменяем <Link> на <Button> с обработчиком onClick */}
          <Button
            className="w-full mt-2 cursor-pointer"
            onClick={handleCreateTransaction}
            disabled={isPending} // Блокируем кнопку во время загрузки
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Я перевел"}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default Deposit;
