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

export const parseComment = (text: string) => {
  const match = text.match(/\[\{(.*?)\}\]/);
  const author = match ? match[1] : null;
  const comment = text.replace(/\s*\[\{.*?\}\]/g, "").trim();

  return { comment, author };
};

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

export function countryNameLookup(code: string): string | null {
  const country = COUNTRIES.find(
    (c) => c.code.toLowerCase() === code.toLowerCase(),
  );
  return country
    ? country.label.replace(/[\p{Emoji}\uFE0F]/gu, "").trim()
    : null;
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

export function timeAgo(ms: number, dictionary: Dictionary) {
  const { utils } = dictionary;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 10) return utils.aFewSeconds;
  if (seconds < 60) return `${seconds} ${utils.seconds}`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 2) return utils.aMinute;
  if (minutes < 60) return `${minutes} ${utils.minutes}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 2) return utils.anHour;
  if (hours < 24) return `${hours} ${utils.hours}`;

  const days = Math.floor(hours / 24);
  if (days < 2) return utils.aDay;
  if (days < 30) return `${days} ${utils.days}`;

  const months = Math.floor(days / 30);
  if (months < 2) return utils.aMonth;
  if (months < 12) return `${months} ${utils.months}`;

  const years = Math.floor(months / 12);
  return years < 2 ? utils.aYear : `${years} ${utils.years}`;
}

export function formatDateToShort(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
