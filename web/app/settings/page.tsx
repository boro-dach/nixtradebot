"use client";

import { Button } from "@/shared/ui/button";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const Settings = () => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex flex-col gap-4 px-4 mt-4">
      <Select defaultValue="rub">
        <SelectTrigger className="flex flex-row justify-between w-full cursor-pointer">
          <p>Основная валюта</p>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rub">Российский рубль, RUB</SelectItem>
          <SelectItem value="uah">Украинския гривна, UAH</SelectItem>
          <SelectItem value="usd">Американский доллар, USD</SelectItem>
          <SelectItem value="kzt">Казахстанский тенге, KZT</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="ru">
        <SelectTrigger className="flex flex-row justify-between w-full cursor-pointer">
          <p>Язык приложения</p>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ru">Русский, Russian</SelectItem>
          <SelectItem value="en">Английский (США), English</SelectItem>
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="flex flex-row justify-between w-full cursor-pointer"
        >
          <Button className=" focus-visible:ring-0" variant={"outline"}>
            <div className="flex flex-row justify-between w-full">
              <p>Тема приложения</p>
              <p>
                {theme === "light"
                  ? "Светлая"
                  : theme === "dark"
                  ? "Темная"
                  : "Системная"}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Светлая
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Темная
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            Системная
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Settings;
