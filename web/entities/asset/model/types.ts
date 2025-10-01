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
