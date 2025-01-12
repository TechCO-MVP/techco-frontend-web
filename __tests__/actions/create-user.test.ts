import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUser } from "@/actions";
import { CreateUserData } from "@/lib/schemas";

const mockFetch = vi.fn();
const mockGetCookie = vi.fn();

vi.stubGlobal("fetch", mockFetch);
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: mockGetCookie,
  })),
}));

describe("createUser Action", () => {
  const mockUserData: CreateUserData = {
    businessId: "12345",
    fullName: "John Doe",
    email: "johndoe@example.com",
    companyPosition: "Manager",
    role: "Admin",
    businessName: "Company",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when API call is successful", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "User created successfully!",
      }),
    });

    const result = await createUser(mockUserData);

    expect(result).toEqual({
      success: true,
      message: "User created successfully!",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "mock-token",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          business_id: "12345",
          full_name: "John Doe",
          email: "johndoe@example.com",
          company_position: "Manager",
          role: "Admin",
        }),
      }),
    );
  });

  it("should return an error when API call fails", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Failed to create user",
      }),
    });

    const result = await createUser(mockUserData);

    expect(result).toEqual({
      success: false,
      message: "Failed to create user",
    });

    expect(mockFetch).toHaveBeenCalled();
  });

  it("should return a generic error when API response lacks error/message", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}), // No error or message
    });

    const result = await createUser(mockUserData);

    expect(result).toEqual({
      success: false,
      message: "Unexpected response from server.",
    });

    expect(mockFetch).toHaveBeenCalled();
  });

  it("should handle exceptions and return an error", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await createUser(mockUserData);

    expect(result).toEqual({
      success: false,
      message: "Network error",
    });

    expect(mockFetch).toHaveBeenCalled();
  });
});
