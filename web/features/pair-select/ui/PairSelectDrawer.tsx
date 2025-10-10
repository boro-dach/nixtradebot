// Файл: src/features/pair-select/ui/PairSelectDrawer.tsx

"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Loader2 } from "lucide-react";
import {
  useMarketAssets,
  MarketAsset,
} from "@/entities/market/api/useMarketAssets";
import Image from "next/image";

interface PairSelectDrawerProps {
  onSelectPair: (asset: MarketAsset) => void;
  children: React.ReactNode; // Пропс для кнопки-триггера
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PairSelectDrawer: React.FC<PairSelectDrawerProps> = ({
  onSelectPair,
  children,
  isOpen,
  onOpenChange,
}) => {
  const { data: marketAssets, isLoading } = useMarketAssets();

  const handleSelect = (asset: MarketAsset) => {
    onSelectPair(asset);
    onOpenChange(false); // Закрываем шторку
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      {/* 1. Используем `children` как триггер */}
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Выберите актив</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-72 px-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            marketAssets?.map((asset) => (
              <div
                key={asset.id}
                onClick={() => handleSelect(asset)}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 cursor-pointer"
              >
                <Image
                  src={asset.image}
                  alt={asset.name}
                  width={32}
                  height={32}
                />
                <div>
                  <p className="font-semibold">{asset.name}</p>
                  <p className="text-sm text-zinc-400">
                    {asset.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
