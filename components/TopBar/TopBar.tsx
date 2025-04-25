import { FC } from "react";
import { UserMenu } from "../UserMenu/UserMenu";
import { Locale } from "@/i18n-config";
import Image from "next/image";

interface TopBarProps {
  lang: Locale;
}
export const TopBar: FC<TopBarProps> = ({ lang }) => {
  return (
    <nav className="relative flex h-20 w-full items-center justify-between bg-gray-200 px-28">
      <Image
        priority
        width={152}
        height={36}
        src="/assets/talent_connect.svg"
        alt="TechCo"
      />
      <UserMenu lang={lang} username="Jesus D" />
    </nav>
  );
};
