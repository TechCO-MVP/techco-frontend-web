import { FC, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Dictionary } from "@/types/i18n";
import { PositionConfigurationPhaseTypes } from "@/types";

export const InfoSheet: FC<{
  type: PositionConfigurationPhaseTypes;
  dictionary: Dictionary;
}> = ({ type, dictionary }) => {
  const { createPositionPage: i18n } = dictionary;
  const info = i18n.softSkillsInfoSheet;
  const [open, setOpen] = useState(false);

  const getContentByType = () => {
    switch (type) {
      case PositionConfigurationPhaseTypes.SOFT_SKILLS:
        return (
          <SheetContent className="w-full max-w-[780px] p-0 sm:max-w-[780px]">
            <SheetHeader className="border-b bg-white p-12">
              <SheetTitle className="text-lg font-bold text-gray-900">
                {info.title}
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                {info.description}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-192px)] bg-white px-12">
              <div className="flex flex-col gap-0 py-8">
                {/* Section 2: How do we evaluate your candidates? */}
                <h2 className="mb-2 text-base font-semibold text-gray-900">
                  {info.howWeEvaluateTitle}
                </h2>
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  {info.howWeEvaluateText}
                </p>
                <div
                  className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
                  aria-hidden="true"
                />

                {/* Section 3: How is it scored? */}
                <h2 className="mb-2 text-base font-semibold text-gray-900">
                  {info.scoringTitle}
                </h2>
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  {info.scoringText}
                </p>
                <div
                  className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
                  aria-hidden="true"
                />

                {/* Section 4: AI Evaluation */}
                <h2 className="mb-2 text-base font-semibold text-gray-900">
                  {info.aiEvaluationTitle}
                </h2>
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  {info.aiEvaluationText}
                </p>
                <div
                  className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
                  aria-hidden="true"
                />

                {/* Section 5: Recruiter Benefits */}
                <h2 className="mb-2 text-base font-semibold text-gray-900">
                  {info.recruiterBenefitsTitle}
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-500">
                  {info.recruiterBenefitsList.map(
                    (item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ),
                  )}
                </ul>
              </div>
            </ScrollArea>
          </SheetContent>
        );
      case PositionConfigurationPhaseTypes.DESCRIPTION:
        return (
          <SheetContent className="w-full max-w-[780px] p-0 sm:max-w-[780px]">
            <SheetHeader className="border-b bg-white p-12">
              <SheetTitle className="text-lg font-bold text-gray-900">
                🧠 ¿Cómo se califica el primer filtro?
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-192px)] bg-white px-12">
              <div className="flex flex-col gap-0 py-8">
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  Antes de que los candidatos lleguen a las pruebas, validamos
                  lo esencial. Con base en la descripción de tu vacante, les
                  preguntamos directamente si:
                </p>

                <ul className="mb-4 space-y-2 pl-5 text-sm text-gray-500">
                  <li>
                    📌 Tienen experiencia en las responsabilidades clave del
                    cargo
                  </li>
                  <li>
                    💡 Cuentan con los conocimientos o habilidades requeridas
                  </li>
                  <li>💰Están dentro del rango salarial (si lo definiste)</li>
                </ul>
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  Cada respuesta suma: por ejemplo, si hay 5 responsabilidades y
                  el candidato cumple con 4, su puntaje será
                </p>
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  🔍Esto nos permite filtrar rápidamente quién realmente cumple
                  con los requerimientos básicos y quién no, sin perder tiempo
                  en perfiles que no están alineados desde el inicio.
                </p>
              </div>
            </ScrollArea>
          </SheetContent>
        );
      case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
        return (
          <SheetContent className="w-full max-w-[780px] p-0 sm:max-w-[780px]">
            <SheetHeader className="border-b bg-white p-12">
              <SheetTitle className="text-lg font-bold text-gray-900">
                🧠 ¿Cómo evaluamos a tus candidatos?
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                Con base en la información que nos compartiste en la descripción
                del cargo y el test de fit cultural creamos una prueba técnica
                alineada con los retos reales del rol y tu forma de trabajar.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-192px)] bg-white px-12">
              <div className="flex flex-col gap-0 py-8">
                {/* Section 2: How do we evaluate your candidates? */}
                <h2 className="mb-4 text-base font-semibold text-gray-900">
                  Evaluamos el desempeño técnico desde seis dimensiones clave:
                </h2>
                <ul className="mb-4 space-y-2 pl-5 text-sm text-gray-500">
                  <li> 🔍 Capacidad de análisis del problema</li>
                  <li>🧩 Relevancia y lógica de la solución propuesta</li>
                  <li>🎯 Priorización y enfoque</li>
                  <li>✍️ Claridad en la comunicación escrita</li>
                  <li>💡 Creatividad o iniciativa</li>
                  <li>📌 Alineación con los objetivos del rol o del negocio</li>
                </ul>
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  Estas dimensiones nos permiten entender cómo piensa el
                  candidato, cómo resuelve problemas reales y si está preparado
                  para asumir los retos del rol.
                </p>
                <div
                  className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
                  aria-hidden="true"
                />

                {/* Section 3: How is it scored? */}
                <h2 className="mb-4 text-base font-semibold text-gray-900">
                  🎯 ¿Cómo se califica?
                </h2>
                <p className="mb-4 whitespace-pre-line text-sm text-gray-500">
                  Cada respuesta se evalúa con una escala del 1 al 5:
                </p>
                <ul className="mb-4 space-y-2 pl-5 text-sm text-gray-500">
                  <li>1. No cumple. Confuso o sin comprensión</li>
                  <li>2. Cumple poco. Vago o con errores</li>
                  <li>3. Aceptable. Claro y razonable</li>
                  <li>4. Bueno. Sólido y estructurado</li>
                  <li>5. Excelente. Claro, profundo y estratégico</li>
                </ul>

                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  Calculamos un promedio por dimensión y un promedio general del
                  test. Así podrás comparar candidatos de forma más objetiva,
                  precisa y simple.
                </p>
                <div
                  className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
                  aria-hidden="true"
                />

                {/* Section 4: AI Evaluation */}
                <h2 className="mb-4 text-base font-semibold text-gray-900">
                  🤖 Evaluación automática con IA
                </h2>
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  Nuestra lA analiza las respuestas en función de señales clave
                  como:
                </p>
                <ul className="mb-4 space-y-2 pl-5 text-sm text-gray-500">
                  <li>🧠 Coherencia en el análisis del problema</li>
                  <li>🧩 Calidad y lógica de las decisiones tomadas</li>
                  <li>🗂 Organización y priorización de ideas</li>
                  <li>✍️ Claridad en la comunicación escrita</li>
                  <li>✨ Originalidad o enfoque innovador</li>
                  <li>🎯 Conexión con los objetivos del rol o negocio</li>
                </ul>
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  Esto hace que la calificación sea más rápida, confiable y útil
                  para ti como reclutador.
                </p>
                <div
                  className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
                  aria-hidden="true"
                />

                {/* Section 5: Recruiter Benefits */}
                <h2 className="mb-2 text-base font-semibold text-gray-900">
                  ✅¿Qué beneficios te puede traer como reclutador?
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-500">
                  <li>Un test adaptado a los retos reales del rol</li>
                  <li>Menos tiempo invertido en diseño y revisión</li>
                  <li>
                    Decisiones más informadas sobre la capacidad técnica real
                  </li>
                  <li>Un proceso profesional y moderno para tus candidatos</li>
                </ul>
              </div>
            </ScrollArea>
          </SheetContent>
        );
      default:
        return (
          <SheetContent className="w-full max-w-[780px] p-0 sm:max-w-[780px]">
            <SheetHeader className="border-b bg-white p-12">
              <SheetTitle className="text-lg font-bold text-gray-900">
                {info.title}
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                {info.description}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-192px)] bg-white px-12">
              <div className="flex flex-col gap-0 py-8">
                {/* Section 2: How do we evaluate your candidates? */}
                <h2 className="mb-2 text-base font-semibold text-gray-900">
                  {info.howWeEvaluateTitle}
                </h2>
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  {info.howWeEvaluateText}
                </p>
                <div
                  className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
                  aria-hidden="true"
                />

                {/* Section 3: How is it scored? */}
                <h2 className="mb-2 text-base font-semibold text-gray-900">
                  {info.scoringTitle}
                </h2>
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  {info.scoringText}
                </p>
                <div
                  className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
                  aria-hidden="true"
                />

                {/* Section 4: AI Evaluation */}
                <h2 className="mb-2 text-base font-semibold text-gray-900">
                  {info.aiEvaluationTitle}
                </h2>
                <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
                  {info.aiEvaluationText}
                </p>
                <div
                  className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
                  aria-hidden="true"
                />

                {/* Section 5: Recruiter Benefits */}
                <h2 className="mb-2 text-base font-semibold text-gray-900">
                  {info.recruiterBenefitsTitle}
                </h2>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-500">
                  {info.recruiterBenefitsList.map(
                    (item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ),
                  )}
                </ul>
              </div>
            </ScrollArea>
          </SheetContent>
        );
    }
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-[#FCFCFC] text-[#007AFF] hover:bg-[#FCFCFC]">
          {i18n.howWeEvaluate}
        </Button>
      </SheetTrigger>
      {getContentByType()}
    </Sheet>
  );
};
