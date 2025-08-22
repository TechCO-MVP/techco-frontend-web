import { Card } from "@/components/ui/card";

export interface PhasesStage {
  name: string;
  value: number;
  color: string;
}

interface PhasesChartProps {
  stages: PhasesStage[];
}

export const PhasesChart = ({ stages: propStages }: PhasesChartProps) => {
  const stages = propStages;

  const maxValue = Math.max(...stages.map((s) => s.value));
  const maxBarWidth = 500; // Maximum bar width in pixels
  const minBarWidth = 200; // Minimum bar width for readability

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Selecciona la etapa del funnel que quieres medir
      </h3>
      <div className="space-y-2">
        {stages.map((stage) => {
          let width;
          if (stage.value === 0) {
            width = minBarWidth;
          } else {
            // Calculate proportional width with enhanced scaling for small values
            const proportion = stage.value / maxValue;
            const scaledProportion = Math.pow(proportion, 0.7); // Power scaling for better small value differentiation
            const calculatedWidth =
              minBarWidth + scaledProportion * (maxBarWidth - minBarWidth);
            width = calculatedWidth;
          }
          return (
            <div key={stage.name} className="relative">
              <div
                className={`${stage.color} cursor-pointer rounded-r-lg px-4 py-3 text-white transition-all hover:opacity-90`}
                style={{ width: `${width}px` }}
                title={stage.name}
              >
                <div className="flex items-center justify-between">
                  <span className="pr-2 font-medium">{stage.name}</span>
                  <span className="flex-shrink-0 font-bold">{stage.value}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
