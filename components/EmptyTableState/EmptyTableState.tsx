import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface EmptyTableStateProps {
  /**
   * Icon to display. Can be a ReactNode (e.g. an SVG component) or a string path to an image.
   * If not provided, defaults to the empty-table-icon.svg from public/assets.
   */
  icon?: React.ReactNode | string;
  /**
   * Title text (bold, large)
   */
  title: string;
  /**
   * Description text (smaller, muted)
   */
  description: string;
  /**
   * Button label
   */
  buttonLabel: string;
  /**
   * Button click handler
   */
  onClick: () => void;
  /**
   * Optional className for root
   */
  className?: string;

  disabled?: boolean;
}

/**
 * EmptyTableState - shows an empty state with icon, title, description, and action button.
 * Figma: https://www.figma.com/design/BWo2BweU9Jcg9TDi90icpY/TechO?node-id=2756-4759
 */
export const EmptyTableState: React.FC<EmptyTableStateProps> = ({
  icon,
  title,
  description,
  buttonLabel,
  onClick,
  className,
  disabled,
}) => {
  // Render icon: if string, treat as image path; else render as ReactNode
  const renderIcon = () => {
    if (typeof icon === "string") {
      return (
        <Image
          src={icon}
          alt="Empty state icon"
          width={64}
          height={64}
          className="mb-4"
          priority
        />
      );
    }
    if (icon) return <div className="mb-4">{icon}</div>;
    // Default icon
    return (
      <Image
        src="/assets/empty-table-icon.svg"
        alt="Empty state icon"
        width={64}
        height={64}
        className="mb-4"
        priority
      />
    );
  };

  return (
    <div
      className={cn(
        "rounded-lgbg-background flex flex-col items-center justify-center px-4 py-12",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {renderIcon()}
      <div className="flex max-w-md flex-col items-center gap-2 text-center">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="whitespace-pre-line text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Button
        className="mt-6 h-8 rounded-md bg-talent-green-500 px-6 py-2 text-xs font-medium shadow hover:bg-talent-green-600"
        onClick={onClick}
        type="button"
        aria-label={buttonLabel}
        disabled={disabled}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

export default EmptyTableState;
