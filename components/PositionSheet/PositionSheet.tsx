import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Preview } from "../CreatePosition/Preview";

export const PositionSheet = () => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <span className="flex cursor-pointer items-center justify-center gap-1">
          Open
        </span>
      </SheetTrigger>
      <SheetContent className="w-[780px] p-0 sm:max-w-[780px]">
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">Details</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="flex flex-col">
            <Preview />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
