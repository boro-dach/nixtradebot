import { Button } from "@/shared/ui/button";
import { Headphones } from "lucide-react";
import React from "react";

const Help = () => {
  return (
    <Button
      variant={"secondary"}
      className="flex flex-col items-center h-fit cursor-pointer w-full"
    >
      <div className="bg-blue-600 rounded-full w-10 h-10 flex flex-row items-center justify-center">
        <Headphones color="white" />
      </div>
      <p className="text-blue-600">Поддержка</p>
    </Button>
  );
};

export default Help;
