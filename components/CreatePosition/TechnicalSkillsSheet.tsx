import { FC, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";

import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { TechnicalAssessment } from "@/types";
import { Dictionary } from "@/types/i18n";
import { PreviewTechnicalSkillsContent } from "./PreviewTechnicalSkillsContent";
type Props = {
  assessment: TechnicalAssessment | null;
  dictionary: Dictionary;
  customTrigger?: React.ReactNode;
  role?: string;
};

export const TechnicalSkillsSheet: FC<Props> = ({
  assessment,
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
            <Eye /> {i18n.previewSoftSkillsBtnLabel}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-[780px] p-0 sm:max-w-[780px]">
        <SheetHeader className="border-b bg-white p-12">
          <SheetTitle className="text-center text-lg font-bold text-gray-900">
            Asi se vera tu assessment
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="flex flex-col">
            <PreviewTechnicalSkillsContent assessment={assessment} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
