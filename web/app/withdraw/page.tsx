// Файл: src/app/withdraw/page.tsx

"use client";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateTransaction } from "@/features/transaction/api/useCreateTransaction";

// 1. ИСПОЛЬЗУЕМ ТОТ ЖЕ СПИСОК МЕТОДОВ, ЧТО И В DEPOSIT
const withdrawalMethods = {
  ethereum: "Ethereum",
  tether: "Tether TRC20",
  bitcoin: "Bitcoin",
  toncoin: "TON",
  SBP: "SBP (RUB)",
};

// 2. ИСПОЛЬЗУЕМ ТОТ ЖЕ МАППИНГ, ЧТО И В DEPOSIT
const methodToCoingeckoId: Record<string, string> = {
  ethereum: "ethereum",
  tether: "tether",
  bitcoin: "bitcoin",
  toncoin: "the-open-network",
  SBP: "rub-sbp", // Условный ID для SBP
};

const Withdraw = () => {
  const [method, setMethod] = useState<keyof typeof withdrawalMethods>();
  const [value, setValue] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const router = useRouter();

  const { mutate, isPending } = useCreateTransaction({
    onSuccess: () => {
      router.push("/gratulation");
    },
    onError: (error) => {
      console.error("Failed to create withdrawal request:", error);
      alert("Ошибка при создании заявки на вывод.");
    },
  });

  const handleCreateWithdrawal = () => {
    // 3. СКРЫВАЕМ ПОЛЕ АДРЕСА ДЛЯ SBP, ЕСЛИ НУЖНО
    // Если для SBP адрес не требуется, добавляем проверку
    if (!method || !value || (method !== "SBP" && !walletAddress)) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }
    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      alert("Пожалуйста, введите корректную сумму.");
      return;
    }

    mutate({
      user_id: "843961428",
      type: "WITHDRAW",
      coingeckoId: methodToCoingeckoId[method],
      amount: amount,
      // Примечание: адрес кошелька нужно будет добавить в DTO на бэкенде
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="font-semibold text-lg mb-4">Withdraw</p>

      {/* Выпадающий список теперь содержит все методы */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} className="flex justify-between w-full">
            {method ? withdrawalMethods[method] : "Select method"}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full" align="start">
          {Object.entries(withdrawalMethods).map(([key, name]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setMethod(key as keyof typeof withdrawalMethods)}
            >
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 4. ПОЛЕ АДРЕСА ОТОБРАЖАЕТСЯ УСЛОВНО */}
      {/* Оно не будет показано, если выбран SBP */}
      {method && method !== "SBP" && (
        <Input
          className="text-sm"
          placeholder="Your wallet address (for crypto)"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
      )}

      {/* Для SBP может понадобиться другое поле, например, номер телефона/карты */}
      {method && method === "SBP" && (
        <Input
          className="text-sm"
          placeholder="Номер телефона или карты (для SBP)"
          value={walletAddress} // Можно использовать тот же стейт или создать новый
          onChange={(e) => setWalletAddress(e.target.value)}
        />
      )}

      {/* Поле для ввода суммы */}
      <Input
        type="number"
        className="text-sm"
        placeholder="Amount"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* Кнопка для создания заявки */}
      <Button
        className="w-full mt-4"
        onClick={handleCreateWithdrawal}
        disabled={isPending || !method || !value}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Create Request"}
      </Button>
    </div>
  );
};

export default Withdraw;
