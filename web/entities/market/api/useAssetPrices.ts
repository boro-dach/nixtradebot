import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type CoinGeckoPriceResponse = {
  [id: string]: {
    usd: number;
  };
};

const fetchAssetPrices = async (
  assetIds: string[]
): Promise<Map<string, number>> => {
  if (assetIds.length === 0) return new Map();

  const ids = assetIds.join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

  const response = await axios.get<CoinGeckoPriceResponse>(url);

  const priceMap = new Map<string, number>();
  for (const id in response.data) {
    priceMap.set(id, response.data[id].usd);
  }
  return priceMap;
};

export const useAssetPrices = (assetIds: string[]) => {
  const {
    data: prices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["assetPrices", assetIds],
    queryFn: () => fetchAssetPrices(assetIds),
    enabled: assetIds.length > 0,
  });

  return { prices, isLoadingPrices: isLoading, errorPrices: error };
};
