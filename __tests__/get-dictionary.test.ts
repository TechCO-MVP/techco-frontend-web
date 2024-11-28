import { describe, it, expect } from "vitest";
import { getDictionary } from "@/get-dictionary";

describe("getDictionary", () => {
  it("should load the Spanish dictionary for 'es' locale", async () => {
    const dictionary = await getDictionary("es");
    expect(dictionary).toBeDefined();
  });

  it("should load the English dictionary for 'en' locale", async () => {
    const dictionary = await getDictionary("en");
    expect(dictionary).toBeDefined();
  });

  it("should fallback to Spanish dictionary for invalid locale", async () => {
    // @ts-expect-error Testing fallback for unsupported locale
    const dictionary = await getDictionary("fr");
    expect(dictionary).toBeDefined();
  });
});
