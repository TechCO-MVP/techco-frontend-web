import { FC, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { PreviewDetails } from "./PreviewDetails";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { PositionData } from "@/types";
import { Dictionary } from "@/types/i18n";

type Props = {
  positionData: PositionData;
  dictionary: Dictionary;
  customTrigger?: React.ReactNode;
};

export const DetailsSheet: FC<Props> = ({
  positionData,

  dictionary,
  customTrigger,
}) => {
  const { createPositionPage: i18n } = dictionary;
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button variant="talentGreen" className="h-8">
            <Eye /> {i18n.previewBtnLabel}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full p-0 sm:max-w-[780px]">
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-sm font-medium">
              {i18n.previewSheetTitle}
            </SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="flex flex-col">
            <PreviewDetails positionData={positionData} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
