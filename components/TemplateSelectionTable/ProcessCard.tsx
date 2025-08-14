import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProcessCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  disclaimer: string;
  onSelect: () => void;
  variant?: "default" | "featured";
  delay?: number;
  isPending?: boolean;
}

export const ProcessCard = ({
  icon,
  title,
  description,
  disclaimer,
  onSelect,
  variant = "default",
  delay = 0,
  isPending = false,
}: ProcessCardProps) => {
  const cardClasses =
    variant === "featured"
      ? "bg-gradient-to-br from-surface-elevated to-surface-subtle border-2 border-talent-green-500 scale-105 z-10 relative"
      : "bg-surface-elevated border border-border border-talent-green-500 hover:border-talent-green-500";

  return (
    <div
      className={`${cardClasses} animate-fade-in group flex h-full flex-col items-center rounded-xl p-4 text-center transition-all duration-500 hover:scale-105 hover:shadow-lg`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {variant === "featured" && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full bg-talent-green-500 px-4 py-1 text-xs font-semibold text-white">
          Más Popular
        </div>
      )}

      <div className="group-hover:animate-float mb-8 flex h-20 w-20 items-center justify-center text-talent-green-500 transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mb-6 text-xl font-bold leading-tight text-muted-foreground transition-colors duration-300 group-hover:text-talent-green-500">
        {title}
      </h3>

      <p className="mb-6 flex-grow text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <div className="from-surface-subtle to-surface-elevated mb-8 rounded-lg border border-border/50 bg-gradient-to-r px-4 py-3">
        <p className="text-sm font-medium italic text-muted-foreground">
          {disclaimer}
        </p>
      </div>

      <Button
        disabled={isPending}
        onClick={onSelect}
        className={`w-full rounded-xl bg-talent-green-500 py-4 text-base font-semibold shadow-lg transition-all duration-300 hover:bg-talent-green-700`}
      >
        <span className="flex items-center justify-center gap-2">
          Iniciar proceso
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          )}
        </span>
      </Button>
    </div>
  );
};
