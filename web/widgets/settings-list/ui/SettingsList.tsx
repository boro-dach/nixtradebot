import SettingsItem from "@/entities/settings-item/ui/SettingsItem";
import { CircleQuestionMark, FileText, Languages, Users } from "lucide-react";
import React from "react";

const SettingsList = () => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-zinc-400">Settings</p>
      <SettingsItem
        title="Language"
        icon={<Languages size={20} />}
        link="/languages"
      />
      <SettingsItem
        title="Referral"
        icon={<Users size={20} />}
        link="/referral"
      />
      <SettingsItem
        title="Legal & Privacy"
        icon={<FileText size={20} />}
        link="/legal"
      />
      <SettingsItem
        title="FAQ"
        icon={<CircleQuestionMark size={20} />}
        link="/faq"
      />
    </div>
  );
};

export default SettingsList;
