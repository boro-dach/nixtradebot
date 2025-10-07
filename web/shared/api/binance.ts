const API_BASE = "https://api.binance.com/api/v3";

export const binanceApi = {
  get: async <T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    const response = await fetch(`${API_BASE}/${endpoint}${query}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.msg || `Ошибка Binance API: ${response.statusText}`
      );
    }

    return response.json();
  },
};
