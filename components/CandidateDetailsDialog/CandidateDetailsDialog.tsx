"use client";
import { FC, Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { CountryLabel } from "../CountryLabel/CountryLabel";
import { countryLabelLookup } from "@/lib/utils";
import { Linkedin } from "@/icons";
import { ChevronRight, Loader2, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhaseComment from "./PhaseComment";
import { PipefyNode, PipefyPhase, PipefyPipe } from "@/types/pipefy";
import { usePublicPhaseFormLink } from "@/hooks/use-public-phase-form-link";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { CommentBox } from "../CommentBox/CommentBox";
import { PhaseHistory } from "../PhaseHistory/PhaseHistory";
import { useMoveCardToPhase } from "@/hooks/use-move-card-to-phase";
import { useToast } from "@/hooks/use-toast";
import { useHiringProcess } from "@/hooks/use-hiring-process";

interface CandidateDetailsDialogProps {
  phase: PipefyPhase;
  card: PipefyNode;
  pipe: PipefyPipe;
}
export const CandidateDetailsDialog: FC<CandidateDetailsDialogProps> = ({
  card,
  phase,
  pipe,
}) => {
  // const params = useParams<{ id: string }>();
  // const { id: hiringProcessId } = params;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [publicFormUrl, setPublicFormUrl] = useState("");
  const { hiringProcess } = useHiringProcess({
    hiringProcessId: "67c930fe1ad8328f2a3184c2",
  });

  const { mutate: moveCardToPhase, isPending: moveCardToPhasePending } =
    useMoveCardToPhase({
      onSuccess: () => {
        toast({
          title: "Cambio de Fase Correcto",
          description: "El candidato ha sido movido a la siguiente fase.",
        });
        queryClient.invalidateQueries({
          queryKey: QUERIES.PIPE_DATA("305713420"),
        });
      },
      onError: () => {
        console.log("[Debug] move error");
        toast({
          title: "Campos incompletos",
          description: "Por favor verifica los campos requeridos.",
        });
      },
    });
  const { mutate, isPending } = usePublicPhaseFormLink({
    onSuccess(data) {
      console.log("[Success]", data.configurePublicPhaseFormLink);
      setPublicFormUrl(data.configurePublicPhaseFormLink.url);
    },
    onError(error) {
      console.log("[Error]", error);
      setPublicFormUrl("");
    },
  });

  const onMoveCardToPhase = (cardId: string, newPhaseId: string) => {
    moveCardToPhase({
      cardId,
      destinationPhaseId: newPhaseId,
    });
  };

  useEffect(() => {
    if (!open || !card || publicFormUrl) return;
    mutate({
      cardId: card.id,
      enable: true,
    });
  }, [open, card, publicFormUrl, mutate]);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger id={`details-${phase.id}`} className="w-full">
        <Button asChild variant="secondary" className="h-8 w-full">
          <span>Detalles del candidato</span>
        </Button>
      </DialogTrigger>
      <DialogTitle className="hidden">Candidate Info</DialogTitle>

      <DialogContent className="flex max-h-[80vh] min-h-[80vh] max-w-[70vw]">
        <Tabs
          defaultValue="about"
          className="flex h-full w-full max-w-[540px] flex-col items-center justify-center border-r-4 pr-10"
        >
          <TabsList className="min-w-full justify-start rounded-none border-b-[1px] bg-white">
            <TabsTrigger
              className="border-spacing-4 rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
              value="about"
            >
              Perfil Candidato
            </TabsTrigger>
            <TabsTrigger
              className="border-spacing-4 rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
              value="documents"
            >
              Documentos
            </TabsTrigger>
            <TabsTrigger
              className="border-spacing-4 rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
              value="comments"
            >
              Comentarios
            </TabsTrigger>
            <TabsTrigger
              className="border-spacing-4 rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
              value="history"
            >
              Historial
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="about"
            className="max-h-[70vh] w-full max-w-screen-lg overflow-y-auto"
          >
            <div className="flex flex-col gap-2 pt-10">
              <div className="mb-2 flex gap-4">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src="https://picsum.photos/200/200"
                      alt="Profile picture"
                    />
                    <AvatarFallback>
                      {"Sofia Cabrera Londono".charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Badge
                    variant="outline"
                    className="rounded-md text-[#34C759] hover:bg-green-50"
                  >
                    Activa
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs">
                        CDMX &nbsp; -
                        <CountryLabel
                          code="MX"
                          label={countryLabelLookup("mx")}
                        />
                      </span>
                    </div>
                    <Heading level={3} className="text-base">
                      Sofia Cabrera Londono
                    </Heading>
                  </div>

                  <div className="space-y-1">
                    <Text type="p" className="text-xs text-gray-600">
                      Training lead en Globant
                    </Text>
                    <Text size="xxs">Enero 2022 - Actual · 3 años</Text>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 py-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-muted-foreground">Contactar:</span>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Linkedin />
                </a>
                <a href={`mailto:#`} target="_blank" rel="noopener noreferrer">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-200"></div>
            <div className="flex flex-col gap-2 pt-4">
              <Text className="text-xs text-muted-foreground">
                <b>Origen del candidato:</b> Recomendado
              </Text>
              <Text className="mb-4 text-xs text-muted-foreground">
                <b>Fecha de inicio de proceso:</b> 2 Feb 2025
              </Text>
              <Heading className="text-sm" level={2}>
                ¿Qué tanto coincide el candidato con la vacante?
              </Heading>
              <Text className="mb-4 text-sm text-muted-foreground" type="p">
                El candidato tiene experiencia en el sector y habilidades clave
                para el rol, pero le falta dominio en liderazgo de equipos. Con
                algo de formación, podría encajar bien en la vacante.
              </Text>
            </div>

            <div className="flex flex-col gap-2">
              <Heading className="text-sm" level={2}>
                Habilidades que no pudimos evidenciar en el candidato
              </Heading>
              <Text className="mb-4 text-sm text-muted-foreground" type="p">
                No se lograron evidenciar algunas habilidades técnicas como
                Programación en Python, Java y SQL, Inglés avanzado y Gestión de
                proyectos. En cuanto a habilidades blandas, no se observó
                suficiente dominio en Liderazgo y Adaptabilidad.
              </Text>
            </div>
            <div className="mb-8 flex flex-col gap-2">
              <Heading className="text-sm" level={2}>
                Recomendación:
              </Heading>
              <Text className="text-sm text-muted-foreground" type="p">
                ✅ El candidato tiene alto match: El candidato cumple con los
                requisitos clave y encaja bien en la organización. Recomendamos
                avanzar a la siguiente fase del proceso.
              </Text>
            </div>
            <div className="h-[1px] w-full bg-gray-200"></div>
            <div className="mt-8 flex flex-col gap-2">
              <Heading className="text-sm" level={2}>
                Ingeniero de sistemas | Desarrollador FullStack | Scrum master |
                DevOps
              </Heading>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Heading className="text-base font-bold" level={1}>
                Acerca de:
              </Heading>
              <Text className="text-sm text-muted-foreground" type="p">
                Ingeniera de Sistemas con experiencia en desarrollo de software,
                especializada en el diseño e implementación de productos de
                software empresariales escalables, mantenibles y robustos,
                siempre enfocada en agregar valor añadido al negocio.
              </Text>
              <Text className="text-sm text-muted-foreground" type="p">
                Con experiencia en el desarrollo de aplicaciones web y
                microservicios, manejo un amplio stack tecnológico que incluye
                Java (Spring, JSF, JPA, Hibernate), PHP, Python y JavaScript
                (Angular, jQuery). Tengo también sólidos conocimientos en diseño
                y programación de bases de datos relacionales (Oracle, MySQL,
                PostgreSQL) y no relacionales (MongoDB, Firebase).
                Adicionalmente, cuento con experiencia en el diseño y creación
                de reportes e informes utilizando JasperReports
              </Text>
              <Text className="mb-8 text-sm text-muted-foreground" type="p">
                Soy apasionada por los aspectos organizativos internos de las
                empresas, promoviendo el trabajo en equipo y participando
                activamente en la creación de un ambiente laboral saludable y
                colaborativo. Hago uso de metodologías de trabajo ágiles y
                herramientas colaborativas, me adapto con facilidad a nuevas
                responsabilidades, siempre dispuesto a ampliar mis
                conocimientos.
              </Text>
            </div>
            <div className="h-[1px] w-full bg-gray-200"></div>
            <div className="mt-4 flex flex-col gap-8">
              <Heading className="text-base font-bold" level={1}>
                Experiencia
              </Heading>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[#D9D9D9]"></div>
                <div className="flex flex-col">
                  <Text className="text-sm font-bold text-foreground">
                    Globant
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Full Stack
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    sep. 2021 - actual · 3 años CDMX, Mexico
                  </Text>
                </div>
              </div>
              <div className="mb-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[#D9D9D9]"></div>
                <div className="flex flex-col">
                  <Text className="text-sm font-bold text-foreground">
                    Mercado libre
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Full Stack
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    enero. 2020 - sep. 2021· 1 año CDMX, Mexico
                  </Text>
                </div>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-200"></div>
            <div className="mt-4 flex flex-col gap-8">
              <Heading className="text-base font-bold" level={1}>
                Educación
              </Heading>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[#D9D9D9]"></div>
                <div className="flex flex-col">
                  <Text className="text-sm font-bold text-foreground">
                    Tech Monterrei
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Ingeniería de sistemas
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    2008 - 2016
                  </Text>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="comments"
            className="max-h-[70vh] w-full max-w-screen-lg overflow-y-auto"
          >
            <div className="flex flex-col-reverse gap-6 p-6">
              {card.comments?.map((comment) => {
                return (
                  <Fragment key={comment.id}>
                    <div className="h-[1px] w-full bg-gray-200"></div>
                    <PhaseComment
                      hiringProcess={hiringProcess}
                      date={comment.created_at}
                      phase="XXX"
                      comment={comment.text}
                    />
                  </Fragment>
                );
              })}
            </div>
            <div className="flex flex-col gap-6 p-6">
              <CommentBox card={card} />
            </div>
          </TabsContent>
          <TabsContent
            value="history"
            className="max-h-[70vh] w-full max-w-screen-lg overflow-y-auto"
          >
            <PhaseHistory pipe={pipe} card={card} />
          </TabsContent>
        </Tabs>
        <div className="max-h-[75vh] w-[540px] overflow-hidden">
          {!isPending && publicFormUrl && (
            <iframe className="h-full w-full" src={publicFormUrl}></iframe>
          )}
        </div>
        <div className="max-h-[75vh] w-[285px] overflow-hidden">
          <div className="flex flex-col gap-4">
            <Heading className="text-sm font-bold" level={2}>
              Mover tarjera a fase
            </Heading>
            {phase.cards_can_be_moved_to_phases.map(
              (newPhase) =>
                phase.next_phase_ids?.map(String).includes(newPhase.id!) && (
                  <Button
                    onClick={() => onMoveCardToPhase(card.id, newPhase.id!)}
                    key={newPhase.id}
                    variant="secondary"
                    className="flex cursor-pointer justify-between rounded-md bg-secondary px-4 py-2 font-medium text-secondary-foreground"
                  >
                    {moveCardToPhasePending && (
                      <Loader2 className="animate-spin" />
                    )}
                    <p>{newPhase.name}</p>
                    <ChevronRight />
                  </Button>
                ),
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
