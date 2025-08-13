"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getScoreColor } from "@/lib/utils";

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

interface ProcessOverviewProps {
  phases: PhaseData[];
  totalWeightedScore?: number;
  maxTotalScore?: number;
  candidateName?: string;
  fullWidth?: boolean;
}

export default function ProcessOverview({
  phases,
  totalWeightedScore = 3.15,
  maxTotalScore = 5,
  fullWidth = false,
}: ProcessOverviewProps) {
  const formatScore = (score: number, maxScore: number) => {
    return `${score.toFixed(score % 1 === 0 ? 0 : 1)} de ${maxScore}`;
  };

  const PhaseRow = ({
    phase,
    fullWidth,
  }: {
    phase: PhaseData;
    fullWidth: boolean;
  }) => {
    const getPhaseId = (phaseName: string) => {
      return phaseName.toLowerCase().replace(/\s+/g, "-");
    };

    const hasDetails =
      phase.component ||
      (phase.details && Object.keys(phase.details).length > 0);

    if (!hasDetails) {
      return (
        <div
          id={getPhaseId(phase.name)}
          className="flex scroll-mt-20 items-center justify-between border-b px-6 py-4 last:border-b-0"
        >
          <span
            className={`${fullWidth ? "text-2xl font-bold" : "font-medium"} tracking-tight ${phase.status === "pending" ? "text-gray-400" : "text-gray-900"}`}
          >
            {phase.name}
          </span>
          <div className="text-right">
            {phase.status === "pending" ? (
              <span className="text-sm text-gray-400">Pendiente</span>
            ) : phase.score !== undefined ? (
              <span
                className={`font-semibold ${getScoreColor(phase.score, phase.maxScore)}`}
              >
                {formatScore(phase.score, phase.maxScore)}
              </span>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <AccordionItem
        id={getPhaseId(phase.name)}
        value={phase.id}
        className="scroll-mt-20 border-b last:border-b-0"
        disabled={phase.status === "pending"}
      >
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex w-full items-center justify-between pr-4">
            <span
              className={`${fullWidth ? "text-2xl font-bold" : "text-lg"} text-left tracking-tight ${phase.status === "pending" ? "text-gray-400" : "text-gray-900"}`}
            >
              {phase.name}
            </span>
            <div className="text-right">
              {phase.status === "pending" ? (
                <span className="text-sm text-gray-400">Pendiente</span>
              ) : phase.score !== undefined ? (
                <span
                  className={`font-semibold ${getScoreColor(phase.score, phase.maxScore)}`}
                >
                  {formatScore(phase.score, phase.maxScore)}
                </span>
              ) : null}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent
          style={{ scrollbarGutter: "stable" }}
          className={`w-fit px-2 pb-4 ${fullWidth ? "w-full" : "max-w-[400px]"}`}
        >
          {phase.component ? (
            phase.component
          ) : (
            <div className="space-y-3 text-sm">
              {phase.details?.notes && (
                <div className="px-4">
                  <span className="font-medium text-gray-700">Feedback: </span>
                  <span className="text-gray-600">{phase.details.notes}</span>
                </div>
              )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <Card
      style={{ scrollbarGutter: "stable" }}
      className={`mx-auto w-[410px] p-0 ${fullWidth ? "w-full" : ""}`}
    >
      <CardContent className="p-0">
        <div className="space-y-6 p-8">
          <div>
            {!fullWidth && (
              <CardTitle className="mb-6 text-xl font-bold">
                Resultado general del proceso
              </CardTitle>
            )}

            <div className="overflow-hidden rounded-lg bg-gray-50">
              {/* Header */}
              {!fullWidth && (
                <div className="flex items-center justify-between border-b bg-gray-100 px-6 py-3">
                  <span className="font-semibold text-gray-700">
                    Nombre de la fase
                  </span>
                  <span className="font-semibold text-gray-700">Puntaje</span>
                </div>
              )}

              {/* Phases */}
              <Accordion
                defaultValue={fullWidth ? phases.map((phase) => phase.id) : []}
                type="multiple"
                className="w-full"
              >
                {phases.map((phase) => (
                  <PhaseRow
                    fullWidth={fullWidth}
                    key={phase.id}
                    phase={phase}
                  />
                ))}
              </Accordion>

              {/* Total Score */}
              {totalWeightedScore > 0 && (
                <div className="flex items-center justify-between border-t-2 border-gray-200 bg-gray-50 px-6 py-4">
                  <span className="font-bold text-gray-900">
                    Total ponderado
                  </span>
                  <span
                    className={`text-lg font-bold ${getScoreColor(totalWeightedScore, maxTotalScore)}`}
                  >
                    {formatScore(totalWeightedScore, maxTotalScore)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
