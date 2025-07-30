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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EvaluationWeight, EvaluationCriterionType } from "@/types";
import { Loader2 } from "lucide-react";

interface WeightsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (criteria: EvaluationWeight[]) => Promise<void>;
  title?: string;
  description?: string;
  saveButtonText?: string;
  initialWeights?: EvaluationWeight[];
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

export const WeightsSheet: FC<WeightsSheetProps> = ({
  open,
  onOpenChange,
  onSave,
  title = "Sabemos que para ti no todos los criterios pesan igual.",
  description = "Por eso, como administrador, puedes definir qué aspectos tienen más relevancia al evaluar candidatos en tu empresa. Estos valores se aplicarán por defecto en todas tus vacantes. Solo asegúrate de que la suma total sea del 100%; de lo contrario, no podrás guardar los cambios.",
  saveButtonText = "Actualizar",
  initialWeights,
}) => {
  const [criteria, setCriteria] = useState<EvaluationWeight[]>(
    initialWeights || defaultCriteria,
  );
  const [totalWeight, setTotalWeight] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const total = criteria.reduce(
      (sum, criterion) => sum + criterion.weight,
      0,
    );
    setTotalWeight(total);
  }, [criteria]);

  const handleWeightChange = (
    criterionType: EvaluationCriterionType,
    value: string,
  ) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numValue));

    setCriteria((prev) =>
      prev.map((criterion) =>
        criterion.criterion_type === criterionType
          ? { ...criterion, weight: clampedValue }
          : criterion,
      ),
    );
  };

  const handleUpdate = async () => {
    if (!onSave) {
      console.log("Updating weights:", criteria);
      onOpenChange(false);
      return;
    }

    try {
      setIsSaving(true);
      await onSave(criteria);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving weights:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isTotalValid = totalWeight === 100;

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
                    handleWeightChange(criterion.criterion_type, e.target.value)
                  }
                  className="w-20 text-center"
                  aria-label={`Peso para ${criterion.name}`}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t pt-4">
            <Label className="text-sm font-medium">Total</Label>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-lg font-semibold",
                  isTotalValid ? "text-green-600" : "text-red-600",
                )}
              >
                {totalWeight}%
              </span>
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  isTotalValid ? "bg-green-600" : "bg-red-600",
                )}
              />
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button
            onClick={handleUpdate}
            disabled={!isTotalValid || isSaving}
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
