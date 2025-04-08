import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateUser } from "@/actions";
import { UpdateUserData } from "@/lib/schemas";
import { UserRole } from "@/types";

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock cookies
vi.mock("next/headers", () => ({
  cookies: () =>
    ({
      get: (key: string) =>
        key === "idToken" ? { value: "mock-token" } : undefined,
    }) as any,
}));

describe("updateUser", () => {
  const mockData: UpdateUserData & { id: string; roles?: UserRole[] } = {
    id: "user-id",
    businessId: "business-id",
    fullName: "Test User",
    email: "user@example.com",
    companyPosition: "Manager",
    role: "business_admin",
    roles: [{ business_id: "123", role: "super_admin" }],
    businessName: "Test",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when API responds with 200", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "User updated successfully.",
      }),
    });

    const result = await updateUser(mockData);

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
      method: "PUT",
      headers: expect.objectContaining({
        Authorization: "mock-token",
        "Content-Type": "application/json",
        "x-api-key": expect.any(String),
      }),
      body: JSON.stringify({
        user_id: mockData.id,
        business_id: mockData.businessId,
        user_full_name: mockData.fullName,
        user_email: mockData.email,
        company_position: mockData.companyPosition,
        user_role: mockData.role,
        roles: mockData.roles,
      }),
    });

    expect(result).toEqual({
      success: true,
      message: "User updated successfully.",
    });
  });

  it("should return failure on API error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Something went wrong",
      }),
    });

    const result = await updateUser(mockData);

    expect(result).toEqual({
      success: false,
      message: "Something went wrong",
    });
  });

  it("should return failure on fetch exception", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await updateUser(mockData);

    expect(result).toEqual({
      success: false,
      message: "Network error",
    });
  });
});
