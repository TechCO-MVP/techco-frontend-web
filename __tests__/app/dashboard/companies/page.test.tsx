import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CompaniesPage from "@/app/[lang]/dashboard/companies/page";
import { Locale } from "@/i18n-config";
import { Suspense } from "react";

// Mock the dictionary and other imports
vi.mock("@/get-dictionary", () => ({
  getDictionary: vi.fn().mockResolvedValue({
    companiesPage: {
      goBack: "Go back",
      aboutCompanyTabTitle: "About Company",
      userSettingsTabTitle: "User Settings",
      mainTabTitle: "Main Panel",
    },
  }),
}));

vi.mock("@/components/AboutCompanyTab/AboutCompanyTab", () => ({
  AboutCompanyTab: vi.fn(() => (
    <div data-testid="about-company-tab">About Company Content</div>
  )),
}));

vi.mock("@/components/UserSettingsTab/UserSettingsTab", () => ({
  UserSettingsTab: vi.fn(() => (
    <div data-testid="user-settings-tab">User Settings Content</div>
  )),
}));

describe("CompaniesPage", () => {
  it("renders correctly with tabs and content", async () => {
    const mockParams = Promise.resolve({ lang: "en" as Locale });

    render(
      <Suspense>
        <CompaniesPage params={mockParams} />
      </Suspense>,
    );

    await waitFor(() => {
      // Ensure navigation link renders correctly
      expect(screen.getByText("Go back")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Go back" })).toHaveAttribute(
        "href",
        "/",
      );

      // Ensure tabs render with correct titles
      expect(screen.getByText("About Company")).toBeInTheDocument();
      expect(screen.getByText("User Settings")).toBeInTheDocument();
      expect(screen.getByText("Main Panel")).toBeInTheDocument();
    });

    // Check tab content
    expect(screen.getByTestId("about-company-tab")).toBeInTheDocument();
    expect(screen.queryByTestId("user-settings-tab")).not.toBeInTheDocument(); // Not rendered initially
  });
});
