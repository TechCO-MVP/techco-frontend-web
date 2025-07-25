"use client";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { BrainCog, ChevronLeft, Copy } from "lucide-react";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { OptionCard } from "../OptionCard/OptionCard";
import {
  PositionConfigurationFlowTypes,
  PositionConfigurationPhaseTypes,
  PositionConfigurationTypes,
} from "@/types";
import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import AnimatedModal from "../ChatBot/AnimatedModal";
import { InfoSheet } from "./InfoSheet";

import { useNextPhase } from "@/hooks/use-next-phase";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import ModeSelectionSkeleton from "./ModeSelectionSkeleton";
import { usePositionsByBusiness } from "@/hooks/use-position-by-business";
type ModeSelectionProps = {
  dictionary: Dictionary;
};

export const ModeSelection: FC<Readonly<ModeSelectionProps>> = ({
  dictionary,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ lang: Locale; id: string; position_id: string }>();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  console.log(
    "%c[Debug] modeParam",
    "background-color: teal; font-size: 20px; color: white",
    modeParam,
  );
  const [selectedOption, setSelectedOption] =
    useState<PositionConfigurationTypes | null>(null);
  const { lang, id: businessId, position_id } = params;
  const { createPositionPage: i18n } = dictionary;
  const { mutate, isPending } = useNextPhase({
    onSuccess(data) {
      const { body } = data;
      const { data: positionData } = body;
      queryClient.invalidateQueries({
        queryKey: QUERIES.POSITION_CONFIG_LIST_ALL,
      });
      const currentPhase = positionData.phases?.find(
        (phase) => phase.status === "IN_PROGRESS",
      );

      if (
        selectedOption === PositionConfigurationTypes.OTHER_POSITION_AS_TEMPLATE
      ) {
        redirectToCopy();
        return;
      }
      if (
        selectedOption === PositionConfigurationTypes.CUSTOM &&
        currentPhase?.type === PositionConfigurationPhaseTypes.DESCRIPTION
      ) {
        router.push(
          `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/description?type=${PositionConfigurationTypes.CUSTOM}`,
        );
        return;
      }

      if (
        selectedOption === PositionConfigurationTypes.CUSTOM &&
        currentPhase?.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST
      ) {
        router.push(
          `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/technical-test?type=${PositionConfigurationTypes.CUSTOM}`,
        );
        return;
      }
      if (!currentPhase) {
        // If no phase in progress, redirect to the first one (description)
        router.push(
          `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/description`,
        );
        return;
      }
      switch (currentPhase.type) {
        case PositionConfigurationPhaseTypes.DESCRIPTION:
          router.push(
            `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/description`,
          );
          break;
        case PositionConfigurationPhaseTypes.SOFT_SKILLS:
          router.push(
            `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/soft-skills`,
          );
          break;
        case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
          router.push(
            `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/technical-test`,
          );
          break;
        case PositionConfigurationPhaseTypes.FINAL_INTERVIEW:
          router.push(
            `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/final-interview`,
          );
          break;
        case PositionConfigurationPhaseTypes.READY_TO_PUBLISH:
          router.push(
            `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/publish${modeParam ? `?mode=${modeParam}` : ""}`,
          );
          break;
        default:
          router.push(
            `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/description`,
          );
          break;
      }
    },
    onError(error) {
      console.log("[Error]", error);
    },
  });
  const { data: positionConfiguration, isLoading } = usePositionConfigurations({
    all: true,
    businessId: businessId,
  });

  const { data: positionsByBusiness, isLoading: isLoadingPositionsByBusiness } =
    usePositionsByBusiness({ id: businessId });

  const currentPosition = useMemo(() => {
    return positionConfiguration?.body?.data?.find(
      (position) => position._id === position_id,
    );
  }, [positionConfiguration, position_id]);

  const activePhase = useMemo(() => {
    const phase = currentPosition?.phases?.find(
      (phase) => phase.status === "DRAFT" || phase.status === "IN_PROGRESS",
    );
    const descriptionPhase = currentPosition?.phases?.find(
      (phase) => phase.type === PositionConfigurationPhaseTypes.DESCRIPTION,
    );
    // If no current_phase, assume we are in the description phase
    if (!currentPosition?.current_phase) return descriptionPhase;
    // use the next phase in draft state
    if (phase) return phase;
    return null;
  }, [currentPosition]);

  const redirectToCopy = () => {
    if (!activePhase) return;
    switch (activePhase?.type) {
      case PositionConfigurationPhaseTypes.DESCRIPTION:
        router.push(
          `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/description/copy`,
        );
        break;
      case PositionConfigurationPhaseTypes.SOFT_SKILLS:
        router.push(
          `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/soft-skills/copy`,
        );
        break;
      case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
        router.push(
          `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/technical-test/copy`,
        );
        break;
      default:
        router.push(
          `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/description/copy`,
        );
    }
  };

  console.log(
    "%c[Debug] activePhase",
    "background-color: teal; font-size: 20px; color: white",
    activePhase,
  );
  useEffect(() => {
    if (
      activePhase &&
      activePhase.type === PositionConfigurationPhaseTypes.READY_TO_PUBLISH
    ) {
      router.push(
        `/${lang}/dashboard/companies/${businessId}/position-configuration/${position_id}/publish${modeParam ? `?mode=${modeParam}` : ""}`,
      );
    }
  }, [activePhase]);

  const startNextPhase = (selectedOption: PositionConfigurationTypes) => {
    mutate({
      position_configuration_id: position_id,
      configuration_type: selectedOption,
    });
  };

  const getTitle = () => {
    switch (activePhase?.type) {
      case PositionConfigurationPhaseTypes.DESCRIPTION:
        return `Paso 1: ${i18n.descriptionPhasePageTitle}`;
      case PositionConfigurationPhaseTypes.SOFT_SKILLS:
        return `Paso 2: ${i18n.softSkillsPhasePageTitle}`;
      case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
        return `Paso 3: ${i18n.technicalSkillsPhasePageTitle}`;
      case PositionConfigurationPhaseTypes.FINAL_INTERVIEW:
        return i18n.descriptionPhasePageTitle;
      case PositionConfigurationPhaseTypes.READY_TO_PUBLISH:
        return i18n.descriptionPhasePageTitle;
    }
  };

  const getDescription = () => {
    switch (activePhase?.type) {
      case PositionConfigurationPhaseTypes.DESCRIPTION:
        return i18n.descriptionPhasePageDescription;
      case PositionConfigurationPhaseTypes.SOFT_SKILLS:
        return i18n.softSkillsPhasePageDescription;
      case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
        return i18n.technicalSkillsPhasePageDescription;
      case PositionConfigurationPhaseTypes.FINAL_INTERVIEW:
        return i18n.descriptionPhasePageDescription;
      case PositionConfigurationPhaseTypes.READY_TO_PUBLISH:
        return i18n.descriptionPhasePageDescription;
      default:
        return i18n.descriptionPhasePageDescription;
    }
  };

  const getAiDescription = () => {
    switch (activePhase?.type) {
      case PositionConfigurationPhaseTypes.DESCRIPTION:
        return i18n.createWithAiDescription;
      case PositionConfigurationPhaseTypes.SOFT_SKILLS:
        return i18n.createWithAiSoftSkills;
      case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
        return i18n.createWithAiTechnicalSkills;
      case PositionConfigurationPhaseTypes.FINAL_INTERVIEW:
        return i18n.createWithAiDescription;
      case PositionConfigurationPhaseTypes.READY_TO_PUBLISH:
        return i18n.createWithAiDescription;
      default:
        return i18n.createWithAiDescription;
    }
  };

  const getCopyDescription = () => {
    switch (activePhase?.type) {
      case PositionConfigurationPhaseTypes.DESCRIPTION:
        return i18n.copyPreviousDescription;
      case PositionConfigurationPhaseTypes.SOFT_SKILLS:
        return i18n.copyPreviousSoftSkills;
      case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
        return i18n.copyPreviousTechnicalSkills;
      default:
        return i18n.copyPreviousDescription;
    }
  };

  const canCopy = () => {
    const configs = positionsByBusiness?.body?.data;

    if (!configs || configs.length === 0) return false;
    switch (activePhase?.type) {
      case PositionConfigurationPhaseTypes.DESCRIPTION:
        const completedDescriptions = configs.filter(
          (config) =>
            config.phases.filter(
              (phase) =>
                phase.type === PositionConfigurationPhaseTypes.DESCRIPTION &&
                phase.status === "COMPLETED",
            ).length > 0,
        );
        return completedDescriptions.length > 0;
      case PositionConfigurationPhaseTypes.SOFT_SKILLS:
        const completedSoftSkills = configs.filter(
          (config) =>
            config.phases.filter(
              (phase) =>
                phase.type === PositionConfigurationPhaseTypes.SOFT_SKILLS &&
                phase.status === "COMPLETED",
            ).length > 0,
        );

        return completedSoftSkills.length > 0;
      case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
        const completedTechnicalTests = configs.filter(
          (config) =>
            config.phases.filter(
              (phase) =>
                phase.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST &&
                phase.status === "COMPLETED",
            ).length > 0,
        );
        return completedTechnicalTests.length > 0;
      default:
        return false;
    }
  };

  const renderCreateWithAi = () => {
    if (
      currentPosition?.flow_type ===
        PositionConfigurationFlowTypes.MEDIUM_PROFILE_FLOW &&
      activePhase?.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST
    ) {
      return null;
    }
    return (
      <OptionCard
        loading={
          isPending && selectedOption === PositionConfigurationTypes.AI_TEMPLATE
        }
        selectBtnLabel={i18n.selectBtnLabel}
        title={i18n.createWithAi}
        description={getAiDescription()}
        onClick={() => {
          setSelectedOption(PositionConfigurationTypes.AI_TEMPLATE);
          startNextPhase(PositionConfigurationTypes.AI_TEMPLATE);
        }}
        icon={<BrainCog className="h-10 w-10 stroke-talent-green-500" />}
      />
    );
  };

  const renderCreateManually = () => {
    if (activePhase?.type === PositionConfigurationPhaseTypes.DESCRIPTION) {
      return (
        <OptionCard
          loading={
            isPending && selectedOption === PositionConfigurationTypes.CUSTOM
          }
          selectBtnLabel={i18n.selectBtnLabel}
          title={i18n.createDescriptionManually}
          description={i18n.createDescriptionManuallyDescription}
          onClick={() => {
            setSelectedOption(PositionConfigurationTypes.CUSTOM);
            startNextPhase(PositionConfigurationTypes.CUSTOM);
          }}
          icon={<BrainCog className="h-10 w-10 stroke-talent-green-500" />}
        />
      );
    }
    if (
      currentPosition?.flow_type ===
        PositionConfigurationFlowTypes.MEDIUM_PROFILE_FLOW &&
      activePhase?.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST
    ) {
      return (
        <OptionCard
          loading={
            isPending && selectedOption === PositionConfigurationTypes.CUSTOM
          }
          selectBtnLabel={i18n.selectBtnLabel}
          title={i18n.createManually}
          description={i18n.createManuallyDescription}
          onClick={() => {
            setSelectedOption(PositionConfigurationTypes.CUSTOM);
            startNextPhase(PositionConfigurationTypes.CUSTOM);
          }}
          icon={<BrainCog className="h-10 w-10 stroke-talent-green-500" />}
        />
      );
    }
    return null;
  };

  if (
    isLoading ||
    isLoadingPositionsByBusiness ||
    activePhase?.type === PositionConfigurationPhaseTypes.READY_TO_PUBLISH
  )
    return <ModeSelectionSkeleton />;
  return (
    <div className="flex w-full flex-col px-8 py-2">
      <div className="relative flex flex-col gap-2">
        <Link
          href={`/${lang}/dashboard/positions?tab=drafts&business_id=${businessId}&position_id=${position_id}`}
          replace
        >
          <Button variant="ghost" className="-mx-8 text-sm">
            <ChevronLeft className="h-4 w-4" />
            {i18n.goBack}
          </Button>
        </Link>
        <Heading className="text-2xl" level={1}>
          {getTitle()}
        </Heading>
        <Text className="max-w-[49rem] text-sm text-muted-foreground" type="p">
          {getDescription()}
        </Text>
        <div className="mt-8 h-[1px] w-full bg-gray-200"></div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        {activePhase?.type !==
          PositionConfigurationPhaseTypes.FINAL_INTERVIEW && (
          <AnimatedModal
            dictionary={dictionary}
            mode="stepper"
            defaultOpen={false}
            type={activePhase?.type}
          />
        )}
        <InfoSheet
          type={
            activePhase?.type || PositionConfigurationPhaseTypes.DESCRIPTION
          }
          dictionary={dictionary}
        />
      </div>
      <div className="mt-14 flex justify-center gap-8">
        {renderCreateWithAi()}
        {renderCreateManually()}
        <OptionCard
          loading={
            isPending &&
            selectedOption ===
              PositionConfigurationTypes.OTHER_POSITION_AS_TEMPLATE
          }
          selectBtnLabel={i18n.selectBtnLabel}
          title={i18n.copyPrevious}
          description={getCopyDescription()}
          disabled={!canCopy()}
          disabledReason={i18n.noPreviousPositions}
          onClick={() => {
            setSelectedOption(
              PositionConfigurationTypes.OTHER_POSITION_AS_TEMPLATE,
            );
            redirectToCopy();
          }}
          icon={<Copy className="h-10 w-10 stroke-talent-green-500" />}
        />
      </div>
    </div>
  );
};
