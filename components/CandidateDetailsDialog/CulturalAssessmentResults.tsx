"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CulturalAssessmentResult, PositionPhaseSearchResult } from "@/types";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";

// Mock data based on the image
const mockData: CulturalAssessmentResult = {
  comportamientos: [
    {
      dimension: "Liderazgo - Dimensión reflexiva",
      pregunta:
        "Cuéntame sobre una vez en la que no estuviste de acuerdo con alguien de tu equipo. ¿Qué pasó y cómo lo manejaste?",
      respuesta_candidato:
        "En un proyecto, un compañero y yo teníamos ideas diferentes sobre cómo presentar los resultados. En vez de discutir, propuse una reunión rápida para alinear perspectivas. Escuchamos ambos puntos de vista y decidimos combinar lo mejor de cada uno. Al final, logramos una presentación más completa y el cliente quedó satisfecho.",
      calificacion: 2,
      justificacion:
        "La respuesta obtuvo un 4 de 5 porque el candidato identifica bien el conflicto, toma iniciativa para resolverlo y logra un buen resultado, pero le faltó profundizar en el contexto y compartir una reflexión final sobre lo aprendido.",
    },
    {
      dimension: "Liderazgo - Dimensión situacional",
      pregunta:
        "Describe una situación donde tuviste que liderar un equipo bajo presión.",
      respuesta_candidato:
        "Durante un lanzamiento de producto crítico, nuestro equipo enfrentó múltiples problemas técnicos. Organicé reuniones diarias, asigné tareas específicas y mantuve comunicación constante con stakeholders.",
      calificacion: 1,
      justificacion:
        "Muestra capacidad de organización y comunicación efectiva bajo presión.",
    },
    {
      dimension: "Liderazgo - Dimensión Experiencial",
      pregunta:
        "¿Cómo has desarrollado tus habilidades de liderazgo a lo largo de tu carrera?",
      respuesta_candidato:
        "He participado en programas de mentoría, he liderado proyectos cross-funcionales y he buscado feedback constante de mi equipo para mejorar mi estilo de liderazgo.",
      calificacion: 2,
      justificacion:
        "Demuestra proactividad en el desarrollo personal y profesional.",
    },
    {
      dimension: "Trabajo en equipo - Dimensión reflexiva",
      pregunta:
        "Describe un momento donde tuviste que colaborar con alguien muy diferente a ti.",
      respuesta_candidato:
        "Trabajé con un colega de un background técnico muy diferente. Inicialmente hubo malentendidos, pero establecimos reuniones regulares para alinear expectativas.",
      calificacion: 1,
      justificacion: "Muestra adaptabilidad y habilidades de comunicación.",
    },
    {
      dimension: "Trabajo en equipo - Dimensión situacional",
      pregunta: "¿Cómo manejas los conflictos dentro de un equipo?",
      respuesta_candidato:
        "Prefiero abordar los conflictos de manera directa pero respetuosa, buscando entender todas las perspectivas antes de proponer soluciones.",
      calificacion: 1,
      justificacion: "Enfoque maduro para la resolución de conflictos.",
    },
    {
      dimension: "Trabajo en equipo - Dimensión Experiencial",
      pregunta:
        "¿Qué has aprendido sobre trabajo en equipo en tus experiencias previas?",
      respuesta_candidato:
        "He aprendido que la comunicación clara y la confianza mutua son fundamentales para el éxito del equipo.",
      calificacion: 2,
      justificacion:
        "Reflexión sólida sobre experiencias de trabajo en equipo.",
    },
    {
      dimension: "Creatividad - Dimensión reflexiva",
      pregunta:
        "Cuéntame sobre una vez que tuviste que pensar fuera de la caja para resolver un problema.",
      respuesta_candidato:
        "Cuando nuestro presupuesto se redujo significativamente, propuse una solución híbrida que combinaba recursos internos con herramientas gratuitas.",
      calificacion: 1,
      justificacion: "Muestra pensamiento innovador y adaptabilidad.",
    },
    {
      dimension: "Creatividad - Dimensión situacional",
      pregunta: "¿Cómo generas nuevas ideas en tu trabajo?",
      respuesta_candidato:
        "Utilizo técnicas como brainstorming, investigación de tendencias y colaboración con equipos diversos para generar ideas frescas.",
      calificacion: 1,
      justificacion: "Enfoque estructurado para la generación de ideas.",
    },
    {
      dimension: "Creatividad - Dimensión Experiencial",
      pregunta:
        "Describe un proyecto donde tu creatividad fue clave para el éxito.",
      respuesta_candidato:
        "Desarrollé una campaña de marketing no convencional que resultó en un aumento del 40% en engagement usando recursos limitados.",
      calificacion: 2,
      justificacion: "Ejemplo concreto de aplicación exitosa de creatividad.",
    },
  ],
  feedback_general:
    "El candidato muestra un buen equilibrio entre habilidades técnicas y soft skills, con particular fortaleza en liderazgo y trabajo en equipo.",
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
export function CulturalAssessmentResults({ phase }: Props) {
  const overallScore = 4.8;
  const totalWeighted = 3.15;

  // Group behaviors by main category
  const groupedBehaviors = mockData.comportamientos.reduce(
    (acc, behavior) => {
      const [category, dimension] = behavior.dimension.split(" - ");
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ ...behavior, dimensionType: dimension });
      return acc;
    },
    {} as Record<
      string,
      Array<(typeof mockData.comportamientos)[0] & { dimensionType: string }>
    >,
  );

  // Calculate average score per category
  const categoryScores = Object.entries(groupedBehaviors).map(
    ([category, behaviors]) => {
      const avgScore =
        behaviors.reduce((sum, b) => sum + b.calificacion, 0) /
        behaviors.length;
      return {
        category,
        score: Number(((avgScore * 5) / 2).toFixed(2)),
        behaviors,
      }; // Convert to 5-point scale
    },
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
        {categoryScores.map(({ category, score, behaviors }) => (
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
              {behaviors.map((behavior, index) => (
                <AccordionItem
                  key={index}
                  value={`${category}-${index}`}
                  className="border-0"
                >
                  <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline">
                    <div className="flex w-full items-center justify-between">
                      <span className="text-left font-medium text-gray-900">
                        {behavior.dimensionType}
                      </span>
                      <span
                        className={`mr-4 text-sm font-semibold ${getScoreColor(behavior.calificacion)}`}
                      >
                        {behavior.calificacion} de 5
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="mb-2 font-semibold text-gray-900">
                          Pregunta:
                        </p>
                        <p className="text-gray-700">{behavior.pregunta}</p>
                      </div>

                      <div>
                        <p className="mb-2 font-semibold text-gray-900">
                          Respuesta del candidato:
                        </p>
                        <p className="italic text-gray-700">
                          {behavior.respuesta_candidato}
                        </p>
                      </div>

                      <div>
                        <p className="mb-2 font-semibold text-gray-900">
                          Justificación para la calificación:
                        </p>
                        <p className="text-gray-700">
                          {behavior.justificacion}
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
