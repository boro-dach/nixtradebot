import { AssetsList } from "@/widgets/assets-list/ui/AssetsList";
import { PortfolioDonutChart } from "@/widgets/portfolio-donut-chart/ui/PortfolioDonutChart";
import React from "react";

const Portfolio = () => {
  return (
    <div className="flex flex-col mx-4 gap-4">
      <div className="flex flex-row justify-between items-center mt-4">
        <p className="text-lg font-semibold">Portfolio</p>
      </div>
      <PortfolioDonutChart />
      <AssetsList />
    </div>
  );
};

export default Portfolio;
