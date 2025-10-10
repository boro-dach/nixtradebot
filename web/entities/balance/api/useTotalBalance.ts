import { apiClient } from "@/shared/api/api";
import { useQuery } from "@tanstack/react-query";

export interface AssetBalance {
  id: string;
  amount: string;
  userId: string;
  cryptocurrencyId: number;
  cryptocurrency: {
    id: number;
    coingeckoId: string;
    symbol: string;
    name: string;
    currentPrice: number;
  };
}

export const fetchBalance = async (
  userId: string | number
): Promise<AssetBalance[]> => {
  const response = await apiClient.get<AssetBalance[]>(`/balance/${userId}`);
  return response.data;
};

export const useBalance = (userId: string | number) => {
  const {
    data: balance,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["balance", userId],
    queryFn: () => fetchBalance(userId),
  });

  return { balance, isLoading, error };
};
