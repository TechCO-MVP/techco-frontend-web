import React from "react";
import { cn } from "@/lib/utils";
type FontSize = "normal" | "large" | "small" | "xs" | "xxs";
type FontWeight = "regular" | "medium" | "bold" | "black";

const fontSizeMap: Record<FontSize, string> = {
  normal: "text-base",
  large: "text-2xl",
  small: "text-sm",
  xs: "text-xs",
  xxs: "text-[0.5625rem]",
};

const fontWeightMap: Record<FontWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  bold: "font-bold",
  black: "font-black",
};

type TextProps = {
  size?: "normal" | "large" | "small" | "xs" | "xxs";
  fontWeight?: FontWeight;
  type?: "span" | "p" | "label" | "figcaption";
  color?: string;
  className?: string;
  children: React.ReactNode | string;
};

export const Text: React.FC<TextProps> = ({
  size = "normal",
  fontWeight = "regular",
  type = "p",
  color,
  className,
  children,
  ...props
}) => {
  const Tag = type as React.ElementType;
  const colorClass = color ? `text-[${color}]` : "text-primary";

  return (
    <Tag
      className={cn(
        "font-sans",
        fontSizeMap[size],
        fontWeightMap[fontWeight],
        colorClass,
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};
