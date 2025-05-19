import { describe, it, expect, vi, beforeEach } from "vitest";
import { signUp } from "@/actions";
import { SignUpFormData } from "@/lib/schemas";
import { apiEndpoints } from "@/lib/api-endpoints";

const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);

const mockData: SignUpFormData = {
  full_name: "User",
  email: "test@example.com",
  company: "Tech",
  role: "Recruiter",
  companySize: "200+",
  country: "Spain",
};

describe("signUp Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when the API responds with status 200", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        message: "Sign-up successful!",
        body: {
          UserConfirmed: true,
          UserSub: "mock-user-sub",
        },
      }),
    });

    const response = await signUp(mockData);

    expect(response).toEqual({
      success: true,
      message: "Sign-up successful!",
      data: {
        UserConfirmed: true,
        UserSub: "mock-user-sub",
      },
    });

    expect(mockFetch).toHaveBeenCalledWith(apiEndpoints.signUp(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
      },
      body: JSON.stringify({
        email: mockData.email,
        name: mockData.name,
      }),
    });
  });

  it("should return an error if the API responds with a non-200 status", async () => {
    mockFetch.mockResolvedValueOnce({
      status: 400,
      json: async () => ({
        message: "Invalid email format",
      }),
    });

    const response = await signUp(mockData);

    expect(response).toEqual({
      success: false,
      message: "Invalid email format",
    });
  });

  it("should return a generic error if the API response lacks a message", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        statusCode: 500,
        body: {},
      }),
    });

    const response = await signUp(mockData);

    expect(response).toEqual({
      success: false,
      message: "Unexpected response from server.",
    });
  });

  it("should return an error when fetch throws an exception", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const response = await signUp(mockData);

    expect(response).toEqual({
      success: false,
      message: "Network error",
    });
  });
});
