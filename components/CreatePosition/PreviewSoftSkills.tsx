"use client";

import { FC, useEffect, useMemo, useState } from "react";
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
          queryKey: QUERIES.POSITION_CONFIG_LIST(id),
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

  const softSkillsPhase = useMemo(() => {
    return currentPosition?.phases.find(
      (phase) => phase.type === PositionConfigurationPhaseTypes.SOFT_SKILLS,
    );
  }, [currentPosition]);

  console.log("softSkillsPhase", softSkillsPhase);
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
        <Stepper
          phase={PositionConfigurationPhaseTypes.SOFT_SKILLS}
          steps={steps}
          setSteps={setSteps}
          i18n={i18n}
        />
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
        {positionData.soft_skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex items-center gap-2 font-semibold">
              <h2>{skill.name}</h2>
            </div>
            <p className="cursor-text leading-relaxed text-gray-600">
              {skill.description}
            </p>
          </div>
        ))}
      </section>

      <StickyFooter
        showCancelButton={false}
        canSave={true}
        cancelLabel={i18n.cancelLabel}
        saveLabel={
          softSkillsPhase?.status === "COMPLETED"
            ? `Guardar Cambios`
            : `${i18n.continuedNextPhase} 3`
        }
        isSaving={isCompletePhasePending}
        onCancel={() => {}}
        onSave={() => {
          if (softSkillsPhase?.status === "COMPLETED") {
            router.push(
              `/${lang}/dashboard/companies/${id}/position-configuration/${position_id}`,
            );
          } else {
            completePhase({
              position_configuration_id: position_id,
              data: positionData,
            });
          }
        }}
        saveButtonIcon={<ChevronRight className="h-4 w-4" />}
      />
    </div>
  );
};
