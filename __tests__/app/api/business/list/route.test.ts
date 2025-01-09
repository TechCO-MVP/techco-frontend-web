import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/business/list/route";
import { cookies } from "next/headers";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/api-endpoints", () => ({
  apiEndpoints: {
    listBusiness: vi.fn(() => "https://api.example.com/business"),
  },
}));

describe("GET Function", () => {
  const mockCookies = cookies as ReturnType<typeof vi.fn>;
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  it("should return 401 if no token is present", async () => {
    mockCookies.mockReturnValueOnce({
      get: vi.fn().mockReturnValue(undefined),
    });

    const request = new Request("https://localhost");
    const response = await GET(request);

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({ error: "Unauthorized: Missing token" });
  });

  it("should return 500 if API response format is invalid", async () => {
    mockCookies.mockReturnValueOnce({
      get: vi.fn().mockReturnValue({ value: "mock-token" }),
    });

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({ body: "invalid-format" }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as any);

    const request = new Request("https://localhost");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json).toEqual({ error: "Unexpected API response format" });
  });

  it("should return the API response if successful", async () => {
    mockCookies.mockReturnValueOnce({
      get: vi.fn().mockReturnValue({ value: "mock-token" }),
    });

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue({
        body: [{ id: 1, name: "Business 1" }],
      }),
    };
    mockFetch.mockResolvedValueOnce(mockResponse as any);

    const request = new Request("https://localhost");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({
      body: [{ id: 1, name: "Business 1" }],
    });
  });

  it("should return the correct error response if API call fails", async () => {
    mockCookies.mockReturnValueOnce({
      get: vi.fn().mockReturnValue({ value: "mock-token" }),
    });

    const mockResponse = {
      ok: false,
      status: 403,
      statusText: "Forbidden",
    };
    mockFetch.mockResolvedValueOnce(mockResponse as any);

    const request = new Request("https://localhost");
    const response = await GET(request);

    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json).toEqual({
      error: "Failed to fetch data: Forbidden",
      status: 403,
    });
  });

  it("should return 500 if an exception occurs", async () => {
    mockCookies.mockReturnValueOnce({
      get: vi.fn().mockReturnValue({ value: "mock-token" }),
    });

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const request = new Request("https://localhost");
    const response = await GET(request);

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json).toEqual({ error: "Internal server error" });
  });
});
