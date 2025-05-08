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

/**
 * InfoSheet displays informational content about the soft skills test process,
 * following the Figma design (node 2683:4891). Uses shadcn/ui Sheet and Tailwind.
 */
export const InfoSheet: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="max-w-[200px] bg-[#FCFCFC] text-[#007AFF] hover:bg-[#FCFCFC]">
          Entiende cómo calificamos
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-[780px] p-0 sm:max-w-[780px]">
        <SheetHeader className="border-b bg-white p-12">
          <SheetTitle className="text-lg font-bold text-gray-900">
            Crea tu test de habilidades blandas alineado con tu cultura
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Cada empresa entiende los comportamientos de forma distinta. Nuestra
            IA te ayuda a construir un test hecho a la medida de tu vacante y la
            forma de trabajar en tu organización. ¡Olvídate de las pruebas
            genéricas!
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-192px)] bg-white px-12">
          <div className="flex flex-col gap-0 py-8">
            {/* Section 2: ¿Cómo evaluamos a tus candidatos? */}
            <h2 className="mb-2 text-base font-semibold text-gray-900">
              📋 ¿Cómo evaluamos a tus candidatos?
            </h2>
            <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
              {`Analizamos cada comportamiento desde tres enfoques complementarios:

🟩 Situacional: ¿Qué haría ante un escenario hipotético?
🟦 Experiencial: ¿Qué ha hecho en situaciones reales?
🟨 Reflexiva: ¿Cómo piensa, qué aprendió y cómo actúa?

Esto nos permite conocer mejor a cada persona, más allá de su CV.`}
            </p>
            <div
              className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
              aria-hidden="true"
            />

            {/* Section 3: ¿Cómo se califica? */}
            <h2 className="mb-2 text-base font-semibold text-gray-900">
              🎯 ¿Cómo se califica?
            </h2>
            <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
              {`Cada respuesta se evalúa con una escala del 1 al 5:

Sin evidencia del comportamiento
Respuesta superficial
Lo demuestra con oportunidades de mejora
Lo demuestra con claridad y solidez
Está muy desarrollado e inspira a otros

Calculamos un promedio por comportamiento, y luego un promedio general del test. Así podrás comparar candidatos de forma más objetiva y fácil.`}
            </p>
            <div
              className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
              aria-hidden="true"
            />

            {/* Section 4: Evaluación automática con IA */}
            <h2 className="mb-2 text-base font-semibold text-gray-900">
              🤖 Evaluación automática con IA
            </h2>
            <p className="mb-8 whitespace-pre-line text-sm text-gray-500">
              {`Nuestra IA identifica señales clave en las respuestas como:
🗣 Lenguaje colaborativo
🤝 Reconocimiento al equipo
🧘 Resolución de conflictos
🤓 Capacidad de reflexión

Esto hace que la calificación sea más rápida, precisa y confiable.`}
            </p>
            <div
              className="mb-8 h-[1px] w-full bg-[#EBEDF0]"
              aria-hidden="true"
            />

            {/* Section 5: Beneficios para el reclutador */}
            <h2 className="mb-2 text-base font-semibold text-gray-900">
              ✅ ¿Qué beneficios te puede traer como reclutador?
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-500">
              <li>Un test personalizado y alineado con tu cultura</li>
              <li>Menos tiempo invertido en diseño y revisión</li>
              <li>Mejores decisiones basadas en compatibilidad real</li>
              <li>Un proceso más profesional y moderno para tus candidatos</li>
            </ul>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
