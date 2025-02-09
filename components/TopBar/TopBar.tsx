import { FC } from "react";
import { UserMenu } from "../UserMenu/UserMenu";
import { Locale } from "@/i18n-config";

interface TopBarProps {
  lang: Locale;
}
export const TopBar: FC<TopBarProps> = ({ lang }) => {
  return (
    <nav className="flex h-32 w-full items-center justify-between bg-gray-200 px-28">
      <h1 className="text-2xl font-bold"> Logo </h1>
      <UserMenu lang={lang} username="Jesus D" />
    </nav>
  );
};
