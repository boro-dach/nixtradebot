// src/widgets/assets-list/ui/AssetsList.tsx
import { mockAssets } from "@/entities/asset/model/data";
import { AssetRow } from "@/entities/asset/ui/asset";
import { Button } from "@/shared/ui/button";
import { Download, MoreHorizontal, Plus } from "lucide-react";

export const AssetsList = () => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-white">Assets</h2>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Plus className="w-4 h-4" /> Add coin
          </Button>
          <Button size="icon" variant="secondary">
            <Download className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {mockAssets.map((asset) => (
          <AssetRow key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};
