import { describe, it, expect, vi, beforeEach } from "vitest";
import { updatePositionStatus } from "@/actions";
import { UpdatePositionStatusData } from "@/types";

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

describe("updatePositionStatus", () => {
  const mockData: UpdatePositionStatusData = {
    userId: "user-123",
    positionId: "position-456",
    status: "ACTIVE",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when API responds with 200", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Status updated successfully.",
      }),
    });

    const result = await updatePositionStatus(mockData);

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
      method: "PUT",
      headers: expect.objectContaining({
        "Content-Type": "application/json",
        "x-api-key": expect.any(String),
        Authorization: "mock-token",
      }),
      body: JSON.stringify({
        user_id: mockData.userId,
        position_status: mockData.status,
        position_id: mockData.positionId,
      }),
    });

    expect(result).toEqual({
      success: true,
      message: "Status updated successfully.",
    });
  });

  it("should return failure on API error response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: "Invalid position ID",
      }),
    });

    const result = await updatePositionStatus(mockData);

    expect(result).toEqual({
      success: false,
      message: "Invalid position ID",
    });
  });

  it("should return failure on fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await updatePositionStatus(mockData);

    expect(result).toEqual({
      success: false,
      message: "Network error",
    });
  });
});
