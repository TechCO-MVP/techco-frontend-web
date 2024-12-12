import { VALIDATION_ERROR_KEYS } from "@/constants";
import { Dictionary } from "@/types/i18n";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(dictionary: Dictionary) {
  return function (key?: string): string {
    return dictionary.validationErrors[
      VALIDATION_ERROR_KEYS[key as keyof typeof VALIDATION_ERROR_KEYS]
    ];
  };
}
