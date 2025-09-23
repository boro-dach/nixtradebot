"use client";
import { telegramSelectors, useTelegramStore } from "@/entities/telegram";
import { useCurrencyStore } from "@/features/choose-currency/model/store";
import ChooseCurrency from "@/features/choose-currency/ui/choose-currency";
import React from "react";
import { useBalance } from "../hooks/useBalance";
import { useExchangeRates } from "../hooks/useExchangeRates";

const Balance = () => {
  const { currency } = useCurrencyStore();
  const userId = useTelegramStore(telegramSelectors.userId);
  const {
    balance,
    loading: balanceLoading,
    error: balanceError,
  } = useBalance(String(userId));
  const {
    convertCurrency,
    loading: ratesLoading,
    error: ratesError,
  } = useExchangeRates();

  const convertedBalance = React.useMemo(() => {
    if (balanceLoading || ratesLoading || !balance) return "0.00";

    const converted = convertCurrency(balance, "USD", currency as any);
    return converted.toFixed(2);
  }, [balance, currency, convertCurrency, ratesLoading, balanceLoading]);

  const getCurrencySymbol = (currency: string) => {
    const symbols = {
      RUB: "₽",
      USD: "$",
      UAH: "₴",
      KZT: "₸",
      EUR: "€",
    };
    return symbols[currency as keyof typeof symbols] || "";
  };

  if (balanceError || ratesError) {
    return (
      <div className="flex flex-col items-center h-full">
        <p className="text-red-500">
          {balanceError
            ? "Ошибка загрузки баланса"
            : "Ошибка загрузки курсов валют"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-row gap-2 items-center text-zinc-500 font-semibold">
        <p>Ваш баланс в</p>
        <ChooseCurrency />
      </div>

      <p className="text-4xl">
        {balanceLoading || ratesLoading ? (
          <span className="text-zinc-400 animate-pulse">Загрузка...</span>
        ) : (
          <>
            {convertedBalance.split(".")[0]}
            <span className="text-zinc-400 pr-1">
              .{convertedBalance.split(".")[1]}
              {getCurrencySymbol(currency)}
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default Balance;
