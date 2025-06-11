import { VALIDATION_ERROR_KEYS } from "@/constants";
import { Dictionary } from "@/types/i18n";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import { COUNTRIES } from "@/lib/data/countries";
import {
  DraftPositionData,
  PositionFlow,
  PositionPhaseSearchResult,
} from "@/types";

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
  const authorMatch = text.match(/\[\{(.*?)\}\]/);
  const phaseMatch = text.match(/\{\{phase:(.*?)\}\}/);

  const author = authorMatch ? authorMatch[1] : null;
  const phaseName = phaseMatch ? phaseMatch[1] : null;

  const comment = text
    .replace(/\s*\[\{.*?\}\]/g, "") // remove author
    .replace(/\s*\{\{phase:.*?\}\}/g, "") // remove phase name
    .trim();

  return { comment, author, phaseName };
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

export function getPriority(
  priority: string | undefined,
  i18n: Dictionary["positionDetailsPage"],
) {
  if (!priority) return "";
  switch (priority) {
    case "high":
      return `${i18n.highPriority} 🔥🔥`;
    case "medium":
      return `${i18n.mediumPriority} 🔥`;
    case "low":
      return `${i18n.lowPriority}`;
    default:
      return "";
  }
}

export const calculateTime = (
  dateString: string | undefined,
  dictionary: Dictionary,
) => {
  if (!dateString) return null;
  const givenDate = new Date(dateString);
  const currentDate = new Date();

  const diffInMs = currentDate.getTime() - givenDate.getTime();

  return timeAgo(diffInMs, dictionary);
};
export function isPositionDescriptionComplete(
  data: DraftPositionData,
): boolean {
  return (
    !!data &&
    typeof data.city === "string" &&
    data.city.trim() !== "" &&
    typeof data.role === "string" &&
    data.role.trim() !== "" &&
    typeof data.country_code === "string" &&
    data.country_code.trim() !== "" &&
    typeof data.description === "string" &&
    data.description.trim() !== "" &&
    Array.isArray(data.responsabilities) &&
    data.responsabilities.length > 0 &&
    Array.isArray(data.benefits) &&
    data.benefits.length > 0 &&
    Array.isArray(data.skills) &&
    data.skills.length > 0 &&
    typeof data.work_mode === "string" &&
    data.work_mode.trim() !== "" &&
    typeof data.seniority === "string" &&
    data.seniority.trim() !== ""
  );
}

export function findPhaseByName(
  phaseName: string,
  flowData?: PositionFlow,
): PositionPhaseSearchResult | null {
  if (!flowData) return null;
  // Normalize the search term (case-insensitive, trim whitespace)
  const normalizedPhaseName = phaseName.toLowerCase().trim();

  for (const group of flowData.groups) {
    for (const phase of group.phases) {
      if (phase.name.toLowerCase().trim() === normalizedPhaseName) {
        return {
          phase,
          groupName: group.name,
          candidateData: phase.candidate_data,
          interviewerData: phase.interviewer_data,
        };
      }
    }
  }

  return null;
}
