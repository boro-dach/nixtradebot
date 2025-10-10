import { apiClient } from "@/shared/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface ClosePositionDto {
  positionId: string;
  userId: string;
}

const closePosition = async (dto: ClosePositionDto) => {
  const response = await apiClient.post("/trade/position/close", dto);
  return response.data;
};

export const useClosePosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: closePosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["openPositions"] });
      queryClient.invalidateQueries({ queryKey: ["closedPositions"] });
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      alert("Позиция успешно закрыта!");
    },
    onError: (error: any) => {
      alert(
        `Ошибка закрытия позиции: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });
};
