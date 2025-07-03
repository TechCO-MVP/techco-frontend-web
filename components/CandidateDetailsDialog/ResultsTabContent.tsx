"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

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
}

export default function ProcessOverview({
  phases,
  totalWeightedScore = 3.15,
  maxTotalScore = 5,
}: ProcessOverviewProps) {
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-orange-500";
    return "text-red-500";
  };

  const formatScore = (score: number, maxScore: number) => {
    return `${score.toFixed(score % 1 === 0 ? 0 : 1)} de ${maxScore}`;
  };

  const PhaseRow = ({ phase }: { phase: PhaseData }) => {
    const hasDetails =
      phase.component ||
      (phase.details && Object.keys(phase.details).length > 0);

    if (!hasDetails) {
      return (
        <div className="flex items-center justify-between border-b px-6 py-4 last:border-b-0">
          <span
            className={`text-left font-medium ${phase.status === "pending" ? "text-gray-400" : "text-gray-900"}`}
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
        value={phase.id}
        className="border-b last:border-b-0"
        disabled={phase.status === "pending"}
      >
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex w-full items-center justify-between pr-4">
            <span
              className={`text-left font-medium ${phase.status === "pending" ? "text-gray-400" : "text-gray-900"}`}
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
          className="w-fit max-w-[400px] px-2 pb-4"
        >
          {phase.component ? (
            phase.component
          ) : (
            <div className="space-y-3 text-sm">
              {phase.details?.notes && (
                <div>
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
      className="mx-auto w-[410px] p-0"
    >
      <CardContent className="p-0">
        <div className="space-y-6 p-8">
          <div>
            <CardTitle className="mb-6 text-xl font-bold">
              Resultado general del proceso
            </CardTitle>

            <div className="overflow-hidden rounded-lg bg-gray-50">
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-gray-100 px-6 py-3">
                <span className="font-semibold text-gray-700">
                  Nombre de la fase
                </span>
                <span className="font-semibold text-gray-700">Puntaje</span>
              </div>

              {/* Phases */}
              <Accordion type="multiple" className="w-full">
                {phases.map((phase) => (
                  <PhaseRow key={phase.id} phase={phase} />
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
