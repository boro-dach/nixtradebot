"use client";

import { useCurrencyStore } from "@/features/choose-currency/model/store";
import { Card } from "@/shared/ui/card";
import Image from "next/image";
import React from "react";

interface ActiveItemProps {
  title: string;
  shortName: string;
  value: string;
  imageSrc: string;
}

const ActiveItem = ({ title, shortName, value, imageSrc }: ActiveItemProps) => {
  const { currency } = useCurrencyStore();

  return (
    <Card className="flex flex-row items-center justify-between w-full px-2 mb-2">
      <div className="flex flex-row items-center gap-2">
        <Image src={imageSrc} alt="currency logo" width={32} height={32} />
        <div className="flex flex-col">
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm text-zinc-400">${value}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-lg font-semibold">0 {shortName}</p>
        <p className="text-sm text-zinc-400">
          0{" "}
          {currency === "RUB"
            ? "₽"
            : currency === "USD"
            ? "$"
            : currency === "UAH"
            ? "₴"
            : currency === "KZT"
            ? "₸"
            : ""}
        </p>
      </div>
    </Card>
  );
};

export default ActiveItem;
