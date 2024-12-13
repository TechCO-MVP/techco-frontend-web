import { render, screen, waitFor } from "@testing-library/react";
import SignUp from "@/app/[lang]/(auth)/signup/page";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Suspense } from "react";
import { Locale } from "@/i18n-config";
import { Dictionary } from "@/types/i18n";

// Mock external dependencies
vi.mock("@/get-dictionary", () => ({
  getDictionary: vi.fn(async (lang: string) => ({
    signUp: {
      welcomeMessage: lang === "en" ? "Welcome" : "Bienvenido",
    },
  })),
}));

vi.mock("@/components/SignUpForm/SignUpForm", () => ({
  // @ts-nocheck
  SignUpForm: ({ dictionary }: { dictionary: Dictionary }) => (
    <div data-testid="signup-form">{dictionary.signUp.welcomeMessage}</div>
  ),
}));

describe("SignUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with the correct heading in English", async () => {
    const params = Promise.resolve({ lang: "en" as Locale });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SignUp params={params} />
      </Suspense>,
    );

    await waitFor(() => {
      const form = screen.getByTestId("signup-form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveTextContent("Welcome");
    });
  });

  it("renders the form with the correct heading in Spanish", async () => {
    const params = Promise.resolve({ lang: "es" as Locale });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SignUp params={params} />
      </Suspense>,
    );

    await waitFor(() => {
      const form = screen.getByTestId("signup-form");
      expect(form).toBeInTheDocument();
      expect(form).toHaveTextContent("Bienvenido");
    });
  });
});
