"use client";

import { HiringProcess, PositionPhaseSearchResult } from "@/types";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { TechnicalAssesmentResult } from "@/types";
import { getTechnicalAssessmentScore } from "@/lib/utils";

export type TechnicalAssessmentResult = {
  dimensiones: {
    nombre: string;
    calificacion: number; // 1 to 5
    justificacion: string;
  }[];
  feedback_general: string;
};

const getScoreColor = (score: number) => {
  if (score >= 4) return "text-green-600";
  if (score >= 3) return "text-yellow-600";
  if (score >= 2) return "text-orange-600";
  return "text-red-600";
};
type Props = {
  phase: PositionPhaseSearchResult | null;
  data?: HiringProcess["phases"][number];
  fullWidth?: boolean;
};
export function TechnicalAssessmentResults({ phase, data, fullWidth }: Props) {
  if (!data || !data.custom_fields?.assistant_response?.assesment_result)
    return null;
  const resultsData = data.custom_fields.assistant_response
    .assesment_result as TechnicalAssesmentResult;
  const overallScore = getTechnicalAssessmentScore(resultsData);
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
    <div
      className={`mx-auto bg-white p-6 ${fullWidth ? "w-full" : "max-w-4xl"}`}
    >
      {/* Header Section */}
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

        {resultsData.feedback_general && (
          <div className="mb-4 mt-6 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-gray-900">
              Feedback General
            </h3>
            <p className="text-gray-700">{resultsData.feedback_general}</p>
          </div>
        )}

        {/* Overall Score */}
        <div className="mb-6">
          <p className="mb-2 font-semibold text-gray-900">
            Esta fue su calificación inicial:
          </p>
          <div className="mb-2 flex items-center gap-4">
            <div className="flex-1">
              <div className="mb-2 flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-3 flex-1 rounded-sm ${
                      i <= Math.floor(overallScore)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="mb-2 text-2xl font-bold text-green-600">
            {overallScore} de 5
          </p>
          <p className="text-[#090909]">
            A continuación, puedes ver el detalle de cómo se construyó ese
            puntaje.
          </p>
        </div>
      </div>

      {/* Technical Dimensions */}
      <div className="space-y-6">
        {resultsData.dimensiones.map((dimension, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pb-6 last:border-b-0"
          >
            <div className="mb-4 flex items-start justify-between">
              <h2 className="flex-1 text-lg font-semibold text-gray-900">
                {dimension.nombre}
              </h2>
              <span
                className={`ml-4 text-lg font-semibold ${getScoreColor(dimension.calificacion)}`}
              >
                {dimension.calificacion} de 5
              </span>
            </div>

            <div>
              <p className="mb-2 font-semibold text-gray-900">Justificación:</p>
              <p className="text-sm leading-relaxed text-gray-700">
                {dimension.justificacion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Total Weighted Score */}
      {/* <div className="mt-8 rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            Total ponderado
          </span>
          <span
            className={`text-lg font-semibold ${getScoreColor(totalWeighted)}`}
          >
            {totalWeighted} de 5
          </span>
        </div>
      </div> */}
    </div>
  );
}
