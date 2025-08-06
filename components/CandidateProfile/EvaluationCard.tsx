import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Target,
  MessageCircle,
  Clock,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import type { EvaluationMetric } from "@/types";
import { getScoreColor } from "@/lib/utils";

interface EvaluationCardProps {
  metric: EvaluationMetric;
}

const iconMap = {
  user: User,
  target: Target,
  "message-circle": MessageCircle,
  clock: Clock,
  "bar-chart": BarChart3,
};

export function EvaluationCard({ metric }: EvaluationCardProps) {
  const IconComponent = iconMap[metric.icon];
  const maxScore = metric.maxScore || 5;
  const scorePercentage = metric.score ? (metric.score / maxScore) * 100 : 0;
  const circumference = 2 * Math.PI * 20; // radius of 20
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (scorePercentage / 100) * circumference;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-lg bg-talent-green-50 p-2">
            <IconComponent className="h-5 w-5 text-talent-green-500" />
          </div>
          <TrendingUp className="h-4 w-4 text-gray-400" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div
              className={`mb-1 text-3xl font-bold text-gray-900 ${getScoreColor(
                metric.score || 0,
                maxScore,
              )}`}
            >
              {metric.score !== undefined ? metric.score.toFixed(1) : "-"}
            </div>
            <div className="text-sm leading-tight text-gray-600">
              {metric.title}
            </div>
          </div>

          {metric.score !== undefined && (
            <div className="relative ml-4 h-12 w-12">
              <svg
                className="h-12 w-12 -rotate-90 transform"
                viewBox="0 0 44 44"
              >
                {/* Background circle */}
                <circle
                  cx="22"
                  cy="22"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                  cx="22"
                  cy="22"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className={`text-talent-green-500 transition-all duration-300 ease-in-out ${getScoreColor(metric.score, maxScore)}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
