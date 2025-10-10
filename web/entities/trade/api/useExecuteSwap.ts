// Файл: src/features/trade/api/useExecuteSwap.ts
import { apiClient } from "@/shared/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface ExecuteSwapDto {
  userId: string;
  fromAssetCoingeckoId: string;
  toAssetCoingeckoId: string;
  fromAmount: number;
}

const executeSwap = async (dto: ExecuteSwapDto) => {
  const response = await apiClient.post("/trade/swap/execute", dto);
  return response.data;
};

export const useExecuteSwap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: executeSwap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balance"] });
      alert("Обмен успешно выполнен!");
    },
    onError: (error: any) => {
      alert(`Ошибка обмена: ${error.response?.data?.message || error.message}`);
    },
  });
};
