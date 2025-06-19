import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  cn,
  countryCodeLookup,
  countryLabelLookup,
  formatDate,
  getErrorMessage,
} from "@/lib/utils";
import { COUNTRIES } from "@/lib/data/countries";
import { getDictionary } from "@/get-dictionary";
import { Dictionary } from "@/types/i18n";
describe("cn utility function", () => {
  let dictionary: Dictionary;
  beforeEach(async () => {
    dictionary = await getDictionary("es"); // Load the Spanish dictionary
    vi.clearAllMocks();
  });
  it("should combine multiple classes into a single string", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });

  it("should handle conditional classes correctly", () => {
    const result = cn("class1", false && "class2", "class3");
    expect(result).toBe("class1 class3");
  });

  it("should remove duplicate classes using tailwind-merge", () => {
    const result = cn("bg-red-500", "bg-blue-500");
    expect(result).toBe("bg-blue-500");
  });

  it("should handle undefined and null inputs gracefully", () => {
    const result = cn("class1", undefined, null, "class2");
    expect(result).toBe("class1 class2");
  });

  it("should return an empty string if no classes are provided", () => {
    const result = cn();
    expect(result).toBe("");
  });

  describe("countryCodeLookup utility function", () => {
    it("should return the correct country code for a given value", () => {
      const countryCode = countryCodeLookup(COUNTRIES[0].value);
      expect(countryCode).toBe(COUNTRIES[0].code);
    });

    it("should return null for an unknown value", () => {
      const countryCode = countryCodeLookup("unknown-value");
      expect(countryCode).toBeNull();
    });
  });

  describe("countryLabelLookup utility function", () => {
    it("should return the correct country label for a given code", () => {
      const countryLabel = countryLabelLookup(COUNTRIES[0].code);
      expect(countryLabel).toBe(COUNTRIES[0].label);
    });

    it("should return null for an unknown code", () => {
      const countryLabel = countryLabelLookup("unknown-code");
      expect(countryLabel).toBeNull();
    });
  });

  describe("formatDate utility function", () => {
    it("should format a valid date string correctly", () => {
      const formattedDate = formatDate("2025-01-01");
      expect(formattedDate).toBe("01 Jan 2025");
    });

    it("should return null for an undefined or empty date string", () => {
      expect(formatDate()).toBeNull();
      expect(formatDate("")).toBeNull();
    });
  });

  it("should return the correct error message for a valid key", () => {
    const getError = getErrorMessage(dictionary);

    const requiredMessage = getError("nameError");
    expect(requiredMessage).toBe(dictionary.validationErrors.nameError);

    const invalidMessage = getError("emailError");
    expect(invalidMessage).toBe(dictionary.validationErrors.emailError);
  });

  it("should return undefined for an invalid key", () => {
    const getError = getErrorMessage(dictionary);

    const unknownMessage = getError("unknownKey");
    expect(unknownMessage).toBeUndefined();
  });
});
