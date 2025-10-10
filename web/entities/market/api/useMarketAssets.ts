import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface MarketAsset {
  id: string; // coingeckoId
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const fetchMarketAssets = async (): Promise<MarketAsset[]> => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1`;
  const response = await axios.get<MarketAsset[]>(url);
  return response.data;
};

export const useMarketAssets = () => {
  return useQuery({
    queryKey: ["marketAssets"],
    queryFn: fetchMarketAssets,
  });
};
