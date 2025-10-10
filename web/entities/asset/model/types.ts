import { LucideIcon } from "lucide-react";

export interface Asset {
  id: string;
  name: string;
  icon: LucideIcon;
  amount: number;
  price: number;
  priceChange: number;
  color: string;
}

export interface PortfolioAsset {
  id: string; // ID записи баланса
  name: string; // "Bitcoin"
  symbol: string; // "BTC"
  amount: number;
  price: number;
  value: number; // Рассчитанное значение (amount * price)
  imageUrl?: string | null;
}
