import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/position-configuration/list/route";

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock cookies
const mockGetCookie = vi.fn();
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockGetCookie,
  }),
}));

const createRequest = (params: Record<string, string> = {}) => {
  const query = new URLSearchParams(params).toString();
  return new Request(
    `http://localhost/api/position-configuration/list?${query}`,
  );
};

describe("GET /api/position-configuration/list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SERVERLESS_URL = "https://mock-server.com";
  });

  it("returns 401 if no access token", async () => {
    mockGetCookie.mockReturnValue(undefined);

    const req = createRequest();
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized: Missing token");
  });

  it("returns 500 if fetch throws", async () => {
    mockGetCookie.mockReturnValue({ value: "valid_token" });
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const req = createRequest({ business_id: "123" });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });

  it("returns error if response is not ok", async () => {
    mockGetCookie.mockReturnValue({ value: "valid_token" });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Bad Request" }),
    });

    const req = createRequest({ id: "123", business_id: "123" });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Bad Request");
  });

  it("returns 200 with data if successful", async () => {
    mockGetCookie.mockReturnValue({ value: "valid_token" });
    const mockResponse = { message: "OK", body: { data: [] } };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const req = createRequest({ id: "abc", all: "true", business_id: "123" });
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockResponse);

    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.searchParams.get("id")).toBe("abc");
    expect(url.searchParams.get("all")).toBe("true");
  });
});
