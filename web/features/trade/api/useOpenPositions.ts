import { apiClient } from "@/shared/api/api";
import { useQuery } from "@tanstack/react-query";

interface Cryptocurrency {
  id: number;
  coingeckoId: string;
  symbol: string;
  name: string;
  imageUrl: string | null;
}

export interface PositionWithCrypto {
  id: string;
  userId: string;
  cryptocurrencyId: number;
  type: "LONG" | "SHORT";
  status: "OPEN" | "CLOSED";
  entryPrice: string;
  amount: string;
  investedAmount: string;
  currentPrice: string | null;
  currentValue: string | null;
  profitLoss: string | null;
  openedAt: string;
  closedAt: string | null;
  cryptocurrency: Cryptocurrency;
}

const fetchOpenPositions = async (
  userId: string
): Promise<PositionWithCrypto[]> => {
  if (!userId) return [];
  const response = await apiClient.get(`/trade/positions/open/${userId}`);
  return response.data;
};

export const useOpenPositions = (userId: string) => {
  return useQuery({
    queryKey: ["openPositions", userId],
    queryFn: () => fetchOpenPositions(userId),
    enabled: !!userId,
    refetchInterval: 10000,
  });
};
