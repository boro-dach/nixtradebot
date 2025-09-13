import ActiveItem from "@/entities/active-item/ui/active-item";
import { ScrollArea } from "@/shared/ui/scroll-area";
import React from "react";

const ActivesList = () => {
  return (
    <ScrollArea type="always" className="flex flex-col w-full h-full">
      <ActiveItem
        value={"115,681.5"}
        title="Bitcoin"
        shortName="BTC"
        imageSrc="https://xapiimagehandler.com/files/9gjZaHuG5yTx.png"
      />
      <ActiveItem
        value={"4,662.06"}
        title="Ethereum"
        shortName="ETH"
        imageSrc="https://xapiimagehandler.com/files/1Vg9w0MggeJ9.png"
      />
      <ActiveItem
        value={"119.021"}
        title="Litecoin"
        shortName="LTC"
        imageSrc="https://xapiimagehandler.com/files/0Rl1gbFCbP3S.png"
      />
    </ScrollArea>
  );
};

export default ActivesList;
