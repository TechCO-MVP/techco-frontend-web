import { Suspense } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import RootLayout from "@/app/[lang]/layout";
import { generateStaticParams } from "@/app/[lang]/layout";
import { describe, it, expect, vi } from "vitest";
import { Locale } from "@/i18n-config";
import { i18n } from "@/i18n-config";

vi.mock("next/font/local", () => ({
  default: vi.fn(() => ({
    variable: "mocked-font",
  })),
}));

/**
 * See: https://nextjs.org/docs/app/building-your-application/testing/vitest
 * RootLayout is an async Server Component which is not supported by vitest yet
 * As a workaround we use Suspense and waitFor along with Promise.resolve
 * to be able to test it.
 */
describe("RootLayout", () => {
  it("renders children correctly", async () => {
    const params = { lang: "en" as Locale };
    render(
      <Suspense>
        <RootLayout params={Promise.resolve(params)}>
          <div data-testid="child">Test Content</div>
        </RootLayout>
      </Suspense>,
    );

    const child = await screen.findByTestId("child");
    expect(child).toBeInTheDocument();
  });

  it("applies correct lang attribute", async () => {
    const params = { lang: "es" as Locale };

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <RootLayout params={Promise.resolve(params)}>
          <div>Test</div>
        </RootLayout>
      </Suspense>,
    );

    await waitFor(() => {
      expect(document.documentElement.lang).toBe("es");
    });
  });
});

describe("generateStaticParams", () => {
  it("returns correct static params based on available locales", async () => {
    // Mock i18n locales
    const mockLocales: readonly ["es", "en"] = ["es", "en"];
    vi.spyOn(i18n, "locales", "get").mockReturnValue(mockLocales);

    // Call the function
    const params = await generateStaticParams();

    // Check that the returned params match expected output
    expect(params).toEqual(mockLocales.map((locale) => ({ lang: locale })));
  });
});
