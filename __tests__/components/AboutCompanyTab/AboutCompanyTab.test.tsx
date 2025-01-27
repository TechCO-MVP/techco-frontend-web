import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AboutCompanyTab } from "@/components/AboutCompanyTab/AboutCompanyTab";
import { useBusinesses } from "@/hooks/use-businesses";
import { Dictionary } from "@/types/i18n";
import { getDictionary } from "@/get-dictionary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store/index";
vi.mock("@/hooks/use-businesses");

const mockUseBusinesses = vi.mocked(useBusinesses);
let mockDictionary: Dictionary;
const queryClient = new QueryClient();

describe("AboutCompanyTab", () => {
  beforeEach(async () => {
    mockDictionary = await getDictionary("es");
    vi.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactNode) =>
    render(
      <QueryClientProvider client={queryClient}>
         <Provider store={makeStore()}>
        {component}
         </Provider>
      </QueryClientProvider>,
    );

  it("renders the loading skeleton when data is loading", () => {
    mockUseBusinesses.mockReturnValue({
      isLoading: true,
      rootBusiness: null,
    } as any);

    const { container } = renderWithProviders(
      <AboutCompanyTab dictionary={mockDictionary} />,
    );

    expect(container.querySelectorAll(".skeleton")).toHaveLength(1); 
  });

  it("renders the CompanyDetailsForm when rootBusiness data is available", () => {
    const mockRootBusiness = { id: "1", name: "Test Business" };

    mockUseBusinesses.mockReturnValue({
      rootBusiness: mockRootBusiness,
      isLoading: false,
    } as any);

    renderWithProviders(<AboutCompanyTab dictionary={mockDictionary} />);

    expect(
      screen.getByText(mockDictionary.companiesPage.formTitle),
    ).toBeInTheDocument();
  });

  it("renders nothing when there is no rootBusiness and loading is false", () => {
    mockUseBusinesses.mockReturnValue({
      rootBusiness: null,
      isLoading: false,
    } as any);

    const { container } = renderWithProviders(
      <AboutCompanyTab dictionary={mockDictionary} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
