import { FC } from "react";
import { UserMenu } from "../UserMenu/UserMenu";
export const TopBar: FC = () => {
  return (
    <nav className="flex h-32 w-full items-center justify-between bg-gray-200 px-28">
      <h1 className="text-2xl font-bold"> Logo </h1>
      <UserMenu username="Jesus D" />
    </nav>
  );
};
