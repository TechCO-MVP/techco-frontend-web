import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";
import { BadgeInfo, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PositionConfigurationFlowTypes } from "@/types";
import { Dictionary } from "@/types/i18n";

interface TemplateSelectionTableProps {
  /**
   * Called when a template is selected. Receives the template key (1, 2, or 3).
   */
  onTemplateSelect: (flowType: PositionConfigurationFlowTypes) => void;
  isPending: boolean;
  dictionary: Dictionary;
}

const FLOW_TYPES = [
  PositionConfigurationFlowTypes.HIGH_PROFILE_FLOW,
  PositionConfigurationFlowTypes.MEDIUM_PROFILE_FLOW,
  PositionConfigurationFlowTypes.LOW_PROFILE_FLOW,
];

export const TemplateSelectionTable: React.FC<TemplateSelectionTableProps> = ({
  onTemplateSelect,
  isPending,
  dictionary,
}) => {
  const { templateSelectionTable: i18n } = dictionary;
  const [selectedFlowType, setSelectedFlowType] =
    useState<PositionConfigurationFlowTypes | null>(null);

  return (
    <TooltipProvider>
      <div className="m-auto overflow-x-auto border border-b-[5px] border-border border-b-talent-orange-500 bg-card shadow-sm">
        <table className="h-full min-w-full border-collapse text-sm">
          <thead>
            <tr className="h-[70px] bg-talent-green-900 text-center text-primary-foreground">
              {i18n.headers.map((header, idx) => (
                <th
                  key={header}
                  className={cn(
                    "text-center",
                    idx === 0
                      ? "px-4 py-3 text-left font-bold"
                      : "px-4 py-3 text-center font-bold",
                  )}
                  scope="col"
                >
                  <div className="flex flex-col items-center justify-center">
                    {header}{" "}
                    {idx !== 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <BadgeInfo className="h-4 w-4 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="max-w-[260px] text-sm font-normal"
                        >
                          {i18n.tooltips[idx - 1]}{" "}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {i18n.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={
                  rowIdx % 2 === 0
                    ? "border-b border-border bg-background"
                    : "border-b border-border bg-muted"
                }
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className={
                      cellIdx === 0
                        ? "px-4 py-3 text-left text-foreground"
                        : "px-4 py-3 text-center text-foreground"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {/* Action row for template selection */}
            <tr className="bg-muted">
              <td className="px-4 py-3" />
              {FLOW_TYPES.map((flowType) => (
                <td key={flowType} className="px-4 py-3 text-center">
                  <Button
                    disabled={isPending}
                    variant="talentGreen"
                    size="sm"
                    onClick={() => {
                      setSelectedFlowType(flowType);
                      onTemplateSelect(flowType);
                    }}
                    className="w-full"
                  >
                    {i18n.select}
                    {isPending && selectedFlowType === flowType && (
                      <Loader2 className="animate-spin" />
                    )}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
};

export default TemplateSelectionTable;
