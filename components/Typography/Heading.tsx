import React from "react";
import { cn } from "@/lib/utils";

type FontSize = "heading1" | "heading2" | "heading3" | "heading4";

const fontSizeMap: Record<FontSize, string> = {
  heading1: "text-4xl  font-bold",
  heading2: "text-3xl  font-semibold",
  heading3: "text-2xl  font-medium",
  heading4: "text-xl  font-medium",
};

type HeadingProps = {
  level?: 1 | 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
};

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  className,
  children,
}) => {
  const HeadingTag = `h${level}` as React.ElementType;
  const fontSizeClass = fontSizeMap[`heading${level}` as FontSize];

  return (
    <HeadingTag
      className={cn(
        "font-sans leading-tight text-primary",
        fontSizeClass,
        className,
      )}
    >
      {children}
    </HeadingTag>
  );
};
