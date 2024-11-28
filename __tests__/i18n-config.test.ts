import { describe, it, expect } from "vitest";
import { i18n, Locale } from "@/i18n-config";

describe("i18n configuration", () => {
  it("should define the correct default locale", () => {
    expect(i18n.defaultLocale).toBe("es");
  });

  it("should define the correct list of locales", () => {
    expect(i18n.locales).toEqual(["es", "en"]);
  });

  it("should ensure Locale type matches the locales array", () => {
    const validLocales: Locale[] = ["es", "en"];
    validLocales.forEach((locale) => {
      expect(i18n.locales).toContain(locale);
    });
  });
});
