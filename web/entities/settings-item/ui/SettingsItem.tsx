import React from "react";
import { SettingsItemProps } from "../model/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const SettingsItem = ({ title, icon, link }: SettingsItemProps) => {
  return (
    <Link
      href={link}
      className="flex flex-row items-center justify-between p-4 h-12 bg-zinc-900 rounded-lg"
    >
      <div className="flex flex-row items-center gap-4">
        {icon}
        <p>{title}</p>
      </div>
      <ChevronRight />
    </Link>
  );
};

export default SettingsItem;
