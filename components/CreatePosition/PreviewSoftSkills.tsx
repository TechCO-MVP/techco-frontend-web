"use client";

import { FC, useEffect, useState } from "react";
import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import { useParams, useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import { Step, Stepper } from "./Stepper";
import { Dictionary } from "@/types/i18n";
import { Button } from "../ui/button";

import {
  Assessment,
  PositionConfiguration,
  PositionConfigurationPhaseTypes,
  DraftPositionData,
} from "@/types";

import { StickyFooter } from "./StickyFooter";
import { ChevronRight, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";

import { useCompletePhase } from "@/hooks/use-complete-phase";
import { SoftSkillsSheet } from "./SoftSkillsSheet";

type Props = {
  dictionary: Dictionary;
};
export const PreviewSoftSkills: FC<Props> = ({ dictionary }) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentPosition, setCurrentPosition] =
    useState<PositionConfiguration>();
  const [positionData, setPositionData] = useState<Assessment>();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: completePhase, isPending: isCompletePhasePending } =
    useCompletePhase({
      onSuccess: (data) => {
        console.info("Complete Phase success", data);
        queryClient.invalidateQueries({
          queryKey: QUERIES.POSITION_CONFIG_LIST,
        });
        router.push(
          `/${lang}/dashboard/companies/${id}/position-configuration/${position_id}`,
        );
      },
      onError: (error) => {
        console.error("Complete Phase error", error);
      },
    });
  const { createPositionPage: i18n } = dictionary;

  const params = useParams<{
    lang: Locale;
    id: string;
    position_id: string;
  }>();

  const { position_id, id, lang } = params;

  const { data: positionConfiguration } = usePositionConfigurations({
    id: position_id,
    businessId: id,
  });
  console.log("positionConfiguration", positionConfiguration);

  useEffect(() => {
    const currentPosition = positionConfiguration?.body.data?.[0];

    if (currentPosition) {
      setCurrentPosition(currentPosition);
      setSteps(
        currentPosition.phases.map((phase) => ({
          title: phase.name,
          status: phase.status,
          type: phase.type,
        })),
      );
      const softSkillsPhase = currentPosition.phases.find(
        (phase) => phase.type === PositionConfigurationPhaseTypes.SOFT_SKILLS,
      );

      if (!softSkillsPhase) return;

      setPositionData(softSkillsPhase.data as Assessment);
    }
  }, [positionConfiguration]);

  if (!positionData) return null;

  return (
    <div className="mx-auto mb-14 w-full max-w-[60rem] space-y-8 p-6">
      <Button
        variant="outline"
        onClick={() => {
          router.push(
            `/${lang}/dashboard/positions?tab=drafts&business_id=${id}&position_id=${position_id}`,
          );
        }}
      >
        <LogOut />
        {i18n.exit}
      </Button>
      <div className="mx-auto flex w-fit min-w-[60rem] flex-col gap-7 rounded-md px-10 py-2 shadow-md">
        <Stepper steps={steps} setSteps={setSteps} i18n={i18n} />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Competencias que vas a evaluar de fit cultural
        </h1>
        <div className="flex gap-2">
          <SoftSkillsSheet
            assessment={positionData}
            dictionary={dictionary}
            role={(currentPosition?.phases[0]?.data as DraftPositionData)?.role}
            customTrigger={
              <Button variant="talentGreen" className="h-8">
                {i18n.previewSoftSkillsBtnLabel}
              </Button>
            }
          />
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <p>
          Estas son las competencias que vas a evaluar, definidas junto contigo
          para reflejar fielmente los valores y la cultura de tu empresa. Te
          ayudarán a identificar a los candidatos que realmente encajen con tu
          equipo.
        </p>
      </div>
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Comunicación Efectiva</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          Habilidad para articular ideas y directrices de manera clara y
          persuasiva, tanto oralmente como por escrito. La comunicación clara es
          esencial para asegurar que la planificación y ejecución de campañas
          sean comprendidas por todos los involucrados, permitiendo un flujo de
          trabajo eficiente y minimizando errores.
        </p>
      </section>

      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Flexibilidad y Adaptabilidad</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          Capacidad para adaptarse rápidamente a los cambios y manejar
          imprevistos con facilidad. Debido a la naturaleza dinámica del mercado
          y las tecnologías emergentes, esta habilidad asegura que el asistente
          pueda ajustar sus estrategias y tácticas de manera oportuna para
          maximizar el impacto de las campañas.
        </p>
      </section>

      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Pensamiento Crítico</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          Habilidad para evaluar información de manera objetiva, identificar
          problemas y proponer soluciones basadas en el análisis de datos. En el
          entorno de marketing digital, la capacidad de analizar métricas y
          tomar decisiones basadas en datos es vital para optimizar el
          rendimiento de las campañas y alcanzar los objetivos del negocio..
        </p>
      </section>

      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Manejo del Tiempo</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          Capacidad para organizar y priorizar tareas de manera eficaz,
          asegurando que los plazos sean cumplidos. En un rol con múltiples
          responsabilidades, es esencial que el candidato pueda gestionar su
          tiempo y el del equipo eficientemente para garantizar que las campañas
          sean implementadas y ejecutadas dentro de los plazos previstos.
        </p>
      </section>

      <StickyFooter
        showCancelButton={false}
        canSave={true}
        cancelLabel={i18n.cancelLabel}
        saveLabel={`${i18n.continuedNextPhase} 3`}
        isSaving={isCompletePhasePending}
        onCancel={() => {}}
        onSave={() => {
          console.info("Saving", positionData);
          completePhase({
            position_configuration_id: position_id,
            data: positionData,
          });
        }}
        saveButtonIcon={<ChevronRight className="h-4 w-4" />}
      />
    </div>
  );
};
