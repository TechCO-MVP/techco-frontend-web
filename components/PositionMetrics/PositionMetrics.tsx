"use client";
import { useBusinesses } from "@/hooks/use-businesses";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useOpenPositions } from "@/hooks/use-open-positions";
import { useUsers } from "@/hooks/use-users";
import { Dictionary } from "@/types/i18n";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { FC, useMemo, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { Locale } from "@/i18n-config";
import { Text } from "../Typography/Text";
import {
  calculateSalaryRangeScore,
  calculateSalaryScore,
  calculateScore,
  calculateTime,
  formatDate,
  getCulturalAssessmentScore,
  getTechnicalAssessmentScore,
  mapHiringToDraftPosition,
  timeAgo,
} from "@/lib/utils";
import { PositionSheet } from "../CreatePosition/PositionSheet";
import { usePipefyPipe } from "@/hooks/use-pipefy-pipe";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import { PipefyFieldValues } from "@/types/pipefy";
import {
  CulturalAssessmentResultType,
  EvaluationWeight,
  HiringProcess,
  PHASE_NAMES,
  PositionConfigurationFlowTypes,
  TechnicalAssesmentResult,
} from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { QUICK_FILTER_MAP, QUICK_FILTERS } from "@/constants";
import { Checkbox } from "../ui/checkbox";
import { PhasesChart, PhasesStage } from "./PhasesChart";

type PositionMetricsProps = {
  dictionary: Dictionary;
};
export const PositionMetrics: FC<PositionMetricsProps> = ({ dictionary }) => {
  const { positionDetailsPage: i18n } = dictionary;
  const [selectedQuickFilter, setSelectedQuickFilter] =
    useState("ADN del Talento");
  const [selectedPhases, setSelectedPhases] = useState<string[]>([]);
  const params = useParams<{ id: string; lang: Locale }>();
  const { id, lang } = params;
  // get the business id from the url
  const searchParams = useSearchParams();
  const businessParam = searchParams.get("business_id");

  // get the root business
  const { rootBusiness, businesses } = useBusinesses();
  // get the current user
  const { currentUser } = useCurrentUser();

  const currentBusiness = useMemo(() => {
    return businesses.find((business) => business._id === businessParam);
  }, [businesses, businessParam]);
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

  const { data: pipeData } = usePipefyPipe({
    pipeId: selectedPosition?.pipe_id || undefined,
  });

  const allCards = useMemo(() => {
    return pipeData?.pipe.phases.flatMap((phase) => phase.cards.nodes) ?? [];
  }, [pipeData, selectedPosition]);

  const getFieldValue = useMemo(() => {
    return (cardId: string, field: PipefyFieldValues): string => {
      const card = allCards.find((card) => card.id === cardId);
      const fieldMap = PipefyBoardTransformer.mapFields(card?.fields || []);
      return fieldMap[field] || "";
    };
  }, [allCards]);

  const getPhaseName = (name: string) => {
    switch (name) {
      case "Oferta enviada":
        return "Candidatos interesados";
      case "Candidatos sugeridos":
        return "Coincidencias iniciales";
      case "Filtro inicial":
        return "No match ADN del talento";
      case "Assessment fit Cultural":
        return "Match en ADN del talento";
      case "Resultado Fit Cultural":
        return "Resultado Retos y Comportamientos";
      case "Assessment técnico":
        return "Match en Retos y Comportamientos";
      case "Resultado Assessment técnico":
        return "Resultado Caso de Negocio";
      default:
        return name;
    }
  };

  const getCurrentPhase = useMemo(() => {
    return (cardId: string): string => {
      const card = allCards.find((card) => card.id === cardId);
      return getPhaseName(card?.current_phase.name || "");
    };
  }, [allCards]);

  const getCulturalAssessmentScoreForProcess = useMemo(() => {
    return (process: HiringProcess): number => {
      const culturalAssessmentPhase = pipeData?.pipe.phases.find(
        (phase) => phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT,
      );
      if (!culturalAssessmentPhase) return 0;

      const phaseData = process.phases?.[culturalAssessmentPhase.id];
      if (!phaseData) return 0;

      const result =
        phaseData?.custom_fields?.assistant_response?.assesment_result;
      if (!result) return 0;

      return getCulturalAssessmentScore(result as CulturalAssessmentResultType);
    };
  }, [pipeData, selectedPosition]);

  const getSoftSkillsScoreForProcess = useMemo(() => {
    return (process: HiringProcess): number => {
      const offerSentPhase = pipeData?.pipe.phases.find(
        (phase) => phase.name === PHASE_NAMES.OFFER_SENT,
      );
      if (!offerSentPhase) return 0;

      const phaseData = process.phases?.[offerSentPhase.id];
      if (!phaseData) return 0;

      const skillsScore = calculateScore(phaseData.custom_fields?.skills);
      const responsibilitiesScore = calculateScore(
        phaseData.custom_fields?.responsibilities,
      );
      const expectedSalary = phaseData.custom_fields?.expected_salary;
      const seniorityScore = phaseData.custom_fields?.has_seniority ? 5 : 1;
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
        (skillsScore + responsibilitiesScore + salaryScore + seniorityScore) /
        4;
      return overallScore;
    };
  }, [pipeData, selectedPosition]);

  const getTechnicalAssessmentScoreForProcess = useMemo(() => {
    return (process: HiringProcess): number => {
      const technicalAssessmentPhase = pipeData?.pipe.phases.find(
        (phase) => phase.name === PHASE_NAMES.TECHNICAL_ASSESSMENT,
      );
      if (!technicalAssessmentPhase) return 0;

      const phaseData = process.phases?.[technicalAssessmentPhase.id];
      if (!phaseData) return 0;

      const result =
        phaseData?.custom_fields?.assistant_response?.assesment_result;
      if (!result) return 0;

      return getTechnicalAssessmentScore(result as TechnicalAssesmentResult);
    };
  }, [pipeData, selectedPosition]);

  const getTotalWeightedScoreForProcess = useMemo(() => {
    return (process: HiringProcess): number => {
      // Obtener los pesos configurados del negocio
      const evaluationWeights =
        selectedPosition?.business_configuration?.evaluation_weights[
          selectedPosition.flow_type
        ];

      // Si no hay pesos configurados, usar el cálculo original (promedio simple)
      if (!evaluationWeights || evaluationWeights.length === 0) {
        const scores: number[] = [];

        const softSkillsScore = getSoftSkillsScoreForProcess(process);
        if (softSkillsScore > 0) {
          scores.push(softSkillsScore);
        }

        const culturalScore = getCulturalAssessmentScoreForProcess(process);
        if (culturalScore > 0) {
          scores.push(culturalScore);
        }

        const isLowProfile =
          selectedPosition?.flow_type ===
          PositionConfigurationFlowTypes.LOW_PROFILE_FLOW;

        if (!isLowProfile) {
          const technicalScore = getTechnicalAssessmentScoreForProcess(process);
          if (technicalScore > 0) {
            scores.push(technicalScore);
          }

          const firstInterviewScore = getFieldValue(
            process.card_id,
            PipefyFieldValues.FirstInterviewScore,
          );
          if (firstInterviewScore && firstInterviewScore.trim() !== "") {
            const score = Number(firstInterviewScore);
            if (!isNaN(score)) {
              scores.push(score);
            }
          }
        }

        const finalInterviewScore = getFieldValue(
          process.card_id,
          PipefyFieldValues.FinalInterviewScore,
        );
        if (finalInterviewScore && finalInterviewScore.trim() !== "") {
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
        TALENT_DNA: () => {
          const score = getSoftSkillsScoreForProcess(process);
          return score > 0 ? score : null;
        },
        CHALLENGES_AND_BEHAVIORS_RESULT: () => {
          const score = getCulturalAssessmentScoreForProcess(process);
          return score > 0 ? score : null;
        },
        FIRST_INTERVIEW: () => {
          const firstInterviewScore = getFieldValue(
            process.card_id,
            PipefyFieldValues.FirstInterviewScore,
          );
          if (firstInterviewScore && firstInterviewScore.trim() !== "") {
            const score = Number(firstInterviewScore);
            return !isNaN(score) ? score : null;
          }
          return null;
        },
        BUSINESS_CASE_RESULT: () => {
          const isLowProfile =
            selectedPosition?.flow_type ===
            PositionConfigurationFlowTypes.LOW_PROFILE_FLOW;
          if (!isLowProfile) {
            const score = getTechnicalAssessmentScoreForProcess(process);
            return score > 0 ? score : null;
          }
          return null;
        },
        FINAL_INTERVIEW: () => {
          const finalInterviewScore = getFieldValue(
            process.card_id,
            PipefyFieldValues.FinalInterviewScore,
          );
          if (finalInterviewScore && finalInterviewScore.trim() !== "") {
            const score = Number(finalInterviewScore);
            return !isNaN(score) ? score : null;
          }
          return null;
        },
      };

      // Calcular score ponderado para cada criterio
      if (Array.isArray(evaluationWeights)) {
        evaluationWeights.forEach((weight: EvaluationWeight) => {
          const getScore =
            scoreMappings[weight.criterion_type as keyof typeof scoreMappings];
          if (getScore) {
            const score = getScore();
            if (score !== null) {
              totalWeightedScore += score * (weight.weight / 100);
              totalWeight += weight.weight / 100;
            }
          }
        });
      }

      // Si no hay scores válidos, retornar 0
      if (totalWeight === 0) {
        return 0;
      }

      // Retornar el promedio ponderado
      return totalWeightedScore / totalWeight;
    };
  }, [
    pipeData,
    selectedPosition,
    getSoftSkillsScoreForProcess,
    getCulturalAssessmentScoreForProcess,
    getTechnicalAssessmentScoreForProcess,
    getFieldValue,
  ]);

  const phaseCounts = useMemo((): PhasesStage[] => {
    if (!selectedPosition?.hiring_processes || !pipeData?.pipe.phases) {
      return [];
    }

    const phaseCounts = new Map<string, number>();

    selectedPosition.hiring_processes.forEach((process) => {
      const card = allCards.find((card) => card.id === process.card_id);
      const currentPhaseName = card?.current_phase.name || "";

      // Find which QUICK_FILTER this phase belongs to
      for (const [quickFilter, phases] of Object.entries(QUICK_FILTER_MAP)) {
        if (phases.includes(currentPhaseName)) {
          phaseCounts.set(quickFilter, (phaseCounts.get(quickFilter) || 0) + 1);
          break;
        }
      }
    });

    return QUICK_FILTERS.map((filterName) => ({
      name: filterName,
      value: phaseCounts.get(filterName) || 0,
      color: `bg-talent-green-500`,
    }));
  }, [selectedPosition?.hiring_processes, pipeData?.pipe.phases, allCards]);

  const [processesPage, setProcessesPage] = useState(1);
  const [processesPageSize, setProcessesPageSize] = useState(10);

  const filteredProcesses = useMemo(() => {
    if (!selectedPosition?.hiring_processes) return [];

    // If no phases are selected, show all processes
    if (selectedPhases.length === 0) {
      return selectedPosition.hiring_processes;
    }

    // Filter processes based on selected phases
    return selectedPosition.hiring_processes.filter((process) => {
      const currentPhase = getCurrentPhase(process.card_id);
      return selectedPhases.includes(currentPhase);
    });
  }, [selectedPosition?.hiring_processes, selectedPhases, getCurrentPhase]);

  const paginatedProcesses = useMemo(() => {
    const start = (processesPage - 1) * processesPageSize;
    return filteredProcesses.slice(start, start + processesPageSize);
  }, [filteredProcesses, processesPage, processesPageSize]);

  useEffect(() => {
    setProcessesPage(1);
  }, [filteredProcesses.length]);

  useEffect(() => {
    setSelectedPhases([]);
  }, [selectedQuickFilter]);

  console.log(
    "%c[Debug] position",
    "background-color: teal; font-size: 20px; color: white",
    { selectedPosition, pipeData, allCards },
  );

  if (!selectedPosition) return null;

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col items-start gap-2">
        <div className="mt-4 flex w-full justify-between">
          <Link
            href={`/${lang}/dashboard/positions?business_id=${businessParam || rootBusiness?._id}`}
            replace
          >
            <Button variant="ghost" className="-mx-8 text-sm">
              <ChevronLeft className="h-4 w-4" />
              {i18n.goBack}
            </Button>
          </Link>
          <PositionSheet
            business={currentBusiness}
            positionData={mapHiringToDraftPosition(selectedPosition)}
            dictionary={dictionary}
            customTrigger={
              <Button
                variant="outline"
                className="rounde-md border-talent-green-800 bg-transparent text-talent-green-800 hover:bg-talent-green-800 hover:text-white"
              >
                Ver detalles de la oferta
              </Button>
            }
          />
        </div>
        <div className="flex w-full flex-col items-start justify-between gap-1">
          <h1 className="text-xl font-bold text-primary">
            Proceso: {selectedPosition?.role}
          </h1>
          <Text className="text-muted-foreground">
            Inicio del proceso: {formatDate(selectedPosition?.created_at)} -{" "}
            {calculateTime(selectedPosition?.created_at, dictionary)} en proceso
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="mt-4 flex">
            <Select
              value={selectedQuickFilter}
              defaultValue="ADN del Talento"
              onValueChange={(value) => setSelectedQuickFilter(value)}
            >
              <SelectTrigger className="focus:ring-none focus:ring-0 md:max-w-[240px]">
                <SelectValue placeholder="Código" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {QUICK_FILTERS.map((filter, index) => (
                  <SelectItem key={index} value={filter}>
                    {filter}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <PhasesChart stages={phaseCounts} />
        </div>
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-col space-y-4">
            <span className="text-xl font-bold">
              Fases de la Etapa {selectedQuickFilter}
            </span>
            <div className="flex gap-4">
              {QUICK_FILTER_MAP[selectedQuickFilter].map((phaseName, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    className="border-talent-green-500 data-[state=checked]:bg-talent-green-500"
                    id={`quick-filter=${index + 1}`}
                    checked={selectedPhases.includes(getPhaseName(phaseName))}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPhases((prev) => [
                          ...prev,
                          getPhaseName(phaseName),
                        ]);
                      } else {
                        setSelectedPhases((prev) =>
                          prev.filter(
                            (phase) => phase !== getPhaseName(phaseName),
                          ),
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={`quick-filter=${index + 1}`}
                    className="text-sm"
                  >
                    {getPhaseName(phaseName)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-max">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Nombre</TableHead>
                  <TableHead className="whitespace-nowrap">Match</TableHead>
                  <TableHead className="whitespace-nowrap">
                    Etapa Actual
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    ADN del talento
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Retos y Comportamientos
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Primer entrevista
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Caso de negocio
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Entrevista final
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Total ponderado
                  </TableHead>
                  <TableHead className="whitespace-nowrap">
                    Tiempo en el proceso
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Fuente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProcesses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No se encontraron coincidencias
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProcesses.map((process) => (
                    <TableRow className="h-12" key={process._id}>
                      {/* Name */}
                      <TableCell className="whitespace-nowrap py-2 font-medium">
                        {process.profile.name}
                      </TableCell>
                      {/* Match */}
                      <TableCell className="whitespace-nowrap py-2">
                        {getFieldValue(
                          process.card_id,
                          PipefyFieldValues.RoleAlignment,
                        )}
                      </TableCell>
                      {/* Current Phase */}
                      <TableCell className="whitespace-nowrap py-2">
                        {getCurrentPhase(process.card_id)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap py-2">
                        {getSoftSkillsScoreForProcess(process) > 0
                          ? getSoftSkillsScoreForProcess(process).toFixed(1)
                          : "Pendiente"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-2">
                        {getCulturalAssessmentScoreForProcess(process) > 0
                          ? getCulturalAssessmentScoreForProcess(
                              process,
                            ).toFixed(1)
                          : "Pendiente"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-2">
                        {getFieldValue(
                          process.card_id,
                          PipefyFieldValues.FirstInterviewScore,
                        ) || "Pendiente"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-2">
                        {getTechnicalAssessmentScoreForProcess(process) > 0
                          ? getTechnicalAssessmentScoreForProcess(
                              process,
                            ).toFixed(1)
                          : "Pendiente"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-2">
                        {getFieldValue(
                          process.card_id,
                          PipefyFieldValues.FinalInterviewScore,
                        ) || "Pendiente"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-2">
                        {getTotalWeightedScoreForProcess(process) > 0
                          ? getTotalWeightedScoreForProcess(process).toFixed(1)
                          : "Pendiente"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-2">
                        {timeAgo(
                          new Date().getTime() -
                            new Date(process.created_at).getTime(),
                          dictionary,
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap py-2">
                        {getFieldValue(
                          process.card_id,
                          PipefyFieldValues.CandidateSource,
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div />
            <div className="flex items-center gap-2">
              <label
                htmlFor="processes-page-size"
                className="text-sm font-medium"
              >
                {dictionary.positionsPage?.paginationPageSizeLabel ||
                  "per page"}
              </label>
              <select
                id="processes-page-size"
                value={processesPageSize}
                onChange={(e) => {
                  setProcessesPageSize(Number(e.target.value));
                  setProcessesPage(1);
                }}
                className="rounded border px-2 py-1"
                aria-label={
                  dictionary.positionsPage?.paginationPageSizeLabel ||
                  "Page size"
                }
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                onClick={() => setProcessesPage((p) => Math.max(1, p - 1))}
                disabled={processesPage === 1}
                aria-label={dictionary.positionsPage?.paginationPrevious}
              >
                {dictionary.positionsPage?.paginationPrevious || "Previous"}
              </Button>
              <span>
                {dictionary.positionsPage?.paginationPage || "Page"}{" "}
                {processesPage} {dictionary.positionsPage?.paginationOf || "of"}{" "}
                {Math.ceil(filteredProcesses.length / processesPageSize)}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setProcessesPage((p) =>
                    Math.min(
                      Math.ceil(filteredProcesses.length / processesPageSize),
                      p + 1,
                    ),
                  )
                }
                disabled={
                  processesPage ===
                  Math.ceil(filteredProcesses.length / processesPageSize)
                }
                aria-label={dictionary.positionsPage?.paginationNext}
              >
                {dictionary.positionsPage?.paginationNext || "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
