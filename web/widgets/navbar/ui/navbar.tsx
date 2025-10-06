import { Button } from "@/shared/ui/button";
import { BarChart3, ChartSpline, Coins, Home, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex flex-row items-center justify-between border-t min-h-16 px-8 bg-background ">
      <Link href={"/"}>
        <Home size={22} />
      </Link>
      <Link href={"/trade"}>
        <ChartSpline size={22} />
      </Link>
      <Link href={"portfolio"}>
        <BarChart3 size={22} />
      </Link>
      <Link href={"/profile"}>
        <User size={22} />
      </Link>
    </div>
  );
};

export default Navbar;
