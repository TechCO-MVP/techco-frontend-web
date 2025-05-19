"use client";
import { Dictionary } from "@/types/i18n";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Text } from "../Typography/Text";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { PositionConfigurationPhaseTypes } from "@/types";

export type Step = {
  title: string;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  type: PositionConfigurationPhaseTypes;
};

type StepperProps = {
  steps: Step[];
  i18n: Dictionary["createPositionPage"];
  setSteps: Dispatch<SetStateAction<Step[]>>;
};

export const Stepper: FC<StepperProps> = ({ steps, i18n }) => {
  const [currentStep] = useState(0);

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

  const getTitle = (step: Step): string => {
    switch (step.type) {
      case PositionConfigurationPhaseTypes.DESCRIPTION:
        return "Descripción";
      case PositionConfigurationPhaseTypes.SOFT_SKILLS:
        return "Assessment Fit cultural";
      case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
        return "Assessment Técnico";
      case PositionConfigurationPhaseTypes.READY_TO_PUBLISH:
        return "¡Listo!";
      case PositionConfigurationPhaseTypes.FINAL_INTERVIEW:
        return "Entrevista final";
      default:
        return step.title;
    }
  };

  return (
    <div className="flex justify-between overflow-x-auto">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = step.status === "COMPLETED";
        const isPending = step.status === "DRAFT";
        const isLastItem = index === steps.length - 1;

        return (
          <div
            key={index}
            className="relative flex w-full flex-col items-center justify-center gap-1"
          >
            <div className="flex items-center justify-center gap-1">
              <div className="relative h-[42px] w-[42px]">
                {isActive && !isComplete && (
                  <div className="absolute inset-0 h-[42px] w-[42px] rounded-full border-[1px] border-[#007AFF]"></div>
                )}
                <div
                  className={cn(
                    "left-[5px] top-[5px] flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full bg-[#007AFF]",
                    isPending && "border-[#C6C6C8] bg-[#C6C6C8]",
                    isComplete && "bg-talent-green-500",
                  )}
                >
                  {isComplete && <Check className="h-4 w-4 stroke-white" />}
                </div>
              </div>
              {!isLastItem && (
                <div
                  className={cn(
                    "absolute inset-0 left-[60%] top-5 h-[1px] w-[80%] bg-[#007AFF]",
                    isPending && "bg-[#C6C6C8]",
                    isLastItem && "bg-transparent",
                    isComplete && "bg-talent-green-500",
                  )}
                ></div>
              )}
            </div>
            <Text
              className={cn(
                "text-center text-sm uppercase text-muted-foreground",
              )}
              type="p"
            >
              {i18n.step} {index + 1}
            </Text>
            <Text
              className={cn(
                "text-center text-sm font-bold text-black text-foreground",
              )}
              type="p"
            >
              {getTitle(step)}
            </Text>
            <Text
              className={cn(
                "text-center text-xs text-[#007AFF]",
                isPending && "text-foreground",
                isComplete && "text-talent-green-500",
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
