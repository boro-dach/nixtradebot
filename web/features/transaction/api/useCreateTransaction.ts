import { apiClient } from "@/shared/api/api";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export interface CreateTransactionDto {
  user_id: string;
  type: "DEPOSIT" | "WITHDRAW";
  coingeckoId: string;
  amount: number;
}

const createTransaction = async (dto: CreateTransactionDto) => {
  const response = await apiClient.post("/transaction/create", dto);
  return response.data;
};

export const useCreateTransaction = (
  options?: Omit<
    UseMutationOptions<any, Error, CreateTransactionDto>,
    "mutationFn"
  >
) => {
  return useMutation({
    mutationFn: createTransaction,
    ...options,
  });
};
