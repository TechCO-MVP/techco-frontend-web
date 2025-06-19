import { GET } from "@/app/api/profile/filter/route";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
const mockCookieGet = vi.fn();

vi.stubGlobal("fetch", mockFetch);
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockCookieGet,
  }),
}));

describe("GET /api/profile-filter-status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if no token is present", async () => {
    mockCookieGet.mockReturnValue(undefined);

    const req = new Request("http://localhost/api/profile-filter-status");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized: Missing token");
  });

  it("returns 400 if position_id is missing", async () => {
    mockCookieGet.mockReturnValue({ value: "mock-token" });

    const req = new Request("http://localhost/api/profile-filter-status");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing required query parameter: position_id");
  });

  it("returns 500 if API response format is invalid", async () => {
    mockCookieGet.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ body: null }),
    });

    const req = new Request(
      "http://localhost/api/profile-filter-status?position_id=123",
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Unexpected API response format");
  });

  it("returns successful data response", async () => {
    const mockData = {
      body: {
        filter_status: "REVIEWED",
      },
    };

    mockCookieGet.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const req = new Request(
      "http://localhost/api/profile-filter-status?position_id=123",
    );

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockData);
  });

  it("returns error when fetch response is not ok", async () => {
    mockCookieGet.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: async () => ({ message: "Access denied" }),
    });

    const req = new Request(
      "http://localhost/api/profile-filter-status?position_id=123",
    );

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toBe("Failed to fetch data: Forbidden");
    expect(json.message).toEqual({ message: "Access denied" });
  });

  it("returns 500 when fetch throws an exception", async () => {
    mockCookieGet.mockReturnValue({ value: "mock-token" });

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const req = new Request(
      "http://localhost/api/profile-filter-status?position_id=123",
    );

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});
