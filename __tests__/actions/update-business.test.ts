import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateCompanyAction } from "@/actions";

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn().mockReturnValue({ value: "mock-token" }),
  })),
}));

vi.mock("@/lib/api-endpoints", () => ({
  apiEndpoints: {
    updateBusiness: vi.fn((id) => `https://api.example.com/business/${id}`),
  },
}));

describe("updateCompanyAction", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  it("should successfully update the company details", async () => {
    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        message: "Company updated successfully",
      }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as any);

    const data = {
      name: "Company name",
      description: "Updated company description",
      segment: "Technology",
      industry: "Software",
      website: "https://company.com",
      linkedin: "https://linkedin.com/company",
      companySize: "11-50",
      logo: "https://company.com/logo.png",
      countryCode: "es",
    };

    const response = await updateCompanyAction(data, "123");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/business/123",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? "",
          Authorization: "mock-token",
        },
        body: JSON.stringify({
          name: "Company name",
          country_code: "es",
          description: "Updated company description",
          segment: "Technology",
          industry: "Software",
          url: "https://company.com",
          linkedin_url: "https://linkedin.com/company",
          company_size: "11-50",
          logo: "https://company.com/logo.png",
        }),
      },
    );

    expect(response).toEqual({
      success: true,
      message: "Company updated successfully",
    });
  });

  it("should return an error if the response is not ok", async () => {
    const mockResponse = {
      ok: false,
      json: vi.fn().mockResolvedValue({
        error: "Failed to update company details",
      }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as any);

    const data = {
      description: "Updated company description",
      segment: "Technology",
      industry: "Software",
      website: "https://company.com",
      linkedin: "https://linkedin.com/company",
      companySize: "11-50",
      logo: "https://company.com/logo.png",
    };

    const response = await updateCompanyAction(data, "123");

    expect(response).toEqual({
      success: false,
      message: "Failed to update company details",
    });
  });

  it("should handle unexpected errors gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const data = {
      description: "Updated company description",
      segment: "Technology",
      industry: "Software",
      website: "https://company.com",
      linkedin: "https://linkedin.com/company",
      companySize: "11-50",
      logo: "https://company.com/logo.png",
    };

    const response = await updateCompanyAction(data, "123");

    expect(response).toEqual({
      success: false,
      message: "Network error",
    });
  });
});
