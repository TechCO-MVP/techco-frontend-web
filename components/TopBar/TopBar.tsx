import { FC } from "react";
import { UserMenu } from "../UserMenu/UserMenu";
import { Locale } from "@/i18n-config";
import Image from "next/image";
import Link from "next/link";

interface TopBarProps {
  lang: Locale;
}
export const TopBar: FC<TopBarProps> = ({ lang }) => {
  return (
    <nav className="relative flex h-20 w-full items-center justify-between border-b-[5px] border-b-talent-yellow-500 bg-talent-header px-28">
      <Link href={`/${lang}/dashboard/positions`}>
        <Image
          priority
          width={152}
          height={36}
          src="/assets/talent_connect_white.svg"
          alt="TechCo"
        />
      </Link>
      <UserMenu lang={lang} />
    </nav>
  );
};
