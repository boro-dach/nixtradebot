import { apiClient } from "@/shared/api/api";
import { useQuery } from "@tanstack/react-query";

export interface ClosedPosition {
  id: string;
  type: "LONG" | "SHORT";
  status: "CLOSED";
  investedAmount: string;
  profitLoss: string | null;
  openedAt: string;
  closedAt: string | null;
  cryptocurrency: {
    symbol: string;
    name: string;
  };
}

const fetchClosedPositions = async (
  userId: string
): Promise<ClosedPosition[]> => {
  if (!userId) return [];
  const response = await apiClient.get(`/trade/positions/closed/${userId}`);
  return response.data;
};

export const useClosedPositions = (userId: string) => {
  return useQuery({
    queryKey: ["closedPositions", userId],
    queryFn: () => fetchClosedPositions(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};
