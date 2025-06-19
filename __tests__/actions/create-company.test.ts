import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { createCompanyAction } from "@/actions";
import { apiEndpoints } from "@/lib/api-endpoints";
import { countryCodeLookup } from "@/lib/utils";
import { CreateBusinessData } from "@/lib/schemas";

// Mocking fetch and cookies
const mockFetch = vi.fn();
const mockGetCookie = vi.fn();

vi.stubGlobal("fetch", mockFetch);
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: mockGetCookie,
  })),
}));

// Mock the `countryCodeLookup` function
vi.mock("@/lib/utils", () => ({
  countryCodeLookup: vi.fn(),
}));

describe("createCompanyAction", () => {
  const mockData: CreateBusinessData = {
    name: "Test Company",
    country: "colombia",
    companySize: "11-50",
    parentBusinessId: "123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully create a company", async () => {
    // Mock token and API response
    mockGetCookie.mockReturnValueOnce({ value: "mock-token" });
    (countryCodeLookup as Mock).mockReturnValueOnce("CO");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Company created successfully!" }),
    });

    const response = await createCompanyAction(mockData);

    expect(response).toEqual({
      success: true,
      message: "Company created successfully!",
    });

    // Verify fetch was called with correct arguments
    expect(mockFetch).toHaveBeenCalledWith(apiEndpoints.createBusiness(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: "mock-token",
      },
      body: JSON.stringify({
        name: mockData.name,
        country_code: "CO",
        company_size: mockData.companySize,
        parent_business_id: mockData.parentBusinessId,
      }),
    });

    // Verify countryCodeLookup was called with the correct country
    expect(countryCodeLookup).toHaveBeenCalledWith("colombia");
  });

  it("should handle an API error response", async () => {
    mockGetCookie.mockReturnValueOnce({ value: "mock-token" });
    (countryCodeLookup as Mock).mockReturnValueOnce("CO");
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Error creating company" }),
    });

    const response = await createCompanyAction(mockData);

    expect(response).toEqual({
      success: false,
      message: "Error creating company",
    });
  });

  it("should handle missing token", async () => {
    mockGetCookie.mockReturnValueOnce(undefined);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Missing authorization token." }),
    });

    const response = await createCompanyAction(mockData);

    expect(response).toEqual({
      success: false,
      message: "Missing authorization token.",
    });
  });

  it("should handle fetch errors", async () => {
    mockGetCookie.mockReturnValueOnce({ value: "mock-token" });
    (countryCodeLookup as Mock).mockReturnValueOnce("CO");
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const response = await createCompanyAction(mockData);

    expect(response).toEqual({
      success: false,
      message: "Network error",
    });
  });
});
