import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateUserStatus } from "@/actions"; // Update path as necessary
import { UpdateUserStatusData } from "@/types";

const mockFetch = vi.fn();
const mockGetCookie = vi.fn();

vi.stubGlobal("fetch", mockFetch);
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: mockGetCookie,
  })),
}));

describe("updateUserStatus Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockData: UpdateUserStatusData = {
    id: "user-123",
    status: "enabled",
    email: "test@example.com",
  };

  it("should return success when API responds with success", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "User status updated successfully!",
      }),
    });

    const response = await updateUserStatus(mockData);

    expect(response).toEqual({
      success: true,
      message: "User status updated successfully!",
    });

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: "mock-token",
      },
      body: JSON.stringify({
        user_id: "user-123",
        user_status: "enabled",
        user_email: "test@example.com",
      }),
    });

    expect(mockGetCookie).toHaveBeenCalledWith("idToken");
  });

  it("should return an error if API request fails", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Failed to update user status",
      }),
    });

    const response = await updateUserStatus(mockData);

    expect(response).toEqual({
      success: false,
      message: "Failed to update user status",
    });

    expect(mockFetch).toHaveBeenCalled();
    expect(mockGetCookie).toHaveBeenCalled();
  });

  it("should return an error if API response is unexpected", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}), // No message or error key
    });

    const response = await updateUserStatus(mockData);

    expect(response).toEqual({
      success: false,
      message: "Unexpected response from server.",
    });

    expect(mockFetch).toHaveBeenCalled();
    expect(mockGetCookie).toHaveBeenCalled();
  });

  it("should return an error if an exception is thrown", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const response = await updateUserStatus(mockData);

    expect(response).toEqual({
      success: false,
      message: "Network error",
    });

    expect(mockFetch).toHaveBeenCalled();
    expect(mockGetCookie).toHaveBeenCalled();
  });
});
