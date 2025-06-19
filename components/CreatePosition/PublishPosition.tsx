"use client";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, SquareArrowUpRight } from "lucide-react";
import {
  Assessment,
  DraftPositionData,
  PositionConfigurationPhaseTypes,
  PositionConfigurationTypes,
  PositionPhase,
  TechnicalAssessment,
} from "@/types";
import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import ModeSelectionSkeleton from "./ModeSelectionSkeleton";
import { Step, Stepper } from "./Stepper";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/use-current-user";
import { StickyFooter } from "./StickyFooter";
import { SoftSkillsSheet } from "./SoftSkillsSheet";
import { PositionSheet } from "./PositionSheet";
import { useBusinesses } from "@/hooks/use-businesses";
import { useCreatePosition } from "@/hooks/use-create-position";
import { useToast } from "@/hooks/use-toast";
import { TechnicalSkillsSheet } from "./TechnicalSkillsSheet";
import { useNextPhase } from "@/hooks/use-next-phase";

type PublishPositionProps = {
  dictionary: Dictionary;
};

export const PublishPosition: FC<Readonly<PublishPositionProps>> = ({
  dictionary,
}) => {
  const { toast } = useToast();
  const [steps, setSteps] = useState<Step[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const queryClient = useQueryClient();
  const params = useParams<{ lang: Locale; id: string; position_id: string }>();
  const { lang, id: businessId, position_id } = params;
  const { businesses } = useBusinesses();
  const currentBusiness = useMemo(
    () => businesses.find((b) => b._id === businessId),
    [businesses, businessId],
  );
  const { createPositionPage: i18n } = dictionary;
  const { currentUser } = useCurrentUser();
  const { mutate, isPending } = useCreatePosition({
    onSuccess(data) {
      const { body } = data;
      const { data: positionData } = body;
      queryClient.invalidateQueries({
        queryKey: QUERIES.POSITION_CONFIG_LIST_ALL,
      });
      toast({
        title: "Vacante publicada",
        description:
          "¡Felicitaciones! Publicaste tu vacante. Te notificaremos cuando tu tablero de seguimiento esté listo.",
      });
      console.log(
        "%c[Debug] positionData",
        "background-color: teal; font-size: 20px; color: white",
        positionData,
      );
      router.push(
        `/${lang}/dashboard/positions?business_id=${businessId}&position_id=${positionData._id}`,
      );
    },
    onError(error) {
      console.log("[Error]", error);
    },
  });
  const {
    data: positionConfiguration,
    isLoading,
    refetch,
  } = usePositionConfigurations({
    all: true,
    businessId: businessId,
  });

  const currentPosition = useMemo(() => {
    return positionConfiguration?.body?.data?.find(
      (position) => position._id === position_id,
    );
  }, [positionConfiguration, position_id]);

  const { mutate: nextPhase, isPending: isNextPhasePending } = useNextPhase({
    onSuccess(data) {
      const { body } = data;
      const { data: positionData } = body;
      console.log(
        "%c[Debug] nextPhase",
        "background-color: teal; font-size: 20px; color: white",
        positionData,
      );
      queryClient.invalidateQueries({
        queryKey: QUERIES.POSITION_CONFIG_LIST_ALL,
      });
      refetch();
    },
    onError(error) {
      console.log("[Error]", error);
    },
  });

  useEffect(() => {
    if (currentPosition) {
      setSteps(
        currentPosition.phases.map((phase) => ({
          title: phase.name,
          status: phase.status,
          type: phase.type,
        })),
      );
    }
  }, [currentPosition]);

  useEffect(() => {
    if (!currentPosition || isNextPhasePending) return;
    if (
      currentPosition.current_phase !==
      PositionConfigurationPhaseTypes.READY_TO_PUBLISH
    ) {
      nextPhase({
        position_configuration_id: position_id,
        configuration_type: PositionConfigurationTypes.NONE_REQUIRED,
      });
    }
  }, [currentPosition]);

  console.log(
    "%c[Debug] ",
    "background-color: teal; font-size: 20px; color: white",
    currentPosition,
  );

  const createPosition = () => {
    mutate({
      position_configuration_id: position_id,
      configuration_type: PositionConfigurationTypes.AI_TEMPLATE,
    });
  };

  const renderPreviewSheet = (phase: PositionPhase) => {
    switch (phase.type) {
      case PositionConfigurationPhaseTypes.DESCRIPTION:
        return (
          <PositionSheet
            key={phase.type}
            positionData={phase.data as DraftPositionData}
            dictionary={dictionary}
            business={currentBusiness ? currentBusiness : undefined}
            customTrigger={
              <Button variant="outline" className="w-[242px] justify-between">
                Descripción de la vacante
                <SquareArrowUpRight className="h-4 w-4" />
              </Button>
            }
          />
        );

      case PositionConfigurationPhaseTypes.SOFT_SKILLS:
        return (
          <SoftSkillsSheet
            key={phase.type}
            assessment={phase.data as Assessment}
            dictionary={dictionary}
            role={(currentPosition?.phases[0]?.data as DraftPositionData)?.role}
            customTrigger={
              <Button variant="outline" className="w-[242px] justify-between">
                Assessment fit cultural
                <SquareArrowUpRight className="h-4 w-4" />
              </Button>
            }
          />
        );
      case PositionConfigurationPhaseTypes.TECHNICAL_TEST:
        return (
          <TechnicalSkillsSheet
            key={phase.type}
            assessment={phase.data as TechnicalAssessment}
            dictionary={dictionary}
            customTrigger={
              <Button variant="outline" className="w-[242px] justify-between">
                Assessment Técnico
                <SquareArrowUpRight className="h-4 w-4" />
              </Button>
            }
          />
        );

      default:
        return null;
    }
  };

  if (isLoading) return <ModeSelectionSkeleton />;
  return (
    <div className="flex w-full flex-col px-8 py-2">
      <div className="mx-auto mb-14 w-full max-w-[60rem] space-y-8 p-6">
        <Link
          href={`/${lang}/dashboard/positions?tab=drafts&business_id=${businessId}&position_id=${position_id}`}
          replace
        >
          <Button variant="ghost" className="-mx-8 text-sm">
            <ChevronLeft className="h-4 w-4" />
            {i18n.goBack}
          </Button>
        </Link>
        <div className="mx-auto flex w-fit min-w-[60rem] flex-col gap-7 rounded-md px-10 py-2 shadow-md">
          <Stepper
            phase={PositionConfigurationPhaseTypes.READY_TO_PUBLISH}
            steps={steps}
            setSteps={setSteps}
            i18n={i18n}
          />
        </div>
      </div>
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="items -center flex gap-8 md:flex-row">
          <div className="flex w-full justify-center md:w-1/3">
            <div className="relative h-64 w-64">
              <Image
                src="/assets/tici.png"
                alt="Robot mascot"
                className="h-full w-full object-contain"
                width={256}
                height={256}
              />
            </div>
          </div>

          <div className="w-full space-y-6 md:w-2/3">
            <div className="space-y-2">
              <h1 className="font-bold">¡Listo, {currentUser?.name}!</h1>
              <p className="text-sm text-gray-700">
                Acabas de crear una vacante increíble, hecha a la medida de lo
                que tu empresa necesita.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold">
                Revisa lo que construiste
              </h2>
              <div className="flex flex-col space-y-2">
                {currentPosition?.phases.map((phase) =>
                  renderPreviewSheet(phase),
                )}
              </div>
            </div>

            {!modeParam && (
              <>
                <div className="space-y-3">
                  <h2 className="font-semibold">¿Qué sigue?</h2>
                  <p className="text-sm text-gray-700">
                    Cuando hagas clic en <strong>Publicar vacante</strong>,
                    activaremos el tablero de seguimiento. Ahí podrás:
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                    <li>
                      Ver en tiempo real quién se postula y cómo avanza el
                      proceso.
                    </li>
                    <li>Gestionar cada paso con total claridad y control.</li>
                    <li>Recibir alertas cuando haya novedades importantes.</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-700">
                  Todo está listo para que encuentres al mejor talento, sin
                  perder tiempo. 🚀
                </p>
              </>
            )}

            {modeParam === "duplicate" && (
              <>
                <div className="space-y-3">
                  <h2 className="font-semibold">¿Qué sigue?</h2>
                  <p className="text-sm text-gray-700">
                    Cuando hagas clic en <strong>Duplicar vacante</strong>,
                    activaremos el tablero de seguimiento. Ahí podrás:
                  </p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                    <li>
                      Ver en tiempo real quién se postula y cómo avanza el
                      proceso.
                    </li>
                    <li>Gestionar cada paso con total claridad y control.</li>
                    <li>Recibir alertas cuando haya novedades importantes.</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-700">
                  Antes de continuar, revisa bien la información de la vacante
                  duplicada. Tal como la dejes, así se publicará.
                </p>

                <p className="text-sm text-gray-700">
                  Todo está listo para que encuentres al mejor talento, sin
                  perder tiempo. 🚀
                </p>
              </>
            )}

            {modeParam !== "edit" && (
              <StickyFooter
                showCancelButton={false}
                canSave={true}
                cancelLabel={i18n.cancelLabel}
                saveLabel={
                  modeParam === "duplicate"
                    ? i18n.duplicatePositionBtnLabel
                    : i18n.publishPositionBtnLabel
                }
                isSaving={isPending || isNextPhasePending}
                onCancel={() => {}}
                onSave={createPosition}
                saveButtonIcon={<ChevronRight className="h-4 w-4" />}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
