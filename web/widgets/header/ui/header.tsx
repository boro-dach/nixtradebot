import { Button } from "@/shared/ui/button";
import { Bell, Cog, Trophy } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div className="flex flex-row justify-between items-center h-16 p-4">
      <Button variant={"secondary"} className="text-blue-600">
        <Trophy /> Конкурсы
      </Button>
      <div className="flex flex-row gap-2 items-center">
        <Button variant={"secondary"} className="text-blue-600">
          <Cog /> Настройки
        </Button>
        <Button variant={"secondary"} className="text-blue-600">
          <Bell />
        </Button>
      </div>
    </div>
  );
};

export default Header;
