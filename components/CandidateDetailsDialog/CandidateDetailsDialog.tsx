"use client";
import {
  Dispatch,
  FC,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { CountryLabel } from "../CountryLabel/CountryLabel";
import { countryLabelLookup, formatDate } from "@/lib/utils";
import { Linkedin } from "@/icons";
import { ChevronRight, Loader2, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhaseComment from "./PhaseComment";
import {
  PipefyFieldValues,
  PipefyNode,
  PipefyPhase,
  PipefyPipe,
} from "@/types/pipefy";
import { usePublicPhaseFormLink } from "@/hooks/use-public-phase-form-link";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { CommentBox } from "../CommentBox/CommentBox";
import { PhaseHistory } from "../PhaseHistory/PhaseHistory";
import { useMoveCardToPhase } from "@/hooks/use-move-card-to-phase";
import { useToast } from "@/hooks/use-toast";
import { useOpenPositions } from "@/hooks/use-open-positions";
import { useParams } from "next/navigation";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import { Dictionary } from "@/types/i18n";
import { useBusinesses } from "@/hooks/use-businesses";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUsers } from "@/hooks/use-users";

interface CandidateDetailsDialogProps {
  phase: PipefyPhase;
  card: PipefyNode;
  pipe: PipefyPipe;
  dictionary: Dictionary;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export const CandidateDetailsDialog: FC<CandidateDetailsDialogProps> = ({
  card,
  phase,
  pipe,
  dictionary,
  open,
  setOpen,
}) => {
  const { userCard: i18n } = dictionary;
  const { rootBusiness } = useBusinesses();
  const fieldMap = PipefyBoardTransformer.mapFields(card.fields);
  const candidateBio = fieldMap[PipefyFieldValues.CandidateBio];
  const timeInPosition = fieldMap[PipefyFieldValues.TimeInPosition];
  const recomendation = fieldMap[PipefyFieldValues.Recomendation];
  const positionMatch = fieldMap[PipefyFieldValues.PositionMatch];
  const candidateName = fieldMap[PipefyFieldValues.CandidateName];
  const avatarUrl =
    fieldMap[PipefyFieldValues.Avatar] || "https://picsum.photos/200/200";
  const candidateCountry = fieldMap[PipefyFieldValues.CandidateCountry] || "CO";
  const candidateCity =
    fieldMap[PipefyFieldValues.CandidateCityA] ||
    fieldMap[PipefyFieldValues.CandidateCityB] ||
    "Bogotá";
  const currentPosition = fieldMap[PipefyFieldValues.CurrentPosition];
  const currentCompany = fieldMap[PipefyFieldValues.CurrentCompany];
  const processStartDate =
    fieldMap[PipefyFieldValues.ProcessStartDate] || undefined;
  const candidateSource = fieldMap[PipefyFieldValues.CandidateSource];
  const linkedinUrl = fieldMap[PipefyFieldValues.LinkedInURL] || "#";
  const email = fieldMap[PipefyFieldValues.CandidateEmail] || "#";
  const params = useParams<{ id: string }>();
  const { id } = params;
  const { currentUser } = useCurrentUser();

  const { users } = useUsers({
    businessId: rootBusiness?._id,
    all: true,
  });
  const localUser = useMemo(() => {
    return users.find((user) => user.email === currentUser?.email);
  }, [users, currentUser]);
  const { positions } = useOpenPositions({
    userId: localUser?._id,
    businessId: rootBusiness?._id,
  });
  const selectedPosition = useMemo(() => {
    return positions.find((position) => position._id === id);
  }, [positions, id]);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [publicFormUrl, setPublicFormUrl] = useState("");
  const stakeHolders = useMemo(() => {
    if (!selectedPosition) return [];
    const responsibles = selectedPosition.responsible_users;
    const responsibleIds = responsibles.map(
      (responsible) => responsible.user_id,
    );

    if (!responsibleIds.includes(selectedPosition.owner_position_user_id)) {
      responsibleIds.push(selectedPosition.owner_position_user_id);
      responsibles.push({
        user_id: selectedPosition.owner_position_user_id,
        user_name: selectedPosition.owner_position_user_name,
        can_edit: true,
      });
    }
    if (!responsibleIds.includes(selectedPosition.recruiter_user_id)) {
      responsibleIds.push(selectedPosition.recruiter_user_id);

      responsibles.push({
        user_id: selectedPosition.recruiter_user_id,
        user_name: selectedPosition.recruiter_user_name,
        can_edit: true,
      });
    }
    return responsibles;
  }, [selectedPosition]);

  const { mutate: moveCardToPhase, isPending: moveCardToPhasePending } =
    useMoveCardToPhase({
      onSuccess: () => {
        toast({
          title: "Cambio de Fase Correcto",
          description: "El candidato ha sido movido a la siguiente fase.",
        });
        queryClient.invalidateQueries({
          queryKey: QUERIES.PIPE_DATA(pipe.id),
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
      <DialogTitle className="hidden">{i18n.candidateDetails}</DialogTitle>

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
              {i18n.profileTabTitle}
            </TabsTrigger>
            <TabsTrigger
              className="border-spacing-4 rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
              value="documents"
            >
              {i18n.documentsTabTitle}
            </TabsTrigger>
            <TabsTrigger
              className="border-spacing-4 rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
              value="comments"
            >
              {i18n.commentsTabTitle}
            </TabsTrigger>
            <TabsTrigger
              className="border-spacing-4 rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
              value="history"
            >
              {i18n.historyTabTitle}
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
                    <AvatarImage src={avatarUrl} alt="Profile picture" />
                    <AvatarFallback>{candidateName.charAt(0)}</AvatarFallback>
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
                        {candidateCity} &nbsp; -
                        <CountryLabel
                          code={candidateCountry}
                          label={countryLabelLookup(candidateCountry)}
                        />
                      </span>
                    </div>
                    <Heading level={3} className="text-base">
                      {candidateName}
                    </Heading>
                  </div>

                  <div className="space-y-1">
                    <Text type="p" className="text-xs text-gray-600">
                      {currentPosition} {i18n.inLabel} {currentCompany}
                    </Text>
                    <Text size="xxs">{timeInPosition}</Text>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 py-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-muted-foreground">
                  {i18n.contactLabel}:
                </span>
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin />
                </a>
                <a
                  href={`mailto:${email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gray-200"></div>
            <div className="flex flex-col gap-2 pt-4">
              <Text className="text-xs text-muted-foreground">
                <b>{i18n.candidateSource}:</b> {candidateSource}
              </Text>
              <Text className="mb-4 text-xs text-muted-foreground">
                <b>{i18n.processStartDate}:</b>
                {formatDate(processStartDate)}
              </Text>
              <Heading className="text-sm" level={2}>
                {i18n.candidateMatchLabel}
              </Heading>
              <Text className="mb-4 text-sm text-muted-foreground" type="p">
                {positionMatch}
              </Text>
            </div>

            <div className="flex flex-col gap-2">
              <Heading className="text-sm" level={2}>
                {i18n.missingSkillsLabel}
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
                {i18n.recommendationLabel}:
              </Heading>
              <Text className="text-sm text-muted-foreground" type="p">
                {recomendation}
              </Text>
            </div>
            <div className="h-[1px] w-full bg-gray-200"></div>
            {candidateBio && (
              <>
                <div className="mt-8 flex flex-col gap-2">
                  <Heading className="text-sm" level={2}>
                    {currentPosition}
                  </Heading>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <Heading className="text-base font-bold" level={1}>
                    {i18n.aboutLabel}:
                  </Heading>
                  <Text className="mb-8 text-sm text-muted-foreground" type="p">
                    {candidateBio}
                  </Text>
                </div>
              </>
            )}
            <div className="h-[1px] w-full bg-gray-200"></div>
            <div className="mt-4 flex flex-col gap-8">
              <Heading className="text-base font-bold" level={1}>
                {i18n.experienceLabel}
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
                {i18n.educationLabel}
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
                      phaseLabel={i18n.phaseLabel}
                      stakeHolders={stakeHolders}
                      date={comment.created_at}
                      comment={comment.text}
                    />
                  </Fragment>
                );
              })}
            </div>
            <div className="flex flex-col gap-6 p-6">
              <CommentBox
                stakeHolders={stakeHolders}
                pipeId={pipe.id}
                card={card}
              />
            </div>
          </TabsContent>
          <TabsContent
            value="history"
            className="max-h-[70vh] w-full max-w-screen-lg overflow-y-auto"
          >
            <PhaseHistory dictionary={dictionary} pipe={pipe} card={card} />
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
              {i18n.moveToPhase}
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
