import { VALIDATION_ERROR_KEYS } from "@/constants";
import { Dictionary } from "@/types/i18n";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";

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
