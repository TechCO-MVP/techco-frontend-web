"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CulturalAssessmentResultType,
  HiringProcess,
  PositionPhaseSearchResult,
} from "@/types";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";

const getScoreColor = (score: number) => {
  if (score >= 4) return "text-green-600";
  if (score >= 3) return "text-yellow-600";
  if (score >= 2) return "text-orange-600";
  return "text-red-600";
};

type Props = {
  phase: PositionPhaseSearchResult | null;
  data?: HiringProcess["phases"][number];
};
export function CulturalAssessmentResults({ phase, data: phaseData }: Props) {
  if (
    !phaseData ||
    !phaseData.custom_fields?.assistant_response?.assesment_result
  )
    return null;
  const resultsData = phaseData.custom_fields.assistant_response
    .assesment_result as CulturalAssessmentResultType;
  // Flatten all dimensions, attaching the parent name as category
  const allDimensions = resultsData.comportamientos.flatMap((comportamiento) =>
    comportamiento.dimensions.map((dimension) => ({
      category: comportamiento.name,
      ...dimension,
    })),
  );

  // Group by category
  const groupedByCategory = allDimensions.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof allDimensions>,
  );

  // Calculate average score per category
  const categoryScores = Object.entries(groupedByCategory).map(
    ([category, dimensions]) => {
      const avgScore =
        dimensions.reduce((sum, d) => sum + d.calificacion, 0) /
        dimensions.length;
      return {
        category,
        score: Number(avgScore.toFixed(1)), // Convert to 5-point scale
        rawAvg: avgScore,
        dimensions,
      };
    },
  );

  // Calculate overall score: average of category averages (on 5-point scale)
  const overallScore = Number(
    (
      categoryScores.reduce((sum, c) => sum + c.score, 0) /
      categoryScores.length
    ).toFixed(1),
  );

  // Calculate total weighted: average of all calificacion values (on 5-point scale)
  const allCalificaciones = allDimensions.map((d) => d.calificacion);
  console.log(
    "%c[Debug] categoryScores",
    "background-color: teal; font-size: 20px; color: white",
    { categoryScores },
  );
  const totalWeighted = Number(
    (
      allCalificaciones.reduce((sum, v) => sum + v, 0) /
      allCalificaciones.length
    ).toFixed(1),
  );

  return (
    <div className="mx-auto max-w-4xl bg-white p-6">
      {/* Header Section */}
      <div className="mb-8">
        {phase?.interviewerData?.sections.map((section) => {
          return (
            <div key={section.title} className="mb-4 flex flex-col gap-2">
              <Heading className="text-base font-bold" level={2}>
                {phase.groupName}
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

        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold text-gray-900">Feedback General</h3>
          <p className="text-gray-700">{resultsData.feedback_general}</p>
        </div>

        {/* Total Weighted Score */}
        <div className="my-8 rounded-lg bg-gray-50 p-4">
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
        </div>

        {/* Overall Score */}
        <div className="mb-6">
          <p className="mb-2 font-semibold text-[#090909]">
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
          <p className="text-sm text-[#090909]">
            A continuación, puedes ver el detalle de cómo se construyó ese
            puntaje.
          </p>
        </div>
      </div>

      {/* Assessment Categories */}
      <div className="space-y-4">
        {categoryScores.map(({ category, score, dimensions }) => (
          <div key={category} className="rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {category}
                </h2>
                <span
                  className={`text-base font-semibold ${getScoreColor(score)}`}
                >
                  {score} de 5
                </span>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {dimensions.map((dimension, index) => (
                <AccordionItem
                  key={index}
                  value={`${category}-${index}`}
                  className="border-0"
                >
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline">
                    <div className="flex w-full items-center justify-between">
                      <span className="text-left font-medium text-gray-900">
                        {dimension.dimension}
                      </span>
                      <span
                        className={`mr-4 text-sm font-semibold ${getScoreColor(dimension.calificacion)}`}
                      >
                        {dimension.calificacion} de 5
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="mb-2 font-semibold text-gray-900">
                          Pregunta:
                        </p>
                        <p className="text-gray-700">{dimension.pregunta}</p>
                      </div>

                      <div>
                        <p className="mb-2 font-semibold text-gray-900">
                          Respuesta del candidato:
                        </p>
                        <p className="italic text-gray-700">
                          {dimension.respuesta_candidato}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 font-semibold text-gray-900">
                          Justificación para la calificación:
                        </p>
                        <p className="text-gray-700">
                          {dimension.justificacion}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}
