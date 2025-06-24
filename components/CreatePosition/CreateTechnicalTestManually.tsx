"use client";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";

import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { EditIcon, LogOut } from "lucide-react";
import { Step, Stepper } from "./Stepper";
import LoadingSkeleton from "./ChatSkeleton";

import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import { useMessageHistory } from "@/hooks/use-message-history";
import {
  BotResponseTypes,
  DraftPositionData,
  PositionConfigurationPhaseTypes,
  TechnicalAssessment,
} from "@/types";
import { useBusinesses } from "@/hooks/use-businesses";
import _ from "lodash";

import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";

import { StickyFooter } from "./StickyFooter";
import { useCompletePhase } from "@/hooks/use-complete-phase";
import { Textarea } from "../ui/textarea";
import { DialogDescription, DialogFooter } from "../ui/dialog";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogContent } from "../ui/dialog";
import { Dialog } from "../ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useUpdatePositionConfiguration } from "@/hooks/use-update-position-configuration";

type CreateTechnicalTestManuallyProps = {
  dictionary: Dictionary;
};

export const CreateTechnicalTestManually: FC<
  Readonly<CreateTechnicalTestManuallyProps>
> = ({ dictionary }) => {
  const params = useParams<{
    lang: Locale;
    id: string;
    position_id: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { lang, position_id, id } = params;
  const [, setIsCompleted] = useState(false);
  const [mode, setMode] = useState<"preview" | "edit">("edit");
  const initialData = useRef<TechnicalAssessment>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [progress, setProgress] = useState<TechnicalAssessment | null>(null);

  const isDirty = !_.isEqual(progress, initialData.current);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const { isLoading: loadingBusiness, businesses } = useBusinesses();
  const currentBusiness = businesses.find((business) => business._id === id);

  const { mutate: saveDraft, isPending } = useUpdatePositionConfiguration({
    onSuccess: (data) => {
      console.info("Save Draft success", data);
      initialData.current = progress;
      toast({
        description: i18n.draftSavedMessage,
      });
      queryClient.invalidateQueries({
        queryKey: QUERIES.POSITION_CONFIG_LIST_ALL,
      });
      if (
        progress?.assesment_goal &&
        progress?.challenge &&
        progress?.your_mission
      ) {
        setIsCompleted(true);
        setMode("preview");
      }
    },
    onError: (error) => {
      console.error("Save Draft error", error);
    },
  });

  const { mutate: completePhase, isPending: isCompletePhasePending } =
    useCompletePhase({
      onSuccess: (data) => {
        console.info("Complete Phase success", data);
        queryClient.invalidateQueries({
          queryKey: QUERIES.POSITION_CONFIG_LIST_ALL,
        });
        router.push(
          `/${lang}/dashboard/companies/${id}/position-configuration/${position_id}`,
        );
      },
      onError: (error) => {
        console.error("Complete Phase error", error);
      },
    });

  const { data: positionConfiguration, isLoading: loadingConfiguration } =
    usePositionConfigurations({
      id: position_id,
      businessId: id,
    });

  const { createPositionPage: i18n } = dictionary;
  const [steps, setSteps] = useState<Step[]>([]);

  const currentPosition = useMemo(() => {
    return positionConfiguration?.body.data.find(
      (position) => position._id === position_id,
    );
  }, [positionConfiguration, position_id]);

  const currentPhase = useMemo(() => {
    return currentPosition?.phases.find(
      (phase) => phase.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST,
    );
  }, [currentPosition]);

  const { messages, isLoading } = useMessageHistory({
    threadId: currentPhase?.thread_id,
  });
  useEffect(() => {
    if (progress && !initialData.current) {
      initialData.current = progress;
    }
  }, [progress]);
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
    const technicalTestPhase = currentPosition?.phases.find(
      (phase) => phase.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST,
    );
    if (technicalTestPhase) {
      setProgress(technicalTestPhase.data as TechnicalAssessment);
    }
  }, [currentPosition]);

  const technicalSkillsPhase = useMemo(() => {
    return currentPosition?.phases.find(
      (phase) => phase.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST,
    );
  }, [currentPosition]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const container = messageRef.current;
      if (!container) return;
      container.scrollTop = container.scrollHeight;
    }
  }, [isLoading, messages]);

  useEffect(() => {
    if (progress?.your_mission && progress.challenge) return;
    const msg = messages.filter((msg) => msg.role === "assistant").pop();
    if (!msg) return;

    const raw = msg.content?.[0]?.text?.value;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.assesment && Object.keys(parsed.assesment).length > 0) {
        setProgress(parsed.assesment as TechnicalAssessment);
      }
      if (parsed?.response_type === BotResponseTypes.FINAL_CONFIRMATION) {
        setIsCompleted(true);
      }
    } catch {}
  }, [messages, progress]);

  const missionItems = progress?.your_mission?.split(/\d+\.\s/).filter(Boolean);
  const checkUnsavedChanges = () => {
    if (!isDirty) {
      setMode("preview");
      return;
    }
    setDialogOpen(true);
  };

  const onSaveDraft = () => {
    if (!currentPhase) return;
    if (!currentPosition) return;
    setDialogOpen(false);
    saveDraft({
      ...currentPosition,
      phases:
        currentPosition?.phases.map((phase) =>
          phase.name === currentPhase?.name
            ? {
                ...phase,
                data: progress,
              }
            : phase,
        ) ?? [],
    });
  };
  if (isLoading || loadingBusiness || loadingConfiguration)
    return <LoadingSkeleton />;

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
          phase={PositionConfigurationPhaseTypes.TECHNICAL_TEST}
          steps={steps}
          setSteps={setSteps}
          i18n={i18n}
        />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Asi se vera tu assessment</h1>
        <div className="flex gap-2">
          {mode === "preview" && (
            <Button
              onClick={() => {
                setMode("edit");
              }}
              variant="outline"
            >
              <EditIcon />
              Editar
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <p>
          Este es el assessment que verán tus candidatos. Está diseñado con base
          en el rol y los retos reales del área, para ayudarte a identificar
          quién tiene las habilidades necesarias para enfrentarlos desde el día
          uno.
        </p>
      </div>
      <h1 className="text-2xl font-bold">{progress?.business_case_title}</h1>
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Contexto de la empresa</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {currentBusiness?.description}
        </p>
      </section>

      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Contexto del rol</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {(currentPosition?.phases[0]?.data as DraftPositionData)?.description}
        </p>
      </section>

      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Objetivo del assessment</h2>
        </div>
        {mode === "preview" ? (
          <p className="cursor-text leading-relaxed text-gray-600">
            {progress?.assesment_goal}
          </p>
        ) : (
          <Textarea
            placeholder="Objetivo del assessment"
            className="w-full"
            value={progress?.assesment_goal}
            onChange={(e) => {
              setProgress({
                ...progress,
                assesment_goal: e.target.value,
              } as TechnicalAssessment);
            }}
          />
        )}
      </section>

      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Instrucciones</h2>
        </div>
        <div className="cursor-text leading-relaxed text-gray-600">
          Formato del archivo
          <ul className="mb-2 list-disc pl-6">
            <li>El documento debe ser entregado en formato PDF.</li>
            <li>No debe tener contraseña ni estar protegido</li>
          </ul>
          <p>Plazo de entrega</p>
          <ul className="mb-2 list-disc pl-6">
            <li>
              Tienes un plazo de 2 días calendario para enviar la prueba
              resuelta, contados a partir de la fecha de recepción de este
              mensaje.
            </li>
            <li>
              Asegúrate de enviar el archivo antes del vencimiento del plazo.
            </li>
          </ul>
          <p>
            Contenido del documento:{" "}
            <span className="font-semibold">
              En el PDF solo debes incluir lo siguiente:
            </span>
          </p>
          <ul className="mb-2 list-disc pl-6">
            <li>Tu nombre completo como presentante del assessment.</li>
            <li>
              El título exacto de cada pregunta, tal como aparece en la prueba.
            </li>
            <li>
              La respuesta correspondiente justo debajo del título de cada
              pregunta.
            </li>
          </ul>
          <p>Formato del contenido</p>
          <ul className="mb-2 list-disc pl-6">
            <li>Por favor, no modifiques el enunciado de las preguntas.</li>
            <li>
              Asegúrate de que cada respuesta esté debidamente identificada y
              organizada según su pregunta correspondiente.
            </li>
            <li>
              Si incluyes código, puede ir en formato texto o capturas, pero
              asegúrate de que sea legible.
            </li>
          </ul>
          <p>Recomendaciones adicionales</p>
          <ul className="mb-2 list-disc pl-6">
            <li>
              Revisa la ortografía y redacción antes de enviar el documento.
            </li>
            <li>
              Si usaste recursos externos o bibliografía, puedes mencionarlos al
              final del documento.
            </li>
            <li>
              Verifica que el archivo se abra correctamente antes de enviarlo
            </li>
            <li>
              El nombre del archivo puede seguir este formato:
              Assessment_técnico_NombreApellido.pdf.
            </li>
          </ul>
        </div>
      </section>
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Criterios de evaluación</h2>
        </div>
        <p className="mb-2 text-gray-600">
          Tu respuesta será evaluada con base en los siguientes criterios (cada
          uno de 1 a 5 puntos):
        </p>
        <ol className="mb-2 list-decimal pl-6 text-gray-600">
          <li> Capacidad de análisis del problema</li>
          <li> Relevancia y lógica de la solución propuesta</li>
          <li> Priorización y enfoque</li>
          <li> Claridad en la comunicación escrita</li>
          <li> Creatividad o iniciativa</li>
          <li> Alineación con los objetivos del rol o negocio</li>
        </ol>
      </section>

      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> El Reto</h2>
        </div>
        {mode === "preview" ? (
          <p className="cursor-text leading-relaxed text-gray-600">
            {progress?.challenge}
          </p>
        ) : (
          <Textarea
            placeholder="El Reto"
            className="w-full"
            value={progress?.challenge}
            onChange={(e) => {
              setProgress({
                ...progress,
                challenge: e.target.value,
              } as TechnicalAssessment);
            }}
          />
        )}
      </section>

      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Tu Misión</h2>
        </div>
        {mode === "preview" ? (
          <ol className="list-decimal space-y-2 pl-6 text-gray-600">
            {missionItems?.map((item, idx) => <li key={idx}>{item.trim()}</li>)}
          </ol>
        ) : (
          <Textarea
            placeholder="Tu Misión"
            className="w-full"
            value={progress?.your_mission}
            onChange={(e) => {
              setProgress({
                ...progress,
                your_mission: e.target.value,
              } as TechnicalAssessment);
            }}
          />
        )}
      </section>

      {mode === "edit" && (
        <StickyFooter
          canSave={isDirty}
          cancelLabel={i18n.cancelLabel}
          saveLabel={i18n.saveLabel}
          isSaving={isPending}
          onCancel={() => {
            checkUnsavedChanges();
          }}
          onSave={() => {
            onSaveDraft();
          }}
        />
      )}

      {mode === "preview" && technicalSkillsPhase?.status !== "COMPLETED" && (
        <StickyFooter
          showCancelButton={false}
          canSave={true}
          cancelLabel={i18n.cancelLabel}
          saveLabel={`¡Todo Listo!`}
          isSaving={isCompletePhasePending}
          onCancel={() => {}}
          onSave={() => {
            console.info("Saving", progress);
            if (!progress) return;
            completePhase({
              position_configuration_id: position_id,
              data: progress,
            });
          }}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18n.cancelEditDialogTitle}</DialogTitle>
            <DialogDescription>
              {i18n.cancelEditDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {i18n.cancelEditDialogCancel}
            </Button>
            <Button onClick={() => setMode("preview")}>
              {i18n.cancelEditDialogConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
