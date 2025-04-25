"use client";
import { Dictionary } from "@/types/i18n";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Text } from "../Typography/Text";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
// import { CountryDialCode } from "@/types";
// import { countryList } from "@/lib/data/country";

export type Step = {
  title: string;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
};

type StepperProps = {
  steps: Step[];
  i18n: Dictionary["createPositionPage"];
  setSteps: Dispatch<SetStateAction<Step[]>>;
};

export const Stepper: FC<StepperProps> = ({ steps, i18n, setSteps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  // const transformCountries = (
  //   input: {
  //     name: string;
  //     code: string;
  //     emoji: string;
  //     unicode: string;
  //     image: string;
  //     dial_code: string;
  //   }[],
  // ): CountryDialCode[] => {
  //   return input.map(({ name, code, emoji, dial_code }) => ({
  //     label: `${name} ${dial_code} ${emoji}`,
  //     value: dial_code,
  //   }));
  // };
  // const result = transformCountries(countryList);
  // console.log(JSON.stringify(result));
  const onStepClick = (index: number) => {
    if (index === currentStep) return;
    const copy = [...steps];
    const current = copy[currentStep];
    const clickedStep = copy[index];
    if (["complete", "skipped"].includes(clickedStep.status)) return;
    setCurrentStep(index);
    clickedStep.status = "IN_PROGRESS";
    current.status = "COMPLETED";
    setSteps(copy);
  };

  const getSubtitle = (step: Step): string => {
    switch (step.status) {
      case "IN_PROGRESS":
        return i18n.inProcess;
      case "DRAFT":
        return i18n.pending;
      case "COMPLETED":
        return i18n.completed;

      default:
        return i18n.inProcess;
    }
  };
  return (
    <div className="flex overflow-x-auto">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = step.status === "COMPLETED";
        const isPending = step.status === "DRAFT";
        const isLastItem = index === steps.length - 1;

        return (
          <div key={index} className="flex flex-col justify-center gap-1">
            <div className="flex items-center justify-center gap-1">
              <div className="relative h-[42px] w-[42px]">
                {isActive && !isComplete && (
                  <div className="absolute inset-0 h-[42px] w-[42px] rounded-full border-[1px] border-[#007AFF]"></div>
                )}
                <div
                  onClick={() => onStepClick(index)}
                  className={cn(
                    "absolute inset-0 left-[5px] top-[5px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#007AFF]",
                    isPending && "border-[#C6C6C8] bg-[#C6C6C8]",
                    isComplete && "bg-[#34C759]",
                  )}
                >
                  {isComplete && <Check className="h-4 w-4 stroke-white" />}
                </div>
              </div>
              <div
                className={cn(
                  "right-0 top-5 h-[1px] w-[130px] bg-[#007AFF]",
                  isPending && "bg-[#C6C6C8]",
                  isLastItem && "bg-transparent",
                  isComplete && "bg-[#34C759]",
                )}
              ></div>
            </div>
            <Text className="text-sm uppercase text-muted-foreground" type="p">
              {i18n.step} {index + 1}
            </Text>
            <Text
              className={cn("text-sm font-bold text-black text-foreground")}
              type="p"
            >
              {step.title}
            </Text>
            <Text
              className={cn(
                "text-xs text-[#007AFF]",
                isPending && "text-foreground",
                isComplete && "text-[#34C759]",
              )}
              type="p"
            >
              {getSubtitle(step)}
            </Text>
          </div>
        );
      })}
    </div>
  );
};
