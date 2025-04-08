"use client";

import type * as React from "react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const notificationVariants = cva(
  "fixed z-[200] shadow-lg transition-all duration-300 ease-in-out",
  {
    variants: {
      position: {
        "top-right": "top-4 right-4",
        "top-center": "top-4 left-1/2 -translate-x-1/2",
        "bottom-right": "bottom-4 right-4",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      position: "top-right",
    },
  },
);

export interface NotificationProps
  extends React.ComponentPropsWithoutRef<typeof Card>,
    VariantProps<typeof notificationVariants> {
  show: boolean;
  onClose: () => void;
  badge?: string;
  title: string;
  subtitle?: string;
  timestamp?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  id: string;
}

export function NotificationDialog({
  className,
  position,
  show,
  onClose,
  badge,
  title,
  subtitle,
  timestamp,
  description,
  actionLabel,
  onAction,
  ...props
}: NotificationProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] flex items-start justify-center">
      <div className="pointer-events-auto relative" ref={cardRef}>
        <Card
          className={cn(
            notificationVariants({ position }),
            "w-full max-w-md",
            "translate-y-0 opacity-100",
            className,
          )}
          {...props}
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
            <div className="flex flex-col gap-1">
              {badge && (
                <Badge className="w-fit bg-blue-500 hover:bg-blue-600">
                  {badge}
                </Badge>
              )}
              <div className="flex flex-col">
                <h4 className="text-base font-semibold">{title}</h4>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {timestamp && (
              <p className="mb-1 text-xs text-muted-foreground">{timestamp}</p>
            )}
            {description && <p className="text-sm">{description}</p>}
          </CardContent>
          {actionLabel && (
            <CardFooter className="p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onAction}
                className="w-full sm:w-auto"
              >
                {actionLabel}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
