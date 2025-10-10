import { apiClient } from "@/shared/api/api";

export const fetchTotalBalance = async (
  userId: string | number
): Promise<number> => {
  const response = await apiClient.get(`/balance/${userId}`);
  return response.data;
};
