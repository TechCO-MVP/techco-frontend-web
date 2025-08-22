"use client";

import { FC, useState, useEffect } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  EvaluationWeight,
  EvaluationCriterionType,
  BusinessConfiguration,
} from "@/types";
import { Loader2 } from "lucide-react";

interface WeightsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (
    weights: BusinessConfiguration["evaluation_weights"],
  ) => Promise<void>;
  title?: string;
  description?: string;
  saveButtonText?: string;
  initialWeights?: BusinessConfiguration["evaluation_weights"];
}

const defaultCriteria: EvaluationWeight[] = [
  {
    name: "ADN del talento",
    criterion_type: "TALENT_DNA" as EvaluationCriterionType,
    weight: 20,
  },
  {
    name: "Retos y comportamientos",
    criterion_type:
      "CHALLENGES_AND_BEHAVIORS_RESULT" as EvaluationCriterionType,
    weight: 20,
  },
  {
    name: "Primera entrevista",
    criterion_type: "FIRST_INTERVIEW" as EvaluationCriterionType,
    weight: 20,
  },
  {
    name: "Caso de negocio",
    criterion_type: "BUSINESS_CASE_RESULT" as EvaluationCriterionType,
    weight: 20,
  },
  {
    name: "Entrevista final",
    criterion_type: "FINAL_INTERVIEW" as EvaluationCriterionType,
    weight: 20,
  },
];

const defaultWeights: BusinessConfiguration["evaluation_weights"] = {
  HIGH_PROFILE_FLOW: [...defaultCriteria],
  MEDIUM_PROFILE_FLOW: [...defaultCriteria],
  LOW_PROFILE_FLOW: [...defaultCriteria],
};

const flowTypeLabels = {
  HIGH_PROFILE_FLOW: "Mente Estratégica",
  MEDIUM_PROFILE_FLOW: "Match Cultural",
  LOW_PROFILE_FLOW: "Talento 360°",
} as const;

type FlowType = keyof typeof flowTypeLabels;

export const WeightsSheet: FC<WeightsSheetProps> = ({
  open,
  onOpenChange,
  onSave,
  title = "Sabemos que para ti no todos los criterios pesan igual.",
  description = "Por eso, como administrador, puedes definir qué aspectos tienen más relevancia al evaluar candidatos en tu empresa. Estos valores se aplicarán por defecto en todas tus vacantes. Solo asegúrate de que la suma total sea del 100% en cada flujo; de lo contrario, no podrás guardar los cambios.",
  saveButtonText = "Actualizar",
  initialWeights,
}) => {
  const [weights, setWeights] = useState<
    BusinessConfiguration["evaluation_weights"]
  >(initialWeights || defaultWeights);
  const [flowTotals, setFlowTotals] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const totals: Record<string, number> = {};
    Object.entries(weights).forEach(([flowType, criteria]) => {
      totals[flowType] = criteria.reduce(
        (sum, criterion) => sum + criterion.weight,
        0,
      );
    });
    setFlowTotals(totals);
  }, [weights]);

  const handleWeightChange = (
    flowType: keyof BusinessConfiguration["evaluation_weights"],
    criterionType: EvaluationCriterionType,
    value: string,
  ) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numValue));

    setWeights((prev) => ({
      ...prev,
      [flowType]: prev[flowType].map((criterion) =>
        criterion.criterion_type === criterionType
          ? { ...criterion, weight: clampedValue }
          : criterion,
      ),
    }));
  };

  const handleUpdate = async () => {
    if (!onSave) {
      console.log("Updating weights:", weights);
      onOpenChange(false);
      return;
    }

    try {
      setIsSaving(true);
      await onSave(weights);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving weights:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const areAllTotalsValid = Object.values(flowTotals).every(
    (total) => total === 100,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
          <SheetDescription className="mt-2 text-sm text-muted-foreground">
            {description}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6">
          <Accordion
            type="multiple"
            defaultValue={["HIGH_PROFILE_FLOW"]}
            className="w-full"
          >
            {(Object.entries(weights) as [FlowType, EvaluationWeight[]][]).map(([flowType, criteria]) => {
              const flowTotal = flowTotals[flowType] || 0;
              const isFlowValid = flowTotal === 100;

              return (
                <AccordionItem key={flowType} value={flowType}>
                  <AccordionTrigger className="text-left">
                    <div className="flex w-full items-center justify-between pr-4">
                      <span className="font-medium">
{flowTypeLabels[flowType]}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            isFlowValid ? "text-green-600" : "text-red-600",
                          )}
                        >
                          {flowTotal}%
                        </span>
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            isFlowValid ? "bg-green-600" : "bg-red-600",
                          )}
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4 pt-4">
                      {criteria.map((criterion) => (
                        <div
                          key={criterion.criterion_type}
                          className="flex items-center gap-4"
                        >
                          <Label className="flex-1 text-sm font-medium">
                            {criterion.name}
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={criterion.weight}
                              onChange={(e) =>
                                handleWeightChange(
                                  flowType as keyof BusinessConfiguration["evaluation_weights"],
                                  criterion.criterion_type,
                                  e.target.value,
                                )
                              }
                              className="w-20 text-center"
                              aria-label={`Peso para ${criterion.name} en ${flowTypeLabels[flowType]}`}
                            />
                            <span className="text-sm text-muted-foreground">
                              %
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <SheetFooter>
          <Button
            onClick={handleUpdate}
            disabled={!areAllTotalsValid || isSaving}
            className="w-full"
            variant="talentGreen"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saveButtonText}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
