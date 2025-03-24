import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/user/list/route";
import { apiEndpoints } from "@/lib/api-endpoints";

const mockFetch = vi.fn();
const mockGetCookie = vi.fn();

vi.stubGlobal("fetch", mockFetch);

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: mockGetCookie,
  })),
}));

describe("GET /api/user", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if the token is missing", async () => {
    mockGetCookie.mockReturnValueOnce(undefined);

    const request = new Request(
      "http://localhost:3000/api/user?business_id=123",
    );
    const response = await GET(request);

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({
      error: "Unauthorized: Missing token",
    });
  });

  it("should return 400 if business_id is missing", async () => {
    mockGetCookie.mockReturnValueOnce({ value: "mock-token" });

    const request = new Request("http://localhost:3000/api/user");
    const response = await GET(request);

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toEqual({
      error: "Missing required query parameter: business_id",
    });
  });

  it("should fetch and return user data successfully", async () => {
    mockGetCookie.mockReturnValueOnce({ value: "mock-token" });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        body: {
          data: [{ id: "1", name: "User 1" }],
        },
      }),
    });

    const request = new Request(
      "http://localhost:3000/api/user?business_id=123",
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({
      body: {
        data: [{ id: "1", name: "User 1" }],
      },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${apiEndpoints.listUsers()}?business_id=123`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? "",
          Authorization: "Bearer mock-token",
        },
      },
    );
  });

  it("should handle API errors gracefully", async () => {
    mockGetCookie.mockReturnValueOnce({ value: "mock-token" });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "Server error" }),
    });

    const request = new Request(
      "http://localhost:3000/api/user?business_id=123",
    );
    const response = await GET(request);

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json).toEqual({
      error: "Failed to fetch data: Internal Server Error",
      message: { message: "Server error" },
      status: 500,
    });
  });

  it("should handle unexpected API response formats", async () => {
    mockGetCookie.mockReturnValueOnce({ value: "mock-token" });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        body: {},
      }),
    });

    const request = new Request(
      "http://localhost:3000/api/user?business_id=123",
    );
    const response = await GET(request);

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json).toEqual({
      error: "Unexpected API response format",
    });
  });

  it("should handle unexpected errors gracefully", async () => {
    mockGetCookie.mockReturnValueOnce({ value: "mock-token" });
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const request = new Request(
      "http://localhost:3000/api/user?business_id=123",
    );
    const response = await GET(request);

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json).toEqual({
      error: "Internal server error",
    });
  });
});
