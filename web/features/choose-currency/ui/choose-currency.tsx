"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import React from "react";
import { useCurrencyStore } from "../model/store";

const ChooseCurrency = () => {
  const { setCurrency, currency } = useCurrencyStore();

  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className="border-none shadow-none p-0 my-0 gap-1 focus-visible:ring-0 cursor-pointer">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="w-48">
        <SelectItem value="RUB">RUB</SelectItem>
        <SelectItem value="USD">USD</SelectItem>
        <SelectItem value="UAH">UAH</SelectItem>
        <SelectItem value="KZT">KZT</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ChooseCurrency;
