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
  CulturalAssessmentResultType,
  TechnicalAssesmentResult,
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

export const calculateScore = (items: Record<string, boolean | undefined>) => {
  if (!items) return 0;
  const totalItems = Object.keys(items).length;
  const trueItems = Object.values(items).filter(Boolean).length;
  return totalItems > 0 ? (trueItems / totalItems) * 5 : 0;
};

/**
 * Calculates a score (1-5) based on the percentage difference between expected and offered salary.
 * @param expectedSalary - The candidate's expected salary
 * @param positionSalary - The offered salary for the position
 * @returns number (1-5)
 */
export function calculateSalaryScore(
  expectedSalary: number,
  positionSalary: number,
): number {
  if (
    !expectedSalary ||
    !positionSalary ||
    expectedSalary <= 0 ||
    positionSalary <= 0
  ) {
    return 1; // Defensive: lowest score if invalid input
  }
  const diffPercent =
    ((positionSalary - expectedSalary) / expectedSalary) * 100;
  const absDiff = Math.abs(diffPercent);

  if (absDiff <= 5) {
    return 5;
  } else if (
    (diffPercent >= -15 && diffPercent <= -6) ||
    (diffPercent >= 6 && diffPercent <= 15)
  ) {
    return 4;
  } else if (
    (diffPercent >= -30 && diffPercent <= -16) ||
    (diffPercent >= 16 && diffPercent <= 30)
  ) {
    return 3;
  } else if (
    (diffPercent >= -50 && diffPercent <= -31) ||
    (diffPercent >= 31 && diffPercent <= 50)
  ) {
    return 2;
  } else {
    return 1;
  }
}

/**
 * Calculates a score (1-5) based on the candidate's expected salary relative to the position's salary range.
 * @param positionSalaryRange - The salary range for the position { min, max }
 * @param expectedSalary - The candidate's expected salary
 * @returns number (1-5)
 */
export function calculateSalaryRangeScore(
  positionSalaryRange: { min: number; max: number },
  expectedSalary: number,
): number {
  const { min, max } = positionSalaryRange;
  if (
    !min ||
    !max ||
    min <= 0 ||
    max <= 0 ||
    min > max ||
    !expectedSalary ||
    expectedSalary <= 0
  ) {
    return 1; // Defensive: lowest score if invalid input
  }

  // Calculate thresholds
  const min5 = min * 0.95;
  const min20 = min * 0.8;
  const min50 = min * 0.5;

  const max5 = max * 1.05;
  const max20 = max * 1.2;
  const max50 = max * 1.5;

  // 5: Within the range
  if (expectedSalary >= min && expectedSalary <= max) {
    return 5;
  }

  // 4: Between -5% of min and min, or max and +5% of max
  if (
    (expectedSalary >= min5 && expectedSalary < min) ||
    (expectedSalary > max && expectedSalary <= max5)
  ) {
    return 4;
  }

  // 3: Between -20% to -6% of min, or +6% to +20% of max
  if (
    (expectedSalary >= min20 && expectedSalary < min5) ||
    (expectedSalary > max5 && expectedSalary <= max20)
  ) {
    return 3;
  }

  // 2: Between -50% to -21% of min, or +21% to +50% of max
  if (
    (expectedSalary >= min50 && expectedSalary < min20) ||
    (expectedSalary > max20 && expectedSalary <= max50)
  ) {
    return 2;
  }

  // 1: Outside the above margins (> ±51%)
  return 1;
}

/**
 * Sanitizes HTML content by removing empty paragraphs and unnecessary whitespace
 * @param html - The HTML content to sanitize
 * @returns Sanitized HTML content
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return "";

  return (
    html
      // Replace multiple consecutive empty paragraphs with a single one
      .replace(/(<p>\s*<\/p>\s*){2,}/g, "<p></p>")
      // Remove empty paragraphs that only contain spaces, &nbsp;, <br>, or formatting tags
      .replace(
        /<p>\s*(?:<(?:br|strong|em)>\s*)*(?:&nbsp;|\s)*(?:<\/(?:br|strong|em)>\s*)*<\/p>/g,
        "",
      )
      // Remove multiple consecutive <br> tags
      .replace(/(<br\s*\/?>\s*){2,}/g, "<br>")
      // Trim whitespace at the start and end
      .trim()
  );
};

/**
 * Calculates the average score from a CulturalAssessmentResultType.
 * @param result - The cultural assessment result object
 * @returns number (average calificacion, 1-5 scale, rounded to 2 decimals)
 */
export function getCulturalAssessmentScore(
  result: CulturalAssessmentResultType,
): number {
  if (!result || !result.comportamientos || result.comportamientos.length === 0)
    return 0;
  const allCalificaciones = result.comportamientos.flatMap((c) =>
    c.dimensions.map((d) => d.calificacion),
  );
  if (allCalificaciones.length === 0) return 0;
  const avg =
    allCalificaciones.reduce((sum, v) => sum + v, 0) / allCalificaciones.length;
  return Number(avg.toFixed(1));
}

/**
 * Calculates the average score from a TechnicalAssesmentResult.
 * @param result - The technical assessment result object
 * @returns number (average calificacion, 1-5 scale, rounded to 2 decimals)
 */
export function getTechnicalAssessmentScore(
  result: TechnicalAssesmentResult,
): number {
  if (!result || !result.dimensiones || result.dimensiones.length === 0)
    return 0;
  const allCalificaciones = result.dimensiones.map((d) => d.calificacion);
  if (allCalificaciones.length === 0) return 0;

  const avg =
    allCalificaciones.reduce((sum, v) => sum + v, 0) / allCalificaciones.length;
  return Number(avg.toFixed(1));
}
export function getWorkMode(workMode: string) {
  switch (workMode) {
    case "REMOTE":
      return "Remoto";
    case "HYBRYD":
      return "Híbrido";
    case "ON_SITE":
      return "Presencial";
    default:
      return workMode;
  }
}
