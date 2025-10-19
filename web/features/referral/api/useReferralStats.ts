import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Типы данных
export interface ReferralSummary {
  totalReferrals: number;
  activeReferrals: number;
  totalEarned: number;
  referralCode: string;
}

export interface ReferralDetail {
  tgid: string;
  username: string;
  joinedAt: string;
  totalDeposits: number;
  earnedFromUser: number;
  depositsCount: number;
}

export interface ReferralStats {
  totalReferrals: number;
  totalEarned: number;
  referralCode: string;
  referrals: ReferralDetail[];
}

export interface ReferralListResponse {
  referrals: ReferralDetail[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useReferralSummary = (userId: string | undefined) => {
  return useQuery<ReferralSummary>({
    queryKey: ["referralSummary", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const { data } = await axios.get(
        `${API_BASE_URL}/user/${userId}/referral/summary`
      );
      return data;
    },
    enabled: !!userId,
    staleTime: 30000, // 30 секунд
    gcTime: 300000, // 5 минут
  });
};

/**
 * Хук для получения полной статистики рефералов
 */
export const useReferralStats = (userId: string | undefined) => {
  return useQuery<ReferralStats>({
    queryKey: ["referralStats", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const { data } = await axios.get(
        `${API_BASE_URL}/user/${userId}/referral/stats`
      );
      return data;
    },
    enabled: !!userId,
    staleTime: 30000,
    gcTime: 300000,
  });
};

export const useReferralsList = (
  userId: string | undefined,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<ReferralListResponse>({
    queryKey: ["referralsList", userId, page, limit],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const { data } = await axios.get(
        `${API_BASE_URL}/user/${userId}/referral/list`,
        {
          params: { page, limit },
        }
      );
      return data;
    },
    enabled: !!userId,
    staleTime: 30000,
    gcTime: 300000,
  });
};
