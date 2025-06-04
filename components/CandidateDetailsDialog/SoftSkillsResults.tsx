"use client";
import { Check, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiringPositionData, HiringProcess } from "@/types";

interface SoftSkillsResultsProps {
  data?: HiringProcess["phases"];
  candidateName?: string;
  position?: HiringPositionData;
}

export function SoftSkillsResults({
  data,
  candidateName = "El candidato",

  position,
}: SoftSkillsResultsProps) {
  // Get the first (and likely only) phase data
  const phaseData = Object.values(data ?? {})[0];
  if (!phaseData) return null;
  // Calculate scores
  const calculateScore = (items: Record<string, boolean>) => {
    if (!items) return 0;
    const totalItems = Object.keys(items).length;
    const trueItems = Object.values(items).filter(Boolean).length;
    return totalItems > 0 ? (trueItems / totalItems) * 5 : 0;
  };

  const skillsScore = calculateScore(phaseData.custom_fields.skills);
  const responsibilitiesScore = calculateScore(
    phaseData.custom_fields.responsibilities,
  );
  const overallScore = (skillsScore + responsibilitiesScore) / 2;

  const expectedSalary = Number(phaseData.custom_fields.expected_salary);
  const maxSalary = Number(
    position?.salary?.salary || position?.salary?.salary_range?.max || 0,
  );

  // Calculate salary status
  const isAboveRange = maxSalary > 0 && expectedSalary > maxSalary;
  const salaryPercentageAbove = isAboveRange
    ? Math.round(((expectedSalary - maxSalary) / maxSalary) * 100)
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const ScoreDisplay = ({ score, label }: { score: number; label: string }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-lg font-bold text-green-600">
          {score.toFixed(1)} de 5
        </span>
      </div>
      <Progress value={(score / 5) * 100} className="h-2" />
    </div>
  );

  const ItemList = ({ items }: { items: Record<string, boolean> }) => (
    <div className="space-y-3">
      <div className="space-y-2">
        {Object.entries(items).map(([item, value]) => (
          <div key={item} className="flex items-center gap-2">
            {value ? (
              <Check className="h-4 w-4 flex-shrink-0 text-green-600" />
            ) : (
              <X className="h-4 w-4 flex-shrink-0 text-red-600" />
            )}
            <span
              className={`text-sm ${value ? "text-gray-900" : "text-gray-500"}`}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card style={{ scrollbarGutter: "stable" }} className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Revisión inicial</CardTitle>
        <div className="space-y-2">
          <p className="font-semibold text-green-600">
            ¡{candidateName} aceptó participar en el proceso!
          </p>
          <p className="text-sm text-gray-600">
            Ya analizamos su perfil con nuestro sistema de preselección
            automática.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">Qué debes hacer:</h3>
            <p className="mb-4 text-sm text-gray-600">
              Si consideras que puede avanzar, confirmalo desde el formulario de
              la derecha y enviaremos de inmediato su evaluación de fit
              cultural.
            </p>
          </div>

          <div>
            <p className="mb-2 font-semibold">
              Esta fue su calificación inicial:
            </p>
            <ScoreDisplay score={overallScore} label="" />
          </div>

          <p className="text-sm text-gray-600">
            A continuación, puedes ver el detalle de cómo se construyó ese
            puntaje.
          </p>
        </div>

        {/* Accordion for detailed breakdown */}
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="skills">
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex w-full items-center justify-between pr-4">
                <span className="font-semibold">Skills</span>
                <span className="font-bold text-green-600">
                  {skillsScore.toFixed(2)} de 5
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ItemList items={phaseData.custom_fields.skills} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="responsibilities">
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex w-full items-center justify-between pr-4">
                <span className="font-semibold">Responsabilidades</span>
                <span className="font-bold text-green-600">
                  {responsibilitiesScore.toFixed(2)} de 5
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ItemList items={phaseData.custom_fields.responsibilities} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="salary">
            <AccordionTrigger className="text-left hover:no-underline">
              <div className="flex w-full items-center justify-between pr-4">
                <span className="font-semibold">Salario</span>
                {isAboveRange && (
                  <Badge variant="destructive" className="text-xs">
                    Fuera del rango (+{salaryPercentageAbove}%)
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">
                    {candidateName} aspira a {formatCurrency(expectedSalary)}.
                  </p>
                  {position?.salary?.salary && (
                    <p className="text-sm text-gray-600">
                      El salario para esta posición es de
                      {formatCurrency(Number(position?.salary?.salary))}
                    </p>
                  )}
                  {position?.salary?.salary_range?.max && (
                    <p className="text-sm text-gray-600">
                      La banda para esta posición va de
                      {formatCurrency(
                        Number(position?.salary?.salary_range?.min) || 0,
                      )}{" "}
                      a{" "}
                      {formatCurrency(
                        Number(position?.salary?.salary_range?.max) || 0,
                      )}
                      .
                    </p>
                  )}
                  {isAboveRange && (
                    <p className="text-sm font-medium text-red-600">
                      Está un {salaryPercentageAbove}% por encima del rango.
                    </p>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
