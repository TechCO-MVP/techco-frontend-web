import { VALIDATION_ERROR_KEYS } from "@/constants";
import { Dictionary } from "@/types/i18n";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import { COUNTRIES } from "@/lib/data/countries";

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

export function decodeToken(token: string) {
  try {
    // Decode the token without verifying the signature
    const decoded = jwt.decode(token);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    return decoded; // Returns the header and payload
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export function countryCodeLookup(value: string): string | null {
  const country = COUNTRIES.find((c) => c.value === value);
  return country ? country.code : null;
}

export function countryLabelLookup(code: string): string | null {
  const country = COUNTRIES.find(
    (c) => c.code.toLowerCase() === code.toLowerCase(),
  );
  return country ? country.label : null;
}

export function formatDate(dateString?: string): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
