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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { CountryLabel } from "../CountryLabel/CountryLabel";
import {
  calculateScore,
  countryLabelLookup,
  findPhaseByName,
  formatDate,
  getCulturalAssessmentScore,
  getTechnicalAssessmentScore,
} from "@/lib/utils";
import { Linkedin } from "@/icons";
import { Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhaseComment from "./PhaseComment";
import { PipefyFieldValues, PipefyNode, PipefyPipe } from "@/types/pipefy";
import { usePublicPhaseFormLink } from "@/hooks/use-public-phase-form-link";

import { CommentBox } from "../CommentBox/CommentBox";
// import { PhaseHistory } from "../PhaseHistory/PhaseHistory";

import { useOpenPositions } from "@/hooks/use-open-positions";
import { useParams, useSearchParams } from "next/navigation";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import { Dictionary } from "@/types/i18n";
import { useBusinesses } from "@/hooks/use-businesses";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUsers } from "@/hooks/use-users";
import {
  selectNotificationsState,
  setNotificationsState,
} from "@/lib/store/features/notifications/notifications";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { SoftSkillsResults } from "./SoftSkillsResults";
import ResultsTabContent from "./ResultsTabContent";
import {
  CulturalAssessmentResultType,
  HiringPositionData,
  PHASE_NAMES,
  PositionConfigurationFlowTypes,
} from "@/types";

import { CulturalAssessmentResults } from "./CulturalAssessmentResults";
import { FirstInterviewResults } from "./FirstInterviewResults";
import {
  TechnicalAssessmentResult,
  TechnicalAssessmentResults,
} from "./TechnicalAssessmentResults";
// import { useFileProcessingStatus } from "@/hooks/use-file-processing-status";
// import { useAssistantResponse } from "@/hooks/use-assistant-response";
import { STATEMENT_BUTTON_TEXT } from "@/constants";

interface PhaseData {
  id: string;
  name: string;
  score?: number;
  maxScore: number;
  component?: React.ReactNode;
  status: "completed" | "pending" | "in-progress";
  details?: {
    description?: string;
    completedDate?: string;
    duration?: string;
    evaluator?: string;
    notes?: string;
  };
}

