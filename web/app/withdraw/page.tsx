"use client";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { Card, CardContent } from "@/shared/ui/card";
import { ChevronDown, Loader2, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateTransaction } from "@/features/transaction/api/useCreateTransaction";
import { useUser } from "@/entities/user/api/useUser";
import {
  telegramSelectors,
  useTelegramStore,
} from "@/entities/telegram/model/store";

const withdrawalMethods = {
  ethereum: "Ethereum",
  tether: "Tether TRC20",
  bitcoin: "Bitcoin",
  toncoin: "TON",
  SBP: "SBP (RUB)",
};

const methodToCoingeckoId: Record<string, string> = {
  ethereum: "ethereum",
  tether: "tether",
  bitcoin: "bitcoin",
  toncoin: "the-open-network",
  SBP: "rub-sbp",
};

const Withdraw = () => {
  const [method, setMethod] = useState<keyof typeof withdrawalMethods>();
  const [value, setValue] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const router = useRouter();

  const userId = useTelegramStore(telegramSelectors.userId);

  const { data: userInfo, isLoading: isLoadingUser } = useUser(
    userId?.toString() ?? "",
  );

  const { mutate, isPending } = useCreateTransaction({
    onSuccess: () => {
      router.push("/gratulation");
    },
    onError: (error: any) => {
      console.error("Failed to create withdrawal request:", error);
      const errorMessage =
        error.response?.data?.message || "Ошибка при создании заявки на вывод.";
      alert(errorMessage);
    },
  });

  const handleCreateWithdrawal = () => {
    if (userInfo?.isBannedWithdraw) {
      alert(
        "Вывод средств заблокирован администратором. Обратитесь в поддержку.",
      );
      return;
    }

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
      user_id: userId?.toString() ?? "",
      type: "WITHDRAW",
      coingeckoId: methodToCoingeckoId[method],
      amount: amount,
    });
  };

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (userInfo?.isBannedWithdraw) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <p className="font-semibold text-lg mb-4">Withdraw</p>
        <Card className="border-red-500">
          <CardContent className="p-6 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-bold mb-2 text-red-500">
              Вывод заблокирован
            </h3>
            <p className="text-muted-foreground mb-4">
              Вывод средств временно ограничен для вашего аккаунта.
            </p>
            <p className="text-sm text-muted-foreground">
              Для получения дополнительной информации обратитесь в службу
              поддержки.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="font-semibold text-lg">Withdraw</p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} className="flex justify-between w-full">
            {method ? withdrawalMethods[method] : "Select method"}
            <ChevronDown className="w-4 h-4" />
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

      {method && method !== "SBP" && (
        <Input
          className="text-sm"
          placeholder="Your wallet address (for crypto)"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
      )}

      {method && method === "SBP" && (
        <Input
          className="text-sm"
          placeholder="Номер телефона или карты (для SBP)"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
      )}

      <Input
        type="number"
        className="text-sm"
        placeholder="Amount"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

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
