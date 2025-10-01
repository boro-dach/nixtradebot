// src/entities/asset/model/data.ts

import { Bitcoin, Droplets } from "lucide-react";
import { Asset } from "./types";

const TetherIcon = Droplets;

export const mockAssets: Asset[] = [
  {
    id: "usdt",
    name: "USDT",
    icon: TetherIcon,
    amount: 53495,
    price: 1,
    priceChange: -0.1,
    color: "#a3e0ff",
  },
  {
    id: "sui",
    name: "SUI",
    icon: Droplets,
    amount: 2451.74,
    price: 3.44,
    priceChange: 35.2,
    color: "#c084fc",
  },
  {
    id: "btc",
    name: "BTC",
    icon: Bitcoin,
    amount: 0.0742,
    price: 45000,
    priceChange: 2.5,
    color: "#d8b4fe",
  },
];
