import { render, screen, waitFor } from "@testing-library/react";
import SignUpLayout from "@/app/[lang]/(auth)/layout";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Suspense } from "react";
import { Locale } from "@/i18n-config";

// Mocking the external dependencies
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/get-dictionary", () => ({
  getDictionary: vi.fn(async (lang: string) => ({
    signUp: {
      signInLinkText: lang === "en" ? "Sign In" : "Iniciar sesión",
    },
    signIn: {
      createAccountLabel: lang === "en" ? "Create Account" : "Crear cuenta",
    },
    footer: {
      message: "Hello",
    },
  })),
}));

describe("SignUpLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Sign In button with the correct text", async () => {
    const params = Promise.resolve({ lang: "en" as Locale });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpLayout params={params}>
          <div data-testid="child">Test Content</div>
        </SignUpLayout>
      </Suspense>,
    );

    await waitFor(() => {
      const signInButton = screen.getByText("Sign In");
      expect(signInButton).toBeInTheDocument();
    });
  });

  it("renders the correct Sign In button text for Spanish", async () => {
    const params = Promise.resolve({ lang: "es" as Locale });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpLayout params={params}>
          <div data-testid="child">Contenido de prueba</div>
        </SignUpLayout>
      </Suspense>,
    );

    await waitFor(() => {
      const signInButton = screen.getByText("Iniciar sesión");
      expect(signInButton).toBeInTheDocument();
    });
  });

  it("renders children correctly", async () => {
    const params = Promise.resolve({ lang: "en" as Locale });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <SignUpLayout params={params}>
          <div data-testid="child">Test Content</div>
        </SignUpLayout>
      </Suspense>,
    );

    const child = await screen.findByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Test Content");
  });
});
