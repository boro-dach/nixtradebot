import { PortfolioAsset } from "@/entities/asset/model/types";
import { AssetRow } from "@/entities/asset/ui/asset";
import { Button } from "@/shared/ui/button";
import { Download, MoreHorizontal, Plus } from "lucide-react";

export const AssetsList = ({ assets }: { assets: PortfolioAsset[] }) => {
  return (
    <div className="p-4">
      <div className="flex items-start mb-4">
        <h2 className="text-xl font-bold text-white">Assets</h2>
      </div>
      <div className="flex flex-col gap-3">
        {assets.length === 0 ? (
          <p className="text-center text-muted-foreground mt-4">
            Your asset list is empty.
          </p>
        ) : (
          assets.map((asset) => <AssetRow key={asset.id} asset={asset} />)
        )}
      </div>
    </div>
  );
};
