"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Download, Mail, Phone } from "lucide-react";
import { Linkedin } from "@/icons";
import {
  CulturalAssessmentResultType,
  EvaluationMetric,
  PHASE_NAMES,
  PhaseData,
  PositionConfigurationFlowTypes,
} from "@/types";
import { EvaluationMetrics } from "./EvaluationMetrics";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useUsers } from "@/hooks/use-users";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useBusinesses } from "@/hooks/use-businesses";
import { useOpenPositions } from "@/hooks/use-open-positions";
import {
  calculateSalaryRangeScore,
  calculateSalaryScore,
  calculateScore,
  findPhaseByName,
  formatDate,
  getCulturalAssessmentScore,
  getScoreColor,
  getTechnicalAssessmentScore,
  timeAgo,
} from "@/lib/utils";
import { Dictionary } from "@/types/i18n";
import { usePipefyCard } from "@/hooks/use-pipefy-card";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import { PipefyFieldValues } from "@/types/pipefy";
import { CANDIDATE_PHONE_FIELD_ID } from "@/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { toast } from "@/hooks/use-toast";
import {
  TechnicalAssessmentResult,
  TechnicalAssessmentResults,
} from "../CandidateDetailsDialog/TechnicalAssessmentResults";
import { QualitativeEvaluation } from "./QualitativeEvaluation";
import { ExperienceAndEducation } from "./ExperienceAndEducation";
import ResultsTabContent from "../CandidateDetailsDialog/ResultsTabContent";
import { CulturalAssessmentResults } from "../CandidateDetailsDialog/CulturalAssessmentResults";
import { SoftSkillsResults } from "../CandidateDetailsDialog/SoftSkillsResults";
import Link from "next/link";
import html2pdf from "html2pdf.js";

