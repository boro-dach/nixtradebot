import { Button } from "@/shared/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import ReactCountryFlag from "react-country-flag";

const LanguagePage = () => {
  return (
    <div className="flex flex-col gap-4 m-4 pb-16">
      <div className="flex flex-row items-center gap-2">
        <Link href={"/profile"}>
          <Button variant={"ghost"} className="w-8 h-8">
            <ChevronLeft size={20} />
          </Button>
        </Link>
        <p className="font-semibold text-lg">Language</p>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <Button
          variant={"secondary"}
          className="flex flex-row items-center w-full bg-zinc-900 h-12 rounded-lg px-4 gap-2"
        >
          <ReactCountryFlag countryCode="RU" />
          <p>Русский</p>
        </Button>
        <Button
          variant={"secondary"}
          className="flex flex-row items-center w-full bg-zinc-900 h-12 rounded-lg px-4 gap-2"
        >
          <ReactCountryFlag countryCode="US" />
          <p>English</p>
        </Button>
      </div>
    </div>
  );
};

export default LanguagePage;
