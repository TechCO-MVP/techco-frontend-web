import { render, screen, waitFor } from "@testing-library/react";
import SignInPage from "@/app/[lang]/(auth)/signin/page";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Suspense } from "react";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";

// Mock external dependencies
vi.mock("@/get-dictionary", () => ({
  getDictionary: vi.fn(async (lang: string) => ({
    signIn: {
      formTitle: lang === "en" ? "Welcome" : "Bienvenido",
    },
  })),
}));

vi.mock("@/components/SignInForm/SignInForm", () => ({
  // @ts-nocheck
  SignInForm: ({ dictionary }: { dictionary: Dictionary }) => (
    <div data-testid="sign-in-form">{dictionary.signIn.formTitle}</div>
  ),
}));

describe("SignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with the correct heading in English", async () => {
    const params = Promise.resolve({ lang: "en" as Locale });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SignInPage params={params} />
      </Suspense>,
    );

    await waitFor(() => {
      const form = screen.getByTestId("sign-in-form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveTextContent("Welcome");
    });
  });

  it("renders the form with the correct heading in Spanish", async () => {
    const params = Promise.resolve({ lang: "es" as Locale });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SignInPage params={params} />
      </Suspense>,
    );

    await waitFor(() => {
      const form = screen.getByTestId("sign-in-form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveTextContent("Bienvenido");
    });
  });
});
