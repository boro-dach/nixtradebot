"use client";

import React, { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { createTransaction } from "@/entities/transaction/api/create";
import { telegramSelectors, useTelegramStore } from "@/entities/telegram";

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const DepositBtc = () => {
  const btcAddress = "bc1qaytwrtzttgusr2dph76wz2pjrhzdjqtzz5qk3y";

  const userId = useTelegramStore(telegramSelectors.userId);

  const [isCopied, setIsCopied] = useState(false);
  const [amount, setAmount] = useState(0);

  const truncateAddress = (address: string) => {
    if (!address) return "";
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(btcAddress).then(
      () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      },
      (err) => {
        console.error("Не удалось скопировать адрес: ", err);
      }
    );
  };

  return (
    <div className="flex flex-col px-4 items-center gap-8 w-full">
      <h2 className="font-bold text-xl mt-4 text-center">
        Пополнить баланс с помощью Bitcoin
      </h2>
      <div className="flex flex-col gap-3 items-center w-full">
        <p>Переведите сумму:</p>

        <Input
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-xs"
        />

        <p>на адрес:</p>

        <button
          onClick={handleCopyAddress}
          className="cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="font-mono text-sm dark:text-zinc-200">
            {truncateAddress(btcAddress)}
          </span>
          <CopyIcon />
        </button>

        {isCopied && (
          <p className="text-green-500 text-sm mt-1">Адрес скопирован!</p>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs text-center">
        <Button
          onClick={() => {
            createTransaction({
              currency: "BTC",
              amount: amount,
              user_id: userId,
              type: "DEPOSIT",
            });
          }}
          className="dark:text-white w-full cursor-pointer"
        >
          Я перевёл
        </Button>
        <p className="text-zinc-400 text-sm px-4">
          После пополнения ваши средства некоторое время будут на удержании,
          пока перевод не будет подтвержден.
        </p>
      </div>
    </div>
  );
};

export default DepositBtc;
