import { render, screen, waitFor } from "@testing-library/react";
import CodePage from "@/app/[lang]/(auth)/code/page";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Suspense } from "react";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";

// Mock external dependencies
vi.mock("@/get-dictionary", () => ({
  getDictionary: vi.fn(async (lang: string) => ({
    otpPage: {
      formHeading: lang === "en" ? "Welcome" : "Bienvenido",
    },
  })),
}));

vi.mock("@/components/OTPForm/OTPForm", () => ({
  // @ts-nocheck
  OTPForm: ({ dictionary }: { dictionary: Dictionary }) => (
    <div data-testid="otp-form">{dictionary.otpPage.formHeading}</div>
  ),
}));

describe("CodePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with the correct heading in English", async () => {
    const params = Promise.resolve({ lang: "en" as Locale });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CodePage params={params} />
      </Suspense>,
    );

    await waitFor(() => {
      const form = screen.getByTestId("otp-form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveTextContent("Welcome");
    });
  });

  it("renders the form with the correct heading in Spanish", async () => {
    const params = Promise.resolve({ lang: "es" as Locale });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CodePage params={params} />
      </Suspense>,
    );

    await waitFor(() => {
      const form = screen.getByTestId("otp-form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveTextContent("Bienvenido");
    });
  });
});