export const CandidateProfile = ({
  hiringId,
  dictionary,
}: {
  hiringId: string;
  dictionary: Dictionary;
}) => {
  const [isEmailTooltipOpen, setEmailTooltipOpen] = useState(false);
  const [isPhoneTooltipOpen, setPhoneTooltipOpen] = useState(false);
  const [isLinkedinTooltipOpen, setLinkedinTooltipOpen] = useState(false);
  // get the position id from the url
  const params = useParams<{ id: string }>();
  const { id } = params;
  // get the business id from the url
  const searchParams = useSearchParams();
  const businessParam = searchParams.get("business_id");

  // get the root business
  const { rootBusiness } = useBusinesses();
  // get the current user
  const { currentUser } = useCurrentUser();
  // get the users
  const { users } = useUsers({
    businessId: rootBusiness?._id,
    all: true,
  });
  // get the local user
  const localUser = useMemo(() => {
    return users.find((user) => user.email === currentUser?.email);
  }, [users, currentUser]);
  // get the positions
  const { positions } = useOpenPositions({
    userId: localUser?._id,
    businessId: businessParam || rootBusiness?._id,
  });
  // get the selected position
  const selectedPosition = useMemo(() => {
    return positions.find((position) => position._id === id);
  }, [positions, id]);

  const selectedHiringProcess = useMemo(() => {
    return selectedPosition?.hiring_processes.find(
      (hiringProcess) => hiringProcess._id === hiringId,
    );
  }, [selectedPosition, hiringId]);

  const { card } = usePipefyCard({
    cardId: selectedHiringProcess?.card_id,
  });

  const fieldMap = PipefyBoardTransformer.mapFields(card?.fields || []);

  const getDataForPhase = (phaseId: string) => {
    return selectedHiringProcess?.phases[phaseId];
  };
  const getSoftSkillsScore = () => {
    const offerSentPhase = card?.pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.OFFER_SENT,
    );
    if (!offerSentPhase) return 0;
    const data = getDataForPhase(offerSentPhase.id);
    if (!data) return 0;
    const skillsScore = calculateScore(data.custom_fields.skills);
    const responsibilitiesScore = calculateScore(
      data.custom_fields.responsibilities,
    );
    const expectedSalary = data.custom_fields.expected_salary;
    const seniorityScore = data.custom_fields.has_seniority ? 5 : 1;
    let salaryScore = 5;
    if (selectedPosition?.salary?.salary) {
      salaryScore = calculateSalaryScore(
        Number(expectedSalary),
        Number(selectedPosition?.salary?.salary),
      );
    }
    if (selectedPosition?.salary?.salary_range) {
      salaryScore = calculateSalaryRangeScore(
        {
          min: Number(selectedPosition?.salary?.salary_range.min),
          max: Number(selectedPosition?.salary?.salary_range.max),
        },
        Number(expectedSalary),
      );
    }
    const overallScore =
      (skillsScore + responsibilitiesScore + salaryScore + seniorityScore) / 4;
    return overallScore;
  };

  const getSoftSkillsStatus = (): "completed" | "pending" => {
    const offerSentPhase = card?.pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.OFFER_SENT,
    );
    if (!offerSentPhase) return "pending";
    const data = getDataForPhase(offerSentPhase.id);
    if (!data) return "pending";
    const hasCustomFields = Object.keys(data?.custom_fields).length > 0;
    if (hasCustomFields) return "completed";
    return "pending";
  };

  const getCulturalAssessmentScoreForResults = () => {
    const culturalAssessmentPhase = card?.pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT,
    );
    if (!culturalAssessmentPhase) return 0;
    const data = getDataForPhase(culturalAssessmentPhase.id);
    const result = data?.custom_fields?.assistant_response?.assesment_result;
    if (!result) return 0;

    return getCulturalAssessmentScore(result as CulturalAssessmentResultType);
  };
  const getCulturalAssessmentStatus = (): "completed" | "pending" => {
    const culturalAssessmentPhase = card?.pipe.phases.find(
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
    const technicalAssessmentPhase = card?.pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.TECHNICAL_ASSESSMENT,
    );
    if (!technicalAssessmentPhase) return "pending";
    const data = getDataForPhase(technicalAssessmentPhase.id);
    if (!data) return "pending";
    const hasCustomFields = Object.keys(data?.custom_fields).length > 0;
    if (hasCustomFields) return "completed";
    return "pending";
  };
  const exportToPDF = () => {
    const element = document.getElementById("candidate-profile");
    if (!element) return;

    html2pdf()
      .set({
        margin: [0.5, 0.5, 0.5, 0.5], // Add some margin to prevent content from being cut off
        filename: `${candidateName?.replace(/\s+/g, "-")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: [25, 20 * 4], orientation: "portrait" }, // A4 width with much larger height
      })
      .from(element)
      .save();
  };

  const getTechnicalAssessmentScoreForResults = () => {
    const technicalAssessmentPhase = card?.pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.TECHNICAL_ASSESSMENT,
    );
    if (!technicalAssessmentPhase) return 0;
    const data = getDataForPhase(technicalAssessmentPhase.id);
    const result = data?.custom_fields?.assistant_response?.assesment_result;
    if (!result) return 0;
    return getTechnicalAssessmentScore(result as TechnicalAssessmentResult);
  };

  const getTotalWeightedScore = () => {
    // Obtener los pesos configurados del negocio
    const evaluationWeights =
      selectedPosition?.business_configuration?.evaluation_weights[
        selectedPosition.flow_type
      ];

    // Si no hay pesos configurados, usar el cálculo original (promedio simple)
    if (!evaluationWeights || evaluationWeights.length === 0) {
      const scores: number[] = [];

      if (getSoftSkillsStatus() === "completed") {
        scores.push(getSoftSkillsScore());
      }

      if (getCulturalAssessmentStatus() === "completed") {
        scores.push(getCulturalAssessmentScoreForResults());
      }

      const isLowProfile =
        selectedPosition?.flow_type ===
        PositionConfigurationFlowTypes.LOW_PROFILE_FLOW;

      if (!isLowProfile) {
        if (getTechnicalAssessmentStatus() === "completed") {
          scores.push(getTechnicalAssessmentScoreForResults());
        }

        if (firstInterviewScore != null && firstInterviewScore.trim() !== "") {
          const score = Number(firstInterviewScore);
          if (!isNaN(score)) {
            scores.push(score);
          }
        }
      }

      if (finalInterviewScore != null && finalInterviewScore.trim() !== "") {
        const score = Number(finalInterviewScore);
        if (!isNaN(score)) {
          scores.push(score);
        }
      }

      if (scores.length === 0) {
        return 0;
      }

      const totalScore = scores.reduce((acc, score) => acc + score, 0);
      return totalScore / scores.length;
    }

    // Calcular promedio ponderado basado en los pesos configurados
    let totalWeightedScore = 0;
    let totalWeight = 0;

    // Mapeo de criterios a funciones de score
    const scoreMappings = {
      TALENT_DNA: () =>
        getSoftSkillsStatus() === "completed" ? getSoftSkillsScore() : null,
      CHALLENGES_AND_BEHAVIORS_RESULT: () =>
        getCulturalAssessmentStatus() === "completed"
          ? getCulturalAssessmentScoreForResults()
          : null,
      FIRST_INTERVIEW: () => {
        if (firstInterviewScore != null && firstInterviewScore.trim() !== "") {
          const score = Number(firstInterviewScore);
          return !isNaN(score) ? score : null;
        }
        return null;
      },
      BUSINESS_CASE_RESULT: () => {
        const isLowProfile =
          selectedPosition?.flow_type ===
          PositionConfigurationFlowTypes.LOW_PROFILE_FLOW;
        if (!isLowProfile && getTechnicalAssessmentStatus() === "completed") {
          return getTechnicalAssessmentScoreForResults();
        }
        return null;
      },
      FINAL_INTERVIEW: () => {
        if (finalInterviewScore != null && finalInterviewScore.trim() !== "") {
          const score = Number(finalInterviewScore);
          return !isNaN(score) ? score : null;
        }
        return null;
      },
    };

    // Calcular score ponderado para cada criterio
    evaluationWeights.forEach((weight) => {
      const getScore = scoreMappings[weight.criterion_type];
      if (getScore) {
        const score = getScore();
        if (score !== null) {
          totalWeightedScore += score * (weight.weight / 100);
          totalWeight += weight.weight / 100;
        }
      }
    });

    // Si no hay scores válidos, retornar 0
    if (totalWeight === 0) {
      return 0;
    }

    // Retornar el promedio ponderado
    return totalWeightedScore / totalWeight;
  };
  const currentPhase = findPhaseByName(
    card?.current_phase.name || "",
    // PHASE_NAMES.FINAL_INTERVIEW_SCHEDULED,
    selectedPosition?.position_flow,
  );
  const renderCulturalAssessmentResults = () => {
    const culturalAssessmentPhase = card?.pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT,
    );
    if (!culturalAssessmentPhase) return null;
    const data = getDataForPhase(culturalAssessmentPhase.id);
    return (
      <CulturalAssessmentResults
        fullWidth={true}
        data={data}
        phase={currentPhase}
      />
    );
  };

  const renderTechnicalAssessmentResults = () => {
    const technicalAssessmentPhase = card?.pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.TECHNICAL_ASSESSMENT,
    );
    if (!technicalAssessmentPhase) return null;

    return (
      <TechnicalAssessmentResults
        fullWidth={true}
        data={getDataForPhase(technicalAssessmentPhase.id)}
        phase={currentPhase}
      />
    );
  };

  const renderSoftSkillsResults = () => {
    const offerSentPhase = card?.pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.OFFER_SENT,
    );
    if (!offerSentPhase) return null;
    const initialFilterPhase = findPhaseByName(
      PHASE_NAMES.INITIAL_FILTER,
      selectedPosition?.position_flow,
    );

    return (
      <div className="flex flex-col gap-4">
        <SoftSkillsResults
          fullWidth={true}
          data={getDataForPhase(offerSentPhase.id)}
          position={selectedPosition}
          phase={initialFilterPhase}
        />
      </div>
    );
  };

  if (!selectedHiringProcess || !card) return null;
  console.log(
    "%c[Debug] data",
    "background-color: teal; font-size: 20px; color: white",
    { selectedHiringProcess, selectedPosition, card },
  );

  const { profile } = selectedHiringProcess;
  const {
    name,
    avatar,
    current_company_name,
    country_code,
    city,
    source,
    url: linkedinUrl,
  } = profile;

  const candidatePhone = card.fields.find(
    (field) => field.name === CANDIDATE_PHONE_FIELD_ID,
  )?.value;
  const email = fieldMap[PipefyFieldValues.CandidateEmail] || "";
  const firstInterviewScore = fieldMap[PipefyFieldValues.FirstInterviewScore];
  const firstInterviewFeedback =
    fieldMap[PipefyFieldValues.FirstInterviewFeedback];
  const finalInterviewFeedback =
    fieldMap[PipefyFieldValues.FinalInterviewFeedback];
  const finalInterviewScore = fieldMap[PipefyFieldValues.FinalInterviewScore];

  const aspectsNotDemostrated =
    fieldMap[PipefyFieldValues.AspectsNotDemostrated];
  const recomendation = fieldMap[PipefyFieldValues.Recomendation];
  const positionMatch = fieldMap[PipefyFieldValues.PositionMatch];
  const candidateName = fieldMap[PipefyFieldValues.CandidateName];
  const resultsPhases: PhaseData[] = [
    {
      id: "adn-del-talento",
      name: "ADN del Talento",
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
      id: "resultado-retos-y-comportamientos",
      name: "Resultado Retos y comportamientos",
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
      id: "resultado-caso-de-negocio",
      name: "Resultado Caso de negocio",
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
    selectedPosition?.flow_type ===
    PositionConfigurationFlowTypes.LOW_PROFILE_FLOW
      ? resultsPhases.filter(
          (phase) =>
            phase.id !== "assessment-tecnico" &&
            phase.id !== "primer-entrevista",
        )
      : resultsPhases;

  const evaluationMetrics: EvaluationMetric[] = [
    {
      id: "1",
      title: "ADN del Talento",
      score: getSoftSkillsScore(),
      icon: "user",
    },
    {
      id: "2",
      title: "Retos y Comportamientos",
      score: getCulturalAssessmentScoreForResults(),
      icon: "target",
    },
    {
      id: "3",
      title: "Primera Entrevista",
      icon: "message-circle",
      score: Number(firstInterviewScore) || 0,
    },
    {
      id: "4",
      title: "Caso de Negocio",
      score: getTechnicalAssessmentScoreForResults(),
      icon: "bar-chart",
    },
    {
      id: "5",
      title: "Entrevista Final",
      icon: "clock",
      score: Number(finalInterviewScore) || 0,
    },
  ];
  return (
    <TooltipProvider>
      <div className="flex flex-col">
        {/* Sticky Navigation to results */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
          <div className="mx-auto px-6 py-4">
            <nav className="flex items-center justify-center">
              <div className="flex items-center space-x-1">
                {resultsPhases.map((phase) => (
                  <Link
                    key={phase.id}
                    href={`#${phase.id}`}
                    className="group relative flex items-center"
                  >
                    <div className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-talent-green-500 focus:ring-offset-2">
                      <span className="hidden sm:inline">{phase.name}</span>
                      <span className="sm:hidden">
                        {phase.name.split(" ")[0]}
                      </span>
                    </div>
                    {/* Active indicator */}
                    <div className="absolute -bottom-4 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-talent-green-500 transition-all duration-200 group-hover:w-full"></div>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
        <div id="candidate-profile" className="mx-auto min-h-screen w-full p-6">
          <Card className="w-full">
            <CardContent className="scroll-mt-20 p-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <Avatar className="h-24 w-24 bg-talent-green-500 text-2xl font-bold text-white">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback className="bg-talent-green-500 text-2xl font-bold text-white">
                    LS
                  </AvatarFallback>
                </Avatar>

                {/* Candidate Information */}
                <div className="flex-1 space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                  <p className="text-gray-600">
                    Candidato para el rol de {selectedPosition?.role}
                  </p>
                  <p className="font-medium text-talent-green-500">
                    {current_company_name}
                  </p>
                  <p className="text-gray-600">
                    {city}, {country_code}
                  </p>
                  <p className="text-gray-600">
                    Origen: {source || "Talent Connect"}
                  </p>
                  <p className="text-gray-600">
                    Inicio del proceso:{" "}
                    {formatDate(
                      new Date(selectedHiringProcess.created_at).toString(),
                    )}{" "}
                    (
                    {timeAgo(
                      Date.now() -
                        new Date(selectedHiringProcess.created_at).getTime(),
                      dictionary,
                    )}
                    )
                  </p>
                </div>

                {/* Contact Actions and Score */}
                <div className="flex flex-col items-end gap-4">
                  {/* Contact Buttons */}
                  <div className="flex gap-2">
                    {linkedinUrl && (
                      <Tooltip
                        open={isLinkedinTooltipOpen}
                        onOpenChange={setLinkedinTooltipOpen}
                      >
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() =>
                              setLinkedinTooltipOpen((open) => !open)
                            }
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 bg-transparent"
                          >
                            <Linkedin />
                            LinkedIn
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="flex items-center gap-2 text-sm font-normal"
                          onClick={() => setLinkedinTooltipOpen(false)}
                        >
                          {linkedinUrl}
                          <Copy
                            onClick={() => {
                              navigator.clipboard.writeText(linkedinUrl);
                              toast({
                                title: "LinkedIn copiado",
                                description: "LinkedIn copiado al portapapeles",
                              });
                              setLinkedinTooltipOpen(false);
                            }}
                            className="h-4 w-4 cursor-pointer hover:text-talent-green-500"
                          />
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {/* Refactored: Email Tooltip only onClick */}
                    {email && (
                      <Tooltip
                        open={isEmailTooltipOpen}
                        onOpenChange={setEmailTooltipOpen}
                      >
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setEmailTooltipOpen((open) => !open)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 bg-transparent"
                          >
                            <Mail className="h-4 w-4" />
                            Email
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="flex max-w-[260px] items-center gap-2 text-sm font-normal"
                          onClick={() => setEmailTooltipOpen(false)}
                        >
                          {email}{" "}
                          <Copy
                            onClick={() => {
                              navigator.clipboard.writeText(email);
                              toast({
                                title: "Correo copiado",
                                description: "Correo copiado al portapapeles",
                              });
                              setEmailTooltipOpen(false);
                            }}
                            className="h-4 w-4 cursor-pointer hover:text-talent-green-500"
                          />
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {/* Refactored: Phone Tooltip only onClick */}
                    {candidatePhone && (
                      <Tooltip
                        open={isPhoneTooltipOpen}
                        onOpenChange={setPhoneTooltipOpen}
                      >
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => setPhoneTooltipOpen((open) => !open)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 bg-transparent"
                          >
                            <Phone className="h-4 w-4" />
                            Teléfono
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="flex max-w-[260px] items-center gap-2 text-sm font-normal"
                          onClick={() => setPhoneTooltipOpen(false)}
                        >
                          {candidatePhone}{" "}
                          <Copy
                            onClick={() => {
                              navigator.clipboard.writeText(candidatePhone);
                              toast({
                                title: "Teléfono copiado",
                                description: "Teléfono copiado al portapapeles",
                              });
                              setPhoneTooltipOpen(false);
                            }}
                            className="h-4 w-4 cursor-pointer hover:text-talent-green-500"
                          />
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Button
                      onClick={exportToPDF}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download />
                    </Button>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div
                      className={`text-5xl font-bold text-gray-900 ${getScoreColor(
                        getTotalWeightedScore(),
                        5,
                      )}`}
                    >
                      {getTotalWeightedScore()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Resultado ponderado
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Evaluation Metrics */}
          <div className="mt-8">
            <EvaluationMetrics metrics={evaluationMetrics} />
          </div>
          {/* Qualitative Evaluation*/}
          <div className="mt-8">
            <QualitativeEvaluation
              aspectsNotDemostrated={aspectsNotDemostrated}
              recomendation={recomendation}
              positionMatch={positionMatch}
            />
            <ExperienceAndEducation hiringProcess={selectedHiringProcess} />
          </div>
          <div className="mt-8">
            <ResultsTabContent
              fullWidth={true}
              phases={filteredPhases}
              totalWeightedScore={getTotalWeightedScore()}
              maxTotalScore={5}
              candidateName={candidateName}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
