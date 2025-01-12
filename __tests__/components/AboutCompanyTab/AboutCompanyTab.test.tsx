import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AboutCompanyTab } from "@/components/AboutCompanyTab/AboutCompanyTab";
import { useBusinesses } from "@/hooks/use-businesses";
import { Dictionary } from "@/types/i18n";
import { getDictionary } from "@/get-dictionary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/hooks/use-businesses");

const mockUseBusinesses = vi.mocked(useBusinesses);
let mockDictionary: Dictionary;
const queryClient = new QueryClient();

describe("AboutCompanyTab", () => {
  beforeEach(async () => {
    mockDictionary = await getDictionary("es");
    vi.clearAllMocks();
  });

  const renderWithQueryClient = (component: React.ReactNode) =>
    render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>,
    );

  it("renders the loading skeleton when data is loading", () => {
    mockUseBusinesses.mockReturnValue({
      isLoading: true,
      rootBusiness: null,
    } as any);

    const { container } = renderWithQueryClient(
      <AboutCompanyTab dictionary={mockDictionary} />,
    );
    // Assert that the skeleton is rendered by checking its structure
    expect(container.querySelectorAll(".skeleton")).toHaveLength(1); // Adjust the number based on your skeleton elements
  });

  it("renders the CompanyDetailsForm when rootBusiness data is available", () => {
    const mockRootBusiness = { id: "1", name: "Test Business" };

    mockUseBusinesses.mockReturnValue({
      rootBusiness: mockRootBusiness,
      isLoading: false,
    } as any);

    renderWithQueryClient(<AboutCompanyTab dictionary={mockDictionary} />);

    expect(
      screen.getByText(mockDictionary.companiesPage.formTitle), // Adjust this depending on how CompanyDetailsForm renders
    ).toBeInTheDocument();
  });

  it("renders nothing when there is no rootBusiness and loading is false", () => {
    mockUseBusinesses.mockReturnValue({
      rootBusiness: null,
      isLoading: false,
    } as any);

    const { container } = renderWithQueryClient(
      <AboutCompanyTab dictionary={mockDictionary} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
