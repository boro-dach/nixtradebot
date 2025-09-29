import { Button } from "@/shared/ui/button";
import { BarChart3, ChartSpline, Coins, Home, User } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex flex-row items-center justify-between border-t h-12 px-8">
      <Link href={""}>
        <Home size={22} />
      </Link>
      <Link href={""}>
        <ChartSpline size={22} />
      </Link>
      <Link href={""}>
        <Coins size={22} />
      </Link>
      <Link href={""}>
        <BarChart3 size={22} />
      </Link>
      <Link href={""}>
        <User size={22} />
      </Link>
    </div>
  );
};

export default Navbar;
