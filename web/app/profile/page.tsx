"use client";

import {
  telegramSelectors,
  useTelegramStore,
} from "@/entities/telegram/model/store";
import SettingsList from "@/widgets/settings-list/ui/SettingsList";
import { ArrowDown, ArrowRightLeft, ArrowUp } from "lucide-react";
import Link from "next/link";
import React from "react";

const Profile = () => {
  const displayName = useTelegramStore(telegramSelectors.displayName);

  return (
    <div className="flex flex-col mx-4 gap-4 pb-20">
      <div className="flex flex-row justify-between items-center mt-4">
        <p className="text-lg font-semibold">Profile</p>
      </div>
      <div className="flex flex-col items-center gap-2 w-full mt-4">
        <div className="bg-zinc-900 p-12 rounded-full"></div>
        <p>{displayName}</p>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <p className="font-semibold text-2xl">Total balance:</p>
        <p className="text-4xl">$65,267.99</p>
      </div>
      <div className="grid grid-cols-3 grid-rows-1 gap-2 h-28">
        <Link
          href={"/deposit"}
          className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 bg-zinc-900"
        >
          <div className="bg-white p-2 rounded-full">
            <ArrowDown color="black" />
          </div>
          <p>Deposit</p>
        </Link>
        <Link
          href={"/swap"}
          className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 bg-zinc-900"
        >
          <div className="bg-white p-2 rounded-full">
            <ArrowRightLeft color="black" />
          </div>
          <p>Exchange</p>
        </Link>
        <Link
          href={"/withdraw"}
          className="flex flex-col items-center justify-center gap-2 rounded-lg p-4 bg-zinc-900"
        >
          <div className="bg-white p-2 rounded-full">
            <ArrowUp color="black" />
          </div>
          <p>Withdraw</p>
        </Link>
      </div>
      <div className="mt-8">
        <SettingsList />
      </div>
    </div>
  );
};

export default Profile;
