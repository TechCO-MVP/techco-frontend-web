import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateUserStatus } from "@/actions";
import { UpdateUserStatusData } from "@/types";

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

vi.mock("next/headers", () => ({
  cookies: () =>
    ({
      get: (key: string) =>
        key === "idToken" ? { value: "mock-token" } : undefined,
    }) as any,
}));

describe("updateUserStatus", () => {
  const mockData: UpdateUserStatusData = {
    id: "user-id",
    email: "user@example.com",
    status: "disabled",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when API responds with 200", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "User status updated successfully.",
      }),
    });

    const result = await updateUserStatus(mockData);

    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: "PUT",
      headers: expect.objectContaining({
        Authorization: "mock-token",
        "Content-Type": "application/json",
        "x-api-key": expect.any(String),
      }),
      body: JSON.stringify({
        user_id: mockData.id,
        user_status: mockData.status,
        user_email: mockData.email,
      }),
    });

    expect(result).toEqual({
      success: true,
      message: "User status updated successfully.",
    });
  });

  it("should return failure on API error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Something went wrong",
      }),
    });

    const result = await updateUserStatus(mockData);

    expect(result).toEqual({
      success: false,
      message: "Something went wrong",
    });
  });

  it("should return failure on fetch exception", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await updateUserStatus(mockData);

    expect(result).toEqual({
      success: false,
      message: "Network error",
    });
  });
});
