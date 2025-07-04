"use client";
import { Check, X } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

import {
  HiringPositionData,
  HiringProcess,
  PositionPhaseSearchResult,
} from "@/types";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { calculateScore } from "@/lib/utils";
interface SoftSkillsResultsProps {
  data?: HiringProcess["phases"][number];
  candidateName?: string;
  position?: HiringPositionData;
  phase: PositionPhaseSearchResult | null;
}

export function SoftSkillsResults({
  data: phaseData,
  candidateName = "El candidato",
  phase,
  position,
}: SoftSkillsResultsProps) {
  // Get the first (and likely only) phase data

  if (!phaseData) return null;
  // Calculate scores

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

  const ScoreDisplay = () => (
    <div className="mb-2 flex items-center gap-4">
      <div className="flex-1">
        <div className="mb-2 flex space-x-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-3 flex-1 rounded-sm ${
                i <= Math.floor(overallScore) ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
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

  const getGroupTitle = (groupName: string) => {
    switch (groupName) {
      case "Filtro inicial":
        return "ADN del Talento";
      case "Descartados":
        return "No Continua";
      case "Fit cultural":
        return "Retos y Comportamientos";
      case "Finalistas":
        return "Finalista";
      case "Assessment técnico":
        return "Caso de Negocio";
      default:
        return groupName;
    }
  };

  return (
    <div className="mx-auto max-w-4xl bg-white p-6">
      <div className="mb-8">
        {phase?.interviewerData?.sections.map((section) => {
          return (
            <div key={section.title} className="mb-4 flex flex-col gap-2">
              <Heading className="text-base font-bold" level={2}>
                {getGroupTitle(phase.groupName)}
              </Heading>
              <Heading className="text-sm font-bold" level={2}>
                {section.title}
              </Heading>
              <Text className="text-sm text-[#090909]">{section.subtitle}</Text>
              <Text className="text-sm text-[#090909]">
                {section.description}
              </Text>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        {/* Overall Score */}
        <div className="space-y-4">
          <div>
            <p className="mb-2 font-semibold">
              Esta fue su calificación inicial:
            </p>
            <ScoreDisplay />
          </div>

          <p className="text-sm text-[#090909]">
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
      </div>
    </div>
  );
}
