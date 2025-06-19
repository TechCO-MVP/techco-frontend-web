import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { Button } from "../ui/button";
import React, { FC } from "react";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details?: string;
  selectBtnLabel: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export const OptionCard: FC<Readonly<OptionCardProps>> = ({
  icon,
  title,
  description,
  details,
  selectBtnLabel,
  onClick,
  loading,
  disabled,
  disabledReason,
}) => {
  const isActuallyDisabled = !!disabled;
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isActuallyDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (isActuallyDisabled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const button = (
    <Button
      onClick={handleButtonClick}
      onKeyDown={handleKeyDown}
      className={
        "h-8 text-xs" +
        (isActuallyDisabled
          ? " pointer-events-auto cursor-not-allowed opacity-50"
          : "")
      }
      variant="talentGreen"
      aria-disabled={isActuallyDisabled}
      tabIndex={0}
      type="button"
    >
      {selectBtnLabel}
      {loading && <Loader2 className="animate-spin" />}
    </Button>
  );

  return (
    <div className="flex min-w-[306px] max-w-[306px] flex-col justify-between gap-5 rounded-md border px-6 py-8">
      <div className="flex w-full items-center justify-center">{icon}</div>
      <Heading
        level={2}
        className="text-center text-lg font-semibold leading-5"
      >
        {title}
      </Heading>
      <Text
        type="p"
        className="text-center text-sm leading-5 text-muted-foreground"
      >
        {description}
      </Text>
      {details && (
        <Text type="p" className="text-sm leading-5 text-muted-foreground">
          {details}
        </Text>
      )}
      {disabled && disabledReason ? (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent
              sideOffset={8}
              className="w-64 text-xs text-muted-foreground"
            >
              {disabledReason}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        button
      )}
    </div>
  );
};
