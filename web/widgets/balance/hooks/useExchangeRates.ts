// hooks/useExchangeRates.ts
import { useState, useEffect } from "react";

export interface ExchangeRates {
  USD: number;
  RUB: number;
  UAH: number;
  KZT: number;
}

export const useExchangeRates = () => {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setError(null);

        // Используем exchangerate-api.com (бесплатно, без API ключа)
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates");
        }

        const data = await response.json();

        setRates({
          USD: 1,
          RUB: data.rates.RUB || 95,
          UAH: data.rates.UAH || 37,
          KZT: data.rates.KZT || 450,
        });
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
        setError(err instanceof Error ? err.message : "Unknown error");

        // Fallback курсы при ошибке
        setRates({
          USD: 1,
          RUB: 95,
          UAH: 37,
          KZT: 450,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRates();

    // Обновляем курсы каждые 10 минут
    const interval = setInterval(fetchRates, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Функция для конвертации валют
  const convertCurrency = (
    amount: number,
    fromCurrency: keyof ExchangeRates,
    toCurrency: keyof ExchangeRates
  ): number => {
    if (!rates || !amount) return 0;

    if (fromCurrency === toCurrency) return amount;

    // Конвертируем через USD как базовую валюту
    const usdAmount =
      fromCurrency === "USD" ? amount : amount / rates[fromCurrency];
    const convertedAmount =
      toCurrency === "USD" ? usdAmount : usdAmount * rates[toCurrency];

    return convertedAmount;
  };

  return {
    rates,
    loading,
    error,
    convertCurrency,
  };
};
