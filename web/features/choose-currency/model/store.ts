import { create } from "zustand";

type Currency = "RUB" | "UAH" | "USD" | "KZT";

interface CurrencyStore {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  currency: "RUB",
  setCurrency: (currency) => set({ currency }),
}));
