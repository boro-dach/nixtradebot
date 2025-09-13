"use client";

import { useCurrencyStore } from "@/features/choose-currency/model/store";
import ChooseCurrency from "@/features/choose-currency/ui/choose-currency";
import React from "react";

const Balance = () => {
  const { currency } = useCurrencyStore();

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-row gap-2 items-center text-zinc-500 font-semibold">
        <p>Ваш баланс в</p>
        <ChooseCurrency />
      </div>
      <p className="text-4xl">
        0.
        <span className="text-zinc-400 pr-1">
          00
          {currency === "RUB"
            ? "₽"
            : currency === "USD"
            ? "$"
            : currency === "UAH"
            ? "₴"
            : currency === "KZT"
            ? "₸"
            : ""}
        </span>
      </p>
    </div>
  );
};

export default Balance;
