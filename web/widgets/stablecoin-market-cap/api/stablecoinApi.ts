import axios from "axios";

export interface GlobalData {
  data: {
    total_market_cap: { [currency: string]: number };
    stablecoin_market_cap: { [currency: string]: number };
    stablecoin_24h_percentage_change: { [currency: string]: number };
  };
}

export interface MarketChartData {
  market_caps: [number, number][];
}

const BASE_URL = "https://api.coingecko.com/api/v3";

const GLOBAL_API_URL = `${BASE_URL}/global`;
const CHART_API_URL = `${BASE_URL}/global/market_cap_chart?days=30&vs_currency=usd`;

export const getStablecoinGlobalData = async (): Promise<GlobalData> => {
  try {
    const response = await axios.get<GlobalData>(GLOBAL_API_URL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch global data from CoinGecko:", error);
    throw new Error("Could not fetch global data.");
  }
};

export const getMarketChartHistory = async (): Promise<MarketChartData> => {
  try {
    const response = await axios.get<MarketChartData>(CHART_API_URL);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch market chart from CoinGecko:", error);
    throw new Error("Could not fetch market chart data.");
  }
};
