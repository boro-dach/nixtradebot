import Deposit from "@/features/deposit/ui/deposit";
import Help from "@/features/help/ui/help";
import Trade from "@/features/trade/ui/trade";
import Withdraw from "@/features/withdraw/ui/withdraw";
import ActivesList from "@/widgets/actives-list/ui/actives-list";
import Balance from "@/widgets/balance/ui/balance";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-4 px-4 max-h-screen">
      <Balance />
      <div className="grid grid-cols-4 grid-rows-1 gap-2 w-full mt-4">
        <Deposit />
        <Withdraw />
        <Trade />
        <Help />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <p className="text-lg font-semibold">Ваши активы:</p>
        <ActivesList />
      </div>
    </div>
  );
};

export default Home;
