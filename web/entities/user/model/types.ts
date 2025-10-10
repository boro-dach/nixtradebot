import { AssetBalance } from "@/entities/balance/api/useTotalBalance";

export interface User {
  tgid: string;
  language: "RU" | "ENG";
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  isLucky: boolean;
  isBannedWithdraw: boolean;
  isBannedInBot: boolean;
  stopLimit: number;
  hasStopLimit: boolean;
  assetBalances?: AssetBalance[];
}
