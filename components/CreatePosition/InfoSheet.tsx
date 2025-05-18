import { FC, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Dictionary } from "@/types/i18n";

export const InfoSheet: FC<{ dictionary: Dictionary }> = ({ dictionary }) => {
  const { createPositionPage: i18n } = dictionary;
  const info = i18n.softSkillsInfoSheet;
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-[#FCFCFC] text-[#007AFF] hover:bg-[#FCFCFC]">
          {i18n.howWeEvaluate}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-[780px] p-0 sm:max-w-[780px]">
        <SheetHeader className="border-b bg-white p-12">
          <SheetTitle className="text-lg font-bold text-gray-900">
            {info.title}
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            {info.description}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-192px)] bg-white px-12">
          <div className="flex flex-col gap-0 py-8">
            {/* Section 2: How do we evaluate your candidates? */}
            <h2 className="mb-2 text-base font-semibold text-gray-900">
              {info.howWeEvaluateTitle}
            </h2>
            <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
              {info.howWeEvaluateText}
            </p>
            <div
              className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
              aria-hidden="true"
            />

            {/* Section 3: How is it scored? */}
            <h2 className="mb-2 text-base font-semibold text-gray-900">
              {info.scoringTitle}
            </h2>
            <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
              {info.scoringText}
            </p>
            <div
              className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
              aria-hidden="true"
            />

            {/* Section 4: AI Evaluation */}
            <h2 className="mb-2 text-base font-semibold text-gray-900">
              {info.aiEvaluationTitle}
            </h2>
            <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
              {info.aiEvaluationText}
            </p>
            <div
              className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
              aria-hidden="true"
            />

            {/* Section 5: Recruiter Benefits */}
            <h2 className="mb-2 text-base font-semibold text-gray-900">
              {info.recruiterBenefitsTitle}
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-500">
              {info.recruiterBenefitsList.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
