"use client";

import { PositionPhaseSearchResult } from "@/types";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";

export type TechnicalAssessmentResult = {
  dimensiones: {
    nombre: string;
    calificacion: number; // 1 to 5
    justificacion: string;
  }[];
  feedback_general: string;
};

// Mock data based on the image
const mockData: TechnicalAssessmentResult = {
  dimensiones: [
    {
      nombre: "Coherencia en el análisis del problema",
      calificacion: 3.75,
      justificacion:
        "El candidato identificó correctamente la causa raíz del bug reportado, evitando asumir soluciones sin entender primero el contexto. Explicó paso a paso cómo validó el comportamiento esperado de la función y cómo contrastó ese resultado con el flujo actual. Su enfoque fue estructurado y lógico, lo que demuestra que comprendió el problema antes de comenzar a proponer cambios en el código.",
    },
    {
      nombre: "Calidad y lógica de las decisiones tomadas",
      calificacion: 3.75,
      justificacion:
        "El candidato eligió una solución que no solo resolvía el bug, sino que también evitaba efectos colaterales en otras partes del sistema. Justificó su decisión comparando alternativas y optando por la más eficiente en términos de legibilidad y mantenimiento. Además, explicó por qué descartó otras opciones, demostrando criterio técnico y comprensión del impacto a largo plazo en el código.",
    },
    {
      nombre: "Organización y priorización de ideas",
      calificacion: 3.75,
      justificacion:
        "El candidato estructuró su respuesta de forma clara: primero explicó el problema, luego describió los pasos que siguió para analizarlo, y finalmente detalló la solución implementada. La información fue presentada de forma ordenada y lógica, facilitando su comprensión. Además, priorizó explicar las decisiones más relevantes, sin desviarse en detalles innecesarios.",
    },
    {
      nombre: "Claridad en la comunicación escrita",
      calificacion: 3.75,
      justificacion:
        "El candidato estructuró su respuesta de forma clara: primero explicó el problema, luego describió los pasos que siguió para analizarlo, y finalmente detalló la solución implementada. La información fue presentada de forma ordenada y lógica, facilitando su comprensión. Además, priorizó explicar las decisiones más relevantes, sin desviarse en detalles innecesarios.",
    },
    {
      nombre: "Originalidad o enfoque innovador",
      calificacion: 3.75,
      justificacion:
        "El candidato estructuró su respuesta de forma clara: primero explicó el problema, luego describió los pasos que siguió para analizarlo, y finalmente detalló la solución implementada. La información fue presentada de forma ordenada y lógica, facilitando su comprensión. Además, priorizó explicar las decisiones más relevantes, sin desviarse en detalles innecesarios.",
    },
    {
      nombre: "Conexión con los objetivos del rol o negocio",
      calificacion: 3.75,
      justificacion:
        "El candidato estructuró su respuesta de forma clara: primero explicó el problema, luego describió los pasos que siguió para analizarlo, y finalmente detalló la solución implementada. La información fue presentada de forma ordenada y lógica, facilitando su comprensión. Además, priorizó explicar las decisiones más relevantes, sin desviarse en detalles innecesarios.",
    },
  ],
  feedback_general:
    "El candidato demuestra sólidas habilidades técnicas y un enfoque metodológico para la resolución de problemas, con especial fortaleza en análisis y toma de decisiones.",
};

const getScoreColor = (score: number) => {
  if (score >= 4) return "text-green-600";
  if (score >= 3) return "text-yellow-600";
  if (score >= 2) return "text-orange-600";
  return "text-red-600";
};
type Props = {
  phase: PositionPhaseSearchResult | null;
};
export function TechnicalAssessmentResults({ phase }: Props) {
  const overallScore = 4.8;
  const totalWeighted = 3.15;

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
        {mockData.dimensiones.map((dimension, index) => (
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
      <div className="mt-8 rounded-lg bg-gray-50 p-4">
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
    </div>
  );
}
