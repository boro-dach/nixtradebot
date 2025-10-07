import { useState, useEffect } from "react";
import { fetchTotalBalance } from ".";

export const useTotalBalance = (userId: string | number | null) => {
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const getBalance = async () => {
      try {
        setIsLoading(true);
        const balance = await fetchTotalBalance(userId);
        setTotalBalance(balance);
      } catch (err) {
        console.error("Failed to fetch total balance:", err);
        setError("Could not load balance");
      } finally {
        setIsLoading(false);
      }
    };

    getBalance();
  }, [userId]);

  return { totalBalance, isLoading, error };
};
