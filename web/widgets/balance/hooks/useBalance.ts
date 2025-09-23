import { useState, useEffect } from "react";
import { getBalance } from "@/entities/balance/api/get";

export const useBalance = (tgid: string) => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tgid) {
      setLoading(false);
      return;
    }

    const fetchBalance = async () => {
      try {
        setLoading(true);
        setError(null);

        const userBalance = await getBalance({ tgid });
        setBalance(parseFloat(userBalance.toString()) || 0);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [tgid]);

  return { balance, loading, error };
};
