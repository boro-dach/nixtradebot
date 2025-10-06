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
import { useState, useEffect } from "react";
import { PairRow } from "@/entities/pair/ui/PairRow";
import axios from "axios";

interface PairSelectDrawerProps {
  selectedPair: ICryptoPair;
  onSelectPair: (pair: ICryptoPair) => void;
}

export const PairSelectDrawer: React.FC<PairSelectDrawerProps> = ({
  selectedPair,
  onSelectPair,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pairs, setPairs] = useState<ICryptoPair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            headers: {
              "x-cg-demo-api-key": apiKey,
            },
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 50,
              page: 1,
            },
          }
        );

        const formattedPairs: ICryptoPair[] = response.data.map(
          (coin: any) => ({
            name: coin.name,
            symbol: coin.id,
          })
        );

        setPairs(formattedPairs);
      } catch (error) {
        console.error("Error fetching pairs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPairs();
  }, []);

  const handleSelect = (pair: ICryptoPair) => {
    onSelectPair(pair);
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <span className="font-bold text-lg">{selectedPair.name}</span>
          <ChevronDown />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Выберите актив</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-72 px-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Загрузка...</p>
            </div>
          ) : (
            pairs.map((pair) => (
              <PairRow key={pair.symbol} pair={pair} onSelect={handleSelect} />
            ))
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
