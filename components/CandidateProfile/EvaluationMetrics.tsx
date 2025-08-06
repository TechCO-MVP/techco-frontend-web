import { EvaluationCard } from "./EvaluationCard";
import type { EvaluationMetric } from "@/types";

interface EvaluationMetricsProps {
  metrics: EvaluationMetric[];
}

export function EvaluationMetrics({ metrics }: EvaluationMetricsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Métricas de Evaluación
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric) => (
          <EvaluationCard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
