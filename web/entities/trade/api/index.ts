import { apiClient } from "@/shared/api/api";
import { TradeHistoryItem } from "../model/types";

export const fetchTradeHistory = async (
  userId: string | number
): Promise<TradeHistoryItem[]> => {
  const response = await apiClient.get(`/trade/history/${userId}`);
  return response.data;
};
