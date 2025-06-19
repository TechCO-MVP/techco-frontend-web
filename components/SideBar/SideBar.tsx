"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { selectSidebarState } from "@/lib/store/features/sidebar/sidebar";
import { useAppSelector } from "@/lib/store/hooks";
import { useAppDispatch } from "@/lib/store/hooks";
import { setSidebarState } from "@/lib/store/features/sidebar/sidebar";
import { useBusinesses } from "@/hooks/use-businesses";
import { Heading } from "../Typography/Heading";
import { Dictionary } from "@/types/i18n";
import { FC } from "react";

type SideBarProps = {
  dictionary: Dictionary;
};
export const SideBar: FC<Readonly<SideBarProps>> = ({ dictionary }) => {
  const { isOpen } = useAppSelector(selectSidebarState);
  const { businesses } = useBusinesses();
  const dispatch = useAppDispatch();
  const { sideBar: i18n } = dictionary;
  const onOpenChange = (open: boolean) => {
    dispatch(
      setSidebarState({
        isOpen: open,
      }),
    );
  };

  return (
    <Sheet defaultOpen={isOpen} open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger className="hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{i18n.title}</SheetTitle>
          {businesses.map((business) => {
            return (
              <Heading key={business._id} level={2}>
                {business.name}
              </Heading>
            );
          })}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
