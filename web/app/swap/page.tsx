import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import React from "react";

const Swap = () => {
  return (
    <div className="flex flex-col gap-2 pb-16 m-4">
      <p className="text-lg font-semibold">Exchange</p>
      <div className="grid grid-cols-1 grid-rows-2 w-full">
        <Card className="flex flex-col gap-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <p>From</p>
            <p className="text-zinc-400">Balance: 1500 USD</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">375</p>
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-between">
            <p className="text-zinc-400 text-sm">=$375</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Swap;
