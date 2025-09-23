"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Button } from "@/shared/ui/button";
import { ChevronDown } from "lucide-react";
import { ICryptoPair } from "@/entities/pair/model/types";
import { useState } from "react";
import { PairRow } from "@/entities/pair/ui/PairRow";

const PAIRS: ICryptoPair[] = [
  {
    name: "Bitcoin",
    symbol: "BTCUSDT",
  },
  {
    name: "Ethereum",
    symbol: "ETHUSDT",
  },
  {
    name: "Litecoin",
    symbol: "LTCUSDT",
  },
  {
    name: "Cardano",
    symbol: "ADAUSDT",
  },
  {
    name: "Solana",
    symbol: "SOLUSDT",
  },
  {
    name: "Doge",
    symbol: "DOGEUSDT",
  },
  {
    name: "Polkadot",
    symbol: "DOTUSDT",
  },
  {
    name: "Avalanche",
    symbol: "AVAXUSDT",
  },
  {
    name: "Chainlink",
    symbol: "LINKUSDT",
  },
];

interface PairSelectDrawerProps {
  selectedPair: ICryptoPair;
  onSelectPair: (pair: ICryptoPair) => void;
}

export const PairSelectDrawer: React.FC<PairSelectDrawerProps> = ({
  selectedPair,
  onSelectPair,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (pair: ICryptoPair) => {
    onSelectPair(pair);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <span className="font-bold text-lg">{selectedPair.name} / USDT</span>
          <ChevronDown />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Выберите актив</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-72 px-4">
          {PAIRS.map((pair) => (
            <PairRow key={pair.symbol} pair={pair} onSelect={handleSelect} />
          ))}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
