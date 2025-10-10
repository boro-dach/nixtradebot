import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const fetchAssetPrice = async (
  assetId: string
): Promise<CoinGeckoPrice | null> => {
  if (!assetId) return null;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      headers: { "x-cg-demo-api-key": apiKey },
      params: { vs_currency: "usd", ids: assetId },
    }
  );
  return response.data?.[0] || null;
};

export const useAssetPrice = (assetId: string) => {
  return useQuery({
    queryKey: ["assetPrice", assetId],
    queryFn: () => fetchAssetPrice(assetId),
    refetchInterval: 30000,
    staleTime: 25000,
    refetchOnWindowFocus: false,
    enabled: !!assetId,
  });
};
