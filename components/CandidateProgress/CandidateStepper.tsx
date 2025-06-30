"use client";
import { useState } from "react";
import { Check, ChevronUp } from "lucide-react";
import { PositionFlow, PositionPhaseSearchResult } from "@/types";
import { cn } from "@/lib/utils";

export const CandidateStepper = ({
  positionFlow,
  currentPhase,
}: {
  positionFlow: PositionFlow;
  currentPhase: PositionPhaseSearchResult | null;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const groups = positionFlow.groups;
  if (!currentPhase) return null;
  const activeIndex = groups.findIndex(
    (group) => group.name === currentPhase.groupName,
  );

  const getGroupTitle = (groupName: string) => {
    switch (groupName) {
      case "Filtro inicial":
        return "ADN del Talento";
      case "Descartados":
        return "No Continua";
      case "Fit cultural":
        return "Retos y Comportamientos";
      case "Finalistas":
        return "Finalista";
      case "Assessment técnico":
        return "Caso de Negocio";
      default:
        return groupName;
    }
  };

  const steps = groups.map((group, idx) => {
    let status: string;

    if (group.name === "Finalistas" && idx === activeIndex) {
      status = "Completado";
    } else if (idx < activeIndex) {
      status = "Completado";
    } else if (idx === activeIndex) {
      status = "En Proceso";
    } else {
      status = "Pendiente";
    }
    return {
      number: idx + 1,
      title: getGroupTitle(group.name),
      status,
      isActive: idx === activeIndex,
    };
  });

  // Get steps to display based on expanded state
  const stepsToShow = isExpanded
    ? steps
    : steps.filter((step) => step.isActive);

  return (
    <div className="absolute left-0 top-0 w-full p-6 md:relative">
      <div className="mx-auto rounded-lg bg-white shadow-sm">
        {/* Header with chevron - only show on mobile */}
        <div className="flex justify-end p-4 md:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded p-1 transition-colors hover:bg-gray-100"
          >
            <ChevronUp
              className={`h-6 w-6 text-gray-400 transition-transform duration-200 ${!isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="px-6 pb-6 md:hidden">
          <div className="relative">
            {stepsToShow.map((step, index) => {
              const isCompleted = step.status === "Completado";
              const isPending = step.status === "Pendiente";
              const isActive = step.status === "En Proceso";
              return (
                <div key={step.number} className="relative flex items-start">
                  {/* Vertical line */}
                  {index < stepsToShow.length - 1 && (
                    <div className="absolute left-6 top-12 h-16 w-0.5 bg-gray-300"></div>
                  )}

                  {/* Step circle */}
                  <div
                    className={cn(
                      "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4",
                      isCompleted && "border-green-300 bg-[#34C759]",
                      isPending && "border-gray-200 bg-gray-400",
                      isActive && "border-[#FFC107] bg-[#FF9500]",
                    )}
                  >
                    {isCompleted && <Check className="h-4 w-4 stroke-white" />}
                  </div>

                  {/* Step content */}
                  <div className="ml-4 flex flex-col items-start pb-8">
                    <div className="mb-1 text-sm font-medium text-gray-500">
                      PASO {step.number}
                    </div>
                    <div className="mb-1 text-left text-lg font-semibold text-gray-900">
                      {step.title}
                    </div>
                    <div
                      className={`text-sm font-medium ${step.isActive ? "text-[#FF9500]" : "text-gray-500"}`}
                    >
                      {step.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden px-8 py-4 md:block">
          <div className="relative">
            {/* Horizontal connecting line */}
            <div className="absolute left-6 right-6 top-6 h-0.5 bg-gray-300"></div>

            {/* Steps container */}
            <div className="relative flex items-start justify-between">
              {steps.map((step) => {
                const isCompleted = step.status === "Completado";
                const isPending = step.status === "Pendiente";
                const isActive = step.status === "En Proceso";
                return (
                  <div
                    key={step.number}
                    className="flex max-w-32 flex-col items-center text-center"
                  >
                    {/* Step circle */}
                    <div
                      className={cn(
                        "relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full border-4",
                        true && "border-green-300 bg-[#34C759]",
                        isPending && "border-gray-200 bg-gray-400",
                        isActive && "border-[#FFC107] bg-[#FF9500]",
                      )}
                    >
                      {isCompleted && (
                        <Check className="h-4 w-4 stroke-white" />
                      )}
                    </div>

                    {/* Step content */}
                    <div>
                      <div
                        className={cn(
                          "mb-1 text-sm font-medium text-gray-500",
                          step.title === "No Continua" && "text-white",
                        )}
                      >
                        PASO {step.number}
                      </div>
                      <div className="mb-1 text-sm font-semibold leading-tight text-gray-900">
                        {step.title}
                      </div>
                      <div
                        className={cn(
                          "text-xs font-medium",
                          isActive && "text-[#FF9500]",
                          isPending && "text-gray-500",
                          isCompleted && "text-[#34C759]",
                          step.title === "No Continua" && "text-white",
                        )}
                      >
                        {step.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orange progress bar at bottom */}
        <div className="h-1 rounded-b-lg bg-[#FF9500] md:hidden"></div>
      </div>
    </div>
  );
};
