import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";

export const QualitativeEvaluation = ({
  aspectsNotDemostrated,
  recomendation,
  positionMatch,
}: {
  aspectsNotDemostrated: string;
  recomendation: string;
  positionMatch: string;
}) => {
  return (
    <div className="mx-auto mb-6 w-full space-y-6">
      {/* Main Evaluation Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Evaluación Cualitativa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fortaleza Item */}
          <div className="flex items-start space-x-4 border-l-4 border-teal-400 pl-4">
            <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-teal-500" />
            <div className="flex-1">
              <div className="mb-2 flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Coincidencia con la vacante
                </h3>
              </div>
              <p className="text-gray-600">{positionMatch}</p>
            </div>
          </div>

          {/* Área de mejora Item */}
          <div className="flex items-start space-x-4 border-l-4 border-yellow-400 pl-4">
            <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-yellow-500" />
            <div className="flex-1">
              <div className="mb-2 flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Habilidades no evidenciadas
                </h3>
              </div>
              <p className="text-gray-600">{aspectsNotDemostrated || "N/A"}</p>
            </div>
          </div>

          {/* Recomendación Item */}
          <div className="flex items-start space-x-4 border-l-4 border-blue-400 pl-4">
            <TrendingUp className="mt-1 h-6 w-6 flex-shrink-0 text-blue-500" />
            <div className="flex-1">
              <div className="mb-2 flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recomendación
                </h3>
              </div>
              <p className="text-gray-600">{recomendation}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
