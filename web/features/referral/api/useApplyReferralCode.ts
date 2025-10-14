import { apiClient } from "@/shared/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ApplyReferralCodeDto {
  userId: string;
  referralCode: string;
}

const applyReferralCode = async (dto: ApplyReferralCodeDto) => {
  const response = await apiClient.post("/user/referral/apply", dto);
  return response.data;
};

export const useApplyReferralCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyReferralCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      alert("Реферальный код успешно применен!");
    },
    onError: (error: any) => {
      alert(`Ошибка: ${error.response?.data?.message || error.message}`);
    },
  });
};
