import { apiClient } from "@/shared/api/api";
import { useQuery } from "@tanstack/react-query";
import { User } from "../model/types";

const fetchUser = async (userId: string | number): Promise<User> => {
  const response = await apiClient.get<User>(`/user/${userId}`);
  return response.data;
};

export const useUser = (userId: string | number | undefined) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
