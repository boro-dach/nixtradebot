import { apiClient } from "@/shared/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type PositionType = "LONG" | "SHORT";

export interface OpenPositionDto {
  userId: string;
  assetCoingeckoId: string;
  amount: number;
  type: PositionType;
}

const openPosition = async (dto: OpenPositionDto) => {
  const response = await apiClient.post("/trade/position/open", dto);
  return response.data;
};

export const useOpenPosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: openPosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openPositions"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      alert("Позиция успешно открыта!");
    },
    onError: (error: any) => {
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
    },
  });
};
