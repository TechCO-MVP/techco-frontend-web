import React, { useState } from "react";

import { Heart, Target } from "lucide-react";

import { PositionConfigurationFlowTypes } from "@/types";
import { Dictionary } from "@/types/i18n";
import { ProcessCard } from "./ProcessCard";

interface TemplateSelectionTableProps {
  /**
   * Called when a template is selected. Receives the template key (1, 2, or 3).
   */
  onTemplateSelect: (flowType: PositionConfigurationFlowTypes) => void;
  isPending: boolean;
  dictionary: Dictionary;
}

const processes = [
  // {
  //   id: PositionConfigurationFlowTypes.LOW_PROFILE_FLOW,
  //   icon: <Brain className="h-full w-full" />,
  //   title: "Mente Estratégica",
  //   description:
  //     "Descubre cómo tus candidatos enfrentarían desafíos reales de tu negocio, evaluando pensamiento crítico, resolución de problemas y visión estratégica.",
  //   disclaimer:
  //     "El proceso es automático y concluye con una única entrevista final para revisar la prueba.",
  // },
  {
    id: PositionConfigurationFlowTypes.MEDIUM_PROFILE_FLOW,
    icon: <Heart className="h-full w-full" />,
    title: "Proceso Retos y Comportamientos",
    description:
      "Asegura el encaje perfecto evaluando los comportamientos que esperas de tu candidato alineados a tu cultura organizacional.",
    disclaimer:
      "El proceso es automático y concluye con una única entrevista final para revisar la prueba.",
  },
  {
    id: PositionConfigurationFlowTypes.HIGH_PROFILE_FLOW,
    icon: <Target className="h-full w-full" />,
    title: "Proceso Talento 360°",
    description:
      "Elige lel proceso más completo para conocer a fondo a tus candidatos: Realiza nuestras dos pruebas por separado —'Mente Estratégica' y 'Match Cultural'— para una visión 360°.",
    disclaimer:
      "El proceso es automático e incluye dos entrevistas: una para validar la prueba de retos y comportamientos, y otra final para evaluar el caso de negocio.",
  },
];

export const TemplateSelectionTable: React.FC<TemplateSelectionTableProps> = ({
  onTemplateSelect,
  isPending,
}) => {
  const [selectedFlowType, setSelectedFlowType] =
    useState<PositionConfigurationFlowTypes | null>(null);
  const handleProcessSelect = (processId: PositionConfigurationFlowTypes) => {
    onTemplateSelect(processId);
    setSelectedFlowType(processId);
  };
  return (
    <div className="mx-auto max-w-7xl px-6 py-4">
      <div className="animate-fade-in mb-8 text-center">
        <h1 className="mb-8 text-2xl font-bold leading-tight">
          Escoge uno de nuestros 3 tipos de proceso para crear tu vacante.
        </h1>

        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border-talent-green-500 bg-gradient-to-r text-justify">
            <p className="text-base leading-relaxed text-muted-foreground">
              Hemos diseñado 3 tipos de evaluaciones para adaptarnos a lo que
              buscas. Desde procesos ágiles para vacantes operativas, hasta
              evaluaciones completas para posiciones estratégicas y de
              liderazgo.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6">
        {processes.map((process, index) => (
          <ProcessCard
            key={process.id}
            icon={process.icon}
            title={process.title}
            description={process.description}
            disclaimer={process.disclaimer}
            variant={
              process.id === PositionConfigurationFlowTypes.HIGH_PROFILE_FLOW
                ? "featured"
                : "default"
            }
            delay={index * 200}
            onSelect={() => handleProcessSelect(process.id)}
            isPending={isPending && selectedFlowType === process.id}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-surface-subtle/50 mx-auto max-w-4xl rounded-lg border border-border/30 px-6 py-4">
          <p className="text-sm italic text-muted-foreground">
            En todos los procesos comenzamos con el{" "}
            <span className="font-medium text-talent-green-500">
              ADN del Talento
            </span>
            : un filtro inicial que valida habilidades, experiencia, hoja de
            vida, datos de contacto, expectativa salarial, entre otros…
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionTable;
