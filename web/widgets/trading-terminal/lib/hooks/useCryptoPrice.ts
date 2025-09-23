import { useState, useEffect } from "react";

interface PriceData {
  symbol: string;
  price: string;
  priceChangePercent: string;
}

export const useCryptoPrice = (symbol: string) => {
  const [price, setPrice] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchPrice = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch price");
        }

        const data = await response.json();
        setPrice({
          symbol: data.symbol,
          price: parseFloat(data.lastPrice).toFixed(2),
          priceChangePercent: parseFloat(data.priceChangePercent).toFixed(2),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();

    // Обновляем цену каждые 5 секунд
    const interval = setInterval(fetchPrice, 5000);

    return () => clearInterval(interval);
  }, [symbol]);

  return { price, loading, error };
};