interface CandidateDetailsDialogProps {
  card: PipefyNode;
  pipe: PipefyPipe;
  dictionary: Dictionary;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  position?: HiringPositionData;
}
export const CandidateDetailsDialog: FC<CandidateDetailsDialogProps> = ({
  card,
  pipe,
  dictionary,
  open,
  setOpen,
  position,
}) => {
  const notificationsState = useAppSelector(selectNotificationsState);
  // const [fetchProcessId, setFetchProcessId] = useState<string | null>(null);
  const { showCandidateDetails } = notificationsState;
  const { userCard: i18n } = dictionary;
  const { rootBusiness } = useBusinesses();
  const fieldMap = PipefyBoardTransformer.mapFields(card.fields);
  const candidateBio = fieldMap[PipefyFieldValues.CandidateBio];
  const timeInPosition = fieldMap[PipefyFieldValues.TimeInPosition];
  const recomendation = fieldMap[PipefyFieldValues.Recomendation];
  const positionMatch = fieldMap[PipefyFieldValues.PositionMatch];
  const candidateName = fieldMap[PipefyFieldValues.CandidateName];
  const aspectsNotDemostrated =
    fieldMap[PipefyFieldValues.AspectsNotDemostrated];
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
  const firstInterviewScore = fieldMap[PipefyFieldValues.FirstInterviewScore];
  const firstInterviewFeedback =
    fieldMap[PipefyFieldValues.FirstInterviewFeedback];
  const finalInterviewScore = fieldMap[PipefyFieldValues.FinalInterviewScore];
  const finalInterviewFeedback =
    fieldMap[PipefyFieldValues.FinalInterviewFeedback];
  const linkedinUrl = fieldMap[PipefyFieldValues.LinkedInURL] || "#";
  const email = fieldMap[PipefyFieldValues.CandidateEmail] || "#";
  const params = useParams<{ id: string }>();
  const { id } = params;
  const { currentUser } = useCurrentUser();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const businessParam = searchParams.get("business_id");
  const { users } = useUsers({
    businessId: rootBusiness?._id,
    all: true,
  });
  const localUser = useMemo(() => {
    return users.find((user) => user.email === currentUser?.email);
  }, [users, currentUser]);

  // const { fileProcessingStatus } = useFileProcessingStatus(fetchProcessId);

  // const { mutate: getAssistantResponse } = useAssistantResponse({
  //   onSuccess(data) {
  //     console.log("[Success]", data);
  //   },
  //   onError(error) {
  //     console.log("[Error]", error);
  //   },
  // });

  const { positions } = useOpenPositions({
    userId: localUser?._id,
    businessId: businessParam || rootBusiness?._id,
  });
  const selectedPosition = useMemo(() => {
    return positions.find((position) => position._id === id);
  }, [positions, id]);

  const hiringProcess = useMemo(() => {
    return selectedPosition?.hiring_processes.find(
      (process) => process.card_id === card.id,
    );
  }, [selectedPosition, card]);

  const currentPhase = findPhaseByName(
    card.current_phase.name,
    // PHASE_NAMES.TECHNICAL_ASSESSMENT_RESULTS,
    position?.position_flow,
  );

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

  useEffect(() => {
    if (!open || !card || publicFormUrl) return;
    mutate({
      cardId: card.id,
      enable: true,
    });
  }, [open, card, publicFormUrl, mutate]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      dispatch(setNotificationsState({ showCandidateDetails: undefined }));
    }
  };

  const getDataForPhase = (phaseId: string) => {
    return hiringProcess?.phases[phaseId];
  };

  // This logic is to get the run_id from the file processing status
  // Only for the cultural fit assessment phase
  // useEffect(() => {
  //   if (!open || fetchProcessId) return;
  //   if (
  //     card.current_phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT_RESULTS
  //   ) {
  //     const phaseData = getDataForPhase(card.current_phase.id);
  //     if (
  //       phaseData?.custom_fields.process_id &&
  //       !phaseData?.custom_fields.cultural_assessment_result
  //     ) {
  //       setFetchProcessId(phaseData?.custom_fields.process_id);
  //     }
  //   }
  // });

  // This logic is to get the assistant response with the assessment result
  // useEffect(() => {
  //   if (!open) return;
  //   if (!fileProcessingStatus) return;
  //   if (
  //     card.current_phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT_RESULTS &&
  //     hiringProcess
  //   ) {
  //     const phaseData = getDataForPhase(card.current_phase.id);
  //     if (!phaseData?.custom_fields.cultural_assessment_result) {
  //       getAssistantResponse({
  //         run_id: fileProcessingStatus.run_id,
  //         assistant_type: AssistantName.CULTURAL_FIT_ASSESSMENT,
  //         thread_id: fileProcessingStatus.thread_id,
  //         hiring_process_id: hiringProcess._id,
  //       });
  //     }
  //   }
  // }, [fileProcessingStatus]);

  useEffect(() => {
    if (!open) return;
    console.log(
      "%c[Debug] ",
      "background-color: teal; font-size: 20px; color: white",
      { hiringProcess, card, currentPhase, position },
    );
  }, [open, hiringProcess, card, currentPhase, position]);

  const renderCulturalAssessmentResults = () => {
    const culturalAssessmentPhase = pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT,
    );
    if (!culturalAssessmentPhase) return null;
    const data = getDataForPhase(culturalAssessmentPhase.id);
    return <CulturalAssessmentResults data={data} phase={currentPhase} />;
  };

  const renderTechnicalAssessmentResults = () => {
    const technicalAssessmentPhase = pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.TECHNICAL_ASSESSMENT,
    );
    if (!technicalAssessmentPhase) return null;

    return (
      <TechnicalAssessmentResults
        data={getDataForPhase(technicalAssessmentPhase.id)}
        phase={currentPhase}
      />
    );
  };

  const renderSoftSkillsResults = () => {
    const offerSentPhase = pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.OFFER_SENT,
    );
    console.log(
      "%c[Debug] offerSentPhase",
      "background-color: teal; font-size: 20px; color: white",
      offerSentPhase,
    );
    if (!offerSentPhase) return null;
    return (
      <div className="flex flex-col gap-4">
        <SoftSkillsResults
          data={getDataForPhase(offerSentPhase.id)}
          position={position}
          phase={currentPhase}
        />
      </div>
    );
  };

  const dynamicValues = useMemo(() => {
    const statements = card.current_phase.fields.filter(
      (f) => f.type === "statement",
    );

    const values: Record<string, string> = {};

    for (const statement of statements) {
      const desc = statement.description ?? "";
      const matches = [...desc.matchAll(/{{\s*phase\d+\.field(\d+)\s*}}/g)];

      for (const match of matches) {
        const fieldId = match[1];

        const matchingField = card.fields.find(
          (f) => f.phase_field?.internal_id === fieldId,
        );

        if (matchingField) {
          values[fieldId] = matchingField.value ?? "";
        }
      }
    }

    return values;
  }, [card]);

  const renderCallToActionContent = (phaseName: string) => {
    switch (phaseName) {
      case PHASE_NAMES.INITIAL_FILTER:
        const offerSentPhase = pipe.phases.find(
          (phase) => phase.name === PHASE_NAMES.OFFER_SENT,
        );
        console.log(
          "%c[Debug] offerSentPhase",
          "background-color: teal; font-size: 20px; color: white",
          offerSentPhase,
        );
        if (!offerSentPhase) return null;
        return (
          <div className="flex flex-col gap-4">
            <SoftSkillsResults
              data={getDataForPhase(offerSentPhase.id)}
              position={position}
              phase={currentPhase}
            />
          </div>
        );
      case PHASE_NAMES.CULTURAL_FIT_ASSESSMENT_RESULTS:
        const culturalAssessmentPhase = pipe.phases.find(
          (phase) => phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT,
        );
        if (!culturalAssessmentPhase) return null;
        const data = getDataForPhase(culturalAssessmentPhase.id);
        console.log(
          "%c[Debug] CULTURAL_FIT_ASSESSMENT_RESULTS",
          "background-color: teal; font-size: 20px; color: white",
          data,
        );
        return <CulturalAssessmentResults data={data} phase={currentPhase} />;
      case PHASE_NAMES.FIRST_INTERVIEW_RESULTS:
        return (
          <FirstInterviewResults
            candidateName={candidateName}
            phase={currentPhase}
          />
        );
      case PHASE_NAMES.TECHNICAL_ASSESSMENT_RESULTS:
        const technicalAssessmentPhase = pipe.phases.find(
          (phase) => phase.name === PHASE_NAMES.TECHNICAL_ASSESSMENT,
        );
        if (!technicalAssessmentPhase) return null;
        const technicalAssessmentData = getDataForPhase(
          technicalAssessmentPhase.id,
        );
        console.log(
          "%c[Debug] TECHNICAL_ASSESSMENT_RESULTS",
          "background-color: teal; font-size: 20px; color: white",
          technicalAssessmentData,
        );
        return (
          <TechnicalAssessmentResults
            phase={currentPhase}
            data={technicalAssessmentData}
          />
        );
    }
  };

  const renderButtonText = (text: string) => {
    if (text === STATEMENT_BUTTON_TEXT) {
      return (
        <p className="text-sm font-bold text-[#090909]">
          {Object.values(dynamicValues).join(" ")}
        </p>
      );
    }
    return null;
  };

  // Helper to get the cultural assessment score for the results tab
  const getCulturalAssessmentScoreForResults = () => {
    const culturalAssessmentPhase = pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT,
    );
    if (!culturalAssessmentPhase) return 0;
    const data = getDataForPhase(culturalAssessmentPhase.id);
    const result = data?.custom_fields?.assistant_response?.assesment_result;
    if (!result) return 0;

    return getCulturalAssessmentScore(result as CulturalAssessmentResultType);
  };

  const getSoftSkillsScore = () => {
    const offerSentPhase = pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.OFFER_SENT,
    );
    if (!offerSentPhase) return 0;
    const data = getDataForPhase(offerSentPhase.id);
    if (!data) return 0;
    const skillsScore = calculateScore(data.custom_fields.skills);
    const responsibilitiesScore = calculateScore(
      data.custom_fields.responsibilities,
    );
    const overallScore = (skillsScore + responsibilitiesScore) / 2;
    return overallScore;
  };

  const getTechnicalAssessmentScoreForResults = () => {
    const technicalAssessmentPhase = pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.TECHNICAL_ASSESSMENT,
    );
    if (!technicalAssessmentPhase) return 0;
    const data = getDataForPhase(technicalAssessmentPhase.id);
    const result = data?.custom_fields?.assistant_response?.assesment_result;
    if (!result) return 0;
    return getTechnicalAssessmentScore(result as TechnicalAssessmentResult);
  };

  const getSoftSkillsStatus = (): "completed" | "pending" => {
    const offerSentPhase = pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.OFFER_SENT,
    );
    if (!offerSentPhase) return "pending";
    const data = getDataForPhase(offerSentPhase.id);
    if (!data) return "pending";
    const hasCustomFields = Object.keys(data?.custom_fields).length > 0;
    if (hasCustomFields) return "completed";
    return "pending";
  };

  const getCulturalAssessmentStatus = (): "completed" | "pending" => {
    const culturalAssessmentPhase = pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT,
    );
    if (!culturalAssessmentPhase) return "pending";
    const data = getDataForPhase(culturalAssessmentPhase.id);
    if (!data) return "pending";
    const hasCustomFields = Object.keys(data?.custom_fields).length > 0;
    if (hasCustomFields) return "completed";
    return "pending";
  };

  const getTechnicalAssessmentStatus = (): "completed" | "pending" => {
    const technicalAssessmentPhase = pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.TECHNICAL_ASSESSMENT,
    );
    if (!technicalAssessmentPhase) return "pending";
    const data = getDataForPhase(technicalAssessmentPhase.id);
    if (!data) return "pending";
    const hasCustomFields = Object.keys(data?.custom_fields).length > 0;
    if (hasCustomFields) return "completed";
    return "pending";
  };

  // this methods needs to calulate the average using:
  // - soft skills score
  // - cultural assessment score
  // - technical assessment score
  // - first interview score
  // - final interview score

  const getTotalWeightedScore = () => {
    const softSkillsScore = getSoftSkillsScore();
    const culturalAssessmentScore = getCulturalAssessmentScoreForResults();
    const technicalAssessmentScore = getTechnicalAssessmentScoreForResults();
    const firstInterview = Number(firstInterviewScore) || 0;
    const finalInterview = Number(finalInterviewScore) || 0;
    const totalWeightedScore =
      (softSkillsScore +
        culturalAssessmentScore +
        technicalAssessmentScore +
        firstInterview +
        finalInterview) /
      5;
    return totalWeightedScore;
  };

  const resultsPhases: PhaseData[] = [
    {
      id: "revision-inicial",
      name: "Revisión inicial",
      score: getSoftSkillsScore(),
      maxScore: 5,
      status: getSoftSkillsStatus(),
      component: renderSoftSkillsResults(),
      details: {
        description: "Evaluación automática del perfil del candidato",
        completedDate: "15 de Mayo, 2024",
        duration: "Automático",
        evaluator: "Sistema automático",
        notes: "El candidato cumple con la mayoría de los requisitos técnicos.",
      },
    },
    {
      id: "assessment-fit-cultural",
      name: "Assessment Fit cultural",
      score: getCulturalAssessmentScoreForResults(),
      maxScore: 5,
      status: getCulturalAssessmentStatus(),
      component: renderCulturalAssessmentResults(),
      details: {
        description: "Evaluación de compatibilidad cultural con la empresa",
        completedDate: "18 de Mayo, 2024",
        duration: "45 minutos",
        evaluator: "María González - HR",
        notes: "Buena actitud, pero necesita mejorar en trabajo en equipo.",
      },
    },
    {
      id: "primer-entrevista",
      name: "Primer entrevista",
      score: Number(firstInterviewScore) || 0,
      maxScore: 5,
      status:
        firstInterviewScore !== undefined && firstInterviewScore !== null
          ? "completed"
          : "pending",
      details: {
        description: "Entrevista inicial con el equipo de recursos humanos",
        completedDate: "22 de Mayo, 2024",
        duration: "60 minutos",
        evaluator: "Carlos Ruiz - HR Manager",
        notes: firstInterviewFeedback || "",
      },
    },
    {
      id: "assessment-tecnico",
      name: "Assessment Técnico",
      status: getTechnicalAssessmentStatus(),
      maxScore: 5,
      score: getTechnicalAssessmentScoreForResults(),
      component: renderTechnicalAssessmentResults(),
    },
    {
      id: "entrevista-final",
      name: "Entrevista final",
      status:
        finalInterviewScore !== undefined && finalInterviewScore !== null
          ? "completed"
          : "pending",
      maxScore: 5,
      score: Number(finalInterviewScore) || 0,
      details: {
        description: "Entrevista final con el equipo de recursos humanos",
        completedDate: "22 de Mayo, 2024",
        duration: "60 minutos",
        evaluator: "Carlos Ruiz - HR Manager",
        notes: finalInterviewFeedback || "",
      },
    },
  ];

  const filteredPhases =
    position?.flow_type === PositionConfigurationFlowTypes.LOW_PROFILE_FLOW
      ? resultsPhases.filter(
          (phase) =>
            phase.id !== "assessment-tecnico" &&
            phase.id !== "primer-entrevista",
        )
      : resultsPhases;

  return (
    <Dialog modal open={open} onOpenChange={handleOpenChange}>
      <DialogTitle className="hidden">{i18n.candidateDetails}</DialogTitle>
      <DialogDescription className="hidden">
        {i18n.candidateDetails}
      </DialogDescription>
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="flex max-h-[80vh] min-h-[80vh] max-w-[1350px]"
      >
        <div className="flex flex-col border-r-4">
          <div className="flex flex-col gap-2 pt-2">
            <div className="mb-2 flex gap-4">
              <div className="flex flex-col items-center justify-center gap-1.5">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarUrl} alt="Profile picture" />
                  <AvatarFallback>{candidateName?.charAt(0)}</AvatarFallback>
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
          <Tabs
            defaultValue={showCandidateDetails?.defaultTab || "about"}
            className="flex h-full w-full max-w-[540px] flex-col items-center justify-start overflow-hidden pr-10"
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
                value="comments"
              >
                {i18n.commentsTabTitle}
              </TabsTrigger>
              {/* <TabsTrigger
                className="border-spacing-4 rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
                value="history"
              >
                {i18n.historyTabTitle}
              </TabsTrigger> */}
              <TabsTrigger
                className="border-spacing-4 rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
                value="results"
              >
                {i18n.resultsTabTitle}
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="about"
              className="h-fit w-full max-w-screen-lg overflow-y-auto text-clip"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {i18n.contactLabel}:
                  </span>
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
              {/* <div className="h-[1px] w-full bg-gray-200"></div> */}
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
                  {aspectsNotDemostrated}
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
                    <Text
                      className="mb-8 text-sm text-muted-foreground"
                      type="p"
                    >
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
                {hiringProcess?.profile.experience?.map((experience, idx) => {
                  return (
                    <div className="mb-4 flex items-center gap-4" key={idx}>
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={experience.company_logo_url}
                          alt="Profile picture"
                        />
                        <AvatarFallback>
                          {experience.company.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <Text className="text-sm font-bold text-foreground">
                          {experience.company}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {experience.start_date} - {experience.end_date}
                        </Text>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="h-[1px] w-full bg-gray-200"></div>
              <div className="mt-4 flex flex-col gap-8">
                <Heading className="text-base font-bold" level={1}>
                  {i18n.educationLabel}
                </Heading>
                {hiringProcess?.profile.education?.map((education, idx) => {
                  return (
                    <div className="flex items-center gap-4" key={idx}>
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={education.institute_logo_url}
                          alt="Profile picture"
                        />
                        <AvatarFallback>
                          {education.title.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <Text className="text-sm font-bold text-foreground">
                          {education.title}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {education.description}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {education.start_year} - {education.end_year}
                        </Text>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent
              value="comments"
              className="max-h-[70vh] w-full min-w-[410px] max-w-screen-lg overflow-y-auto"
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
                  position={selectedPosition}
                  stakeHolders={stakeHolders}
                  pipeId={pipe.id}
                  card={card}
                />
              </div>
            </TabsContent>
            {/* <TabsContent
              value="history"
              className="max-h-[70vh] w-full min-w-[410px] max-w-screen-lg overflow-y-auto"
            >
              <PhaseHistory dictionary={dictionary} pipe={pipe} card={card} />
            </TabsContent> */}
            <TabsContent
              style={{ scrollbarGutter: "stable" }}
              value="results"
              className="max-h-[70vh] w-full min-w-[410px] max-w-screen-lg overflow-y-auto"
            >
              <ResultsTabContent
                phases={filteredPhases}
                totalWeightedScore={getTotalWeightedScore()}
                maxTotalScore={5}
                candidateName={candidateName}
              />
            </TabsContent>
          </Tabs>
        </div>

        {currentPhase &&
          currentPhase.phase.phase_classification === "INFORMATIVE" && (
            <div className="max-h-[75vh] w-[650px] max-w-[650px] overflow-auto">
              {currentPhase.interviewerData?.sections.map((section) => {
                return (
                  <div key={section.title} className="flex flex-col gap-2">
                    <Heading className="text-base font-bold" level={2}>
                      {currentPhase.groupName}
                    </Heading>
                    <Heading className="text-sm font-bold" level={2}>
                      {section.title}
                    </Heading>
                    <Text className="text-sm text-[#090909]">
                      {section.subtitle}
                    </Text>
                    <Text className="text-sm text-[#090909]">
                      {section.description}
                    </Text>
                    {renderButtonText(section.button_text)}
                  </div>
                );
              })}
            </div>
          )}
        {currentPhase &&
          currentPhase.phase.phase_classification === "CALL_TO_ACTION" && (
            <>
              <div className="flex max-h-[75vh] w-full max-w-[550px] flex-col gap-4 overflow-auto">
                {renderCallToActionContent(currentPhase.phase.name)}
              </div>
              <div className="flex w-full flex-col gap-4">
                {!isPending && publicFormUrl && (
                  <iframe
                    className="h-full w-full"
                    src={publicFormUrl}
                  ></iframe>
                )}
              </div>
            </>
          )}
      </DialogContent>
    </Dialog>
  );
};
/**
 *     <div className="max-h-[75vh] w-[410px] max-w-[410px] overflow-auto">
          <div className="flex flex-col gap-4">
            <SoftSkillsResults
              data={hiringProcess?.phases}
              position={position}
            />
          </div>
        </div>
        <div className="max-h-[75vh] w-[540px] overflow-hidden">
          {!isPending && publicFormUrl && (
            <iframe className="h-full w-full" src={publicFormUrl}></iframe>
          )}
          {/* <div className="flex flex-col gap-4">
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
          </div> }
        </div>
 */
