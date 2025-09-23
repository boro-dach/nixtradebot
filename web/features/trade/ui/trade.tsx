import { Button } from "@/shared/ui/button";
import { DollarSign } from "lucide-react";
import Link from "next/link";
import React from "react";

const Trade = () => {
  return (
    <Link href="/trade">
      <Button
        variant={"secondary"}
        className="flex flex-col items-center h-fit cursor-pointer w-full"
      >
        <div className="bg-blue-600 rounded-full w-10 h-10 flex flex-row items-center justify-center">
          <DollarSign color="white" />
        </div>
        <p className="text-blue-600">Торговать</p>
      </Button>
    </Link>
  );
};

export default Trade;
