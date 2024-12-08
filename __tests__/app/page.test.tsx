import { Suspense } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import IndexPage from "@/app/[lang]/page";
import { describe, it, expect, vi } from "vitest";
import { Locale } from "@/i18n-config";

// Mock the getDictionary function
vi.mock("@/get-dictionary", () => ({
  getDictionary: vi.fn().mockResolvedValue({
    "server-component": {
      currentLang: "Current Language",
      welcome: "Welcome to the app!",
    },
  }),
}));

describe("IndexPage", () => {
  it("renders correctly with the provided language", async () => {
    const mockParams = Promise.resolve({ lang: "es" as Locale });

    render(
      <Suspense>
        <IndexPage params={mockParams} />
      </Suspense>,
    );

    // Wait for async content to load
    await waitFor(() => {
      expect(screen.getByText(/current language: es/i)).toBeInTheDocument();
      expect(screen.getByText(/welcome to the app!/i)).toBeInTheDocument();
    });
  });

  it("handles different languages", async () => {
    const mockParams = Promise.resolve({ lang: "en" as Locale });

    render(
      <Suspense>
        <IndexPage params={mockParams} />
      </Suspense>,
    );

    await waitFor(() => {
      expect(screen.getByText(/current language: en/i)).toBeInTheDocument();
      expect(screen.getByText(/welcome to the app!/i)).toBeInTheDocument();
    });
  });
});
