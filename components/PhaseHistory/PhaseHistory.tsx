"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger as BaseTrigger,
} from "@/components/ui/accordion";
import * as React from "react";
import {
  PipefyField,
  PipefyNode,
  PipefyPhase,
  PipefyPipe,
} from "@/types/pipefy";
import { formatDateToShort, timeAgo } from "@/lib/utils";
import * as actions from "@/actions";
import { EditableField } from "@/components/EditableField/EditableField";
import { Dictionary } from "@/types/i18n";
// Extend the AccordionTrigger to include our custom layout
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof BaseTrigger>,
  React.ComponentPropsWithoutRef<typeof BaseTrigger> & {
    date: string;
    hideDate: boolean;
  }
>(({ children, date, hideDate, ...props }, ref) => (
  <BaseTrigger
    ref={ref}
    className="h-[88px] px-5 py-4 hover:no-underline [&[data-state=open]>div>div:last-child>svg]:rotate-180"
    {...props}
  >
    <div className="flex w-full items-center justify-between">
      <div className="text-left">{children}</div>
      <div className="relative flex items-center">
        {!hideDate && (
          <span className="mr-4 text-xl font-medium">
            {formatDateToShort(date)}
          </span>
        )}
        <div className="relative after:absolute after:left-0 after:top-[-44px] after:h-[88px] after:w-px after:bg-gray-300 after:content-['']"></div>
        <div className="ml-4"></div>
      </div>
    </div>
  </BaseTrigger>
));
AccordionTrigger.displayName = "AccordionTrigger";

interface PhaseHistoryProps {
  card: PipefyNode;
  pipe: PipefyPipe;
  dictionary: Dictionary;
}

export const PhaseHistory: React.FC<PhaseHistoryProps> = ({
  card,
  pipe,
  dictionary,
}) => {
  const isStartForm = (id: string): boolean => {
    return id === pipe.startFormPhaseId;
  };

  const getPhaseName = (phase: PipefyPhase): string => {
    if (isStartForm(phase.id)) return "Datos iniciales";
    return phase.name;
  };

  const getFieldValueByInternalId = (
    fields: PipefyField[],
    internalId: string,
  ): string | undefined => {
    const field = fields.find((f) => f.phase_field?.internal_id === internalId);
    return field ? field.value : undefined;
  };

  const renderField = (field: PipefyField) => {
    return (
      <EditableField
        pipe={pipe}
        cardId={card.id}
        key={field.internal_id}
        label={field.label}
        type={field.type}
        value={getFieldValueByInternalId(card.fields, field.internal_id)}
        options={field.options || []}
        name={field.id}
        action={actions.updateField}
      />
    );
  };
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <Accordion
        type="multiple"
        defaultValue={["phase-1"]}
        className="space-y-4"
      >
        {card.phases_history.map((history) => (
          <AccordionItem
            key={history.phase.id}
            value={history.phase.id}
            className="overflow-hidden rounded-md border border-gray-200"
          >
            <AccordionTrigger
              hideDate={isStartForm(history.phase.id)}
              date={history.lastTimeIn}
            >
              <h2 className="text-2xl font-bold">
                {getPhaseName(history.phase)}
              </h2>
              {!isStartForm(history.phase.id) && (
                <p className="text-gray-500">
                  Duracion &nbsp;
                  <span className="text-gray-600">
                    {timeAgo(history.duration, dictionary)}
                  </span>
                </p>
              )}
            </AccordionTrigger>

            <AccordionContent className="flex h-full border-t border-gray-200 px-5 pb-5 pt-2">
              <div className="w-full space-y-6">
                {history.phase.fields.map((field) => {
                  return renderField(field);
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
