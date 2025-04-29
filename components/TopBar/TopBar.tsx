import { FC } from "react";
import { UserMenu } from "../UserMenu/UserMenu";
import { Locale } from "@/i18n-config";
import Image from "next/image";

interface TopBarProps {
  lang: Locale;
}
export const TopBar: FC<TopBarProps> = ({ lang }) => {
  return (
    <nav className="border-b-talent-yellow-500 bg-talent-header relative flex h-20 w-full items-center justify-between border-b-[5px] px-28">
      <Image
        priority
        width={152}
        height={36}
        src="/assets/talent_connect_white.svg"
        alt="TechCo"
      />
      <UserMenu lang={lang} username="Jesus D" />
    </nav>
  );
};
