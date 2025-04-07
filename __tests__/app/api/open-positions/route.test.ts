import { GET } from "@/app/api/open-positions/route";
import { apiEndpoints } from "@/lib/api-endpoints";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
const mockCookieGet = vi.fn();

vi.stubGlobal("fetch", mockFetch);

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockCookieGet,
  }),
}));

describe("GET /api/open-positions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if token is missing", async () => {
    mockCookieGet.mockReturnValue(undefined);
    const req = new Request("http://localhost/api/open-positions");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized: Missing token");
  });

  it("should return 400 if business_id is missing", async () => {
    mockCookieGet.mockReturnValue({ value: "mock-token" });
    const req = new Request("http://localhost/api/open-positions");

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing required query parameter: business_id");
  });

  it("should return 500 on unexpected format", async () => {
    mockCookieGet.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ body: null }),
    });

    const req = new Request(
      "http://localhost/api/open-positions?business_id=123",
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Unexpected API response format");
  });

  it("should return data successfully", async () => {
    const mockData = { body: { data: [{ id: "1", title: "Position A" }] } };

    mockCookieGet.mockReturnValue({ value: "mock-token" });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const req = new Request(
      "http://localhost/api/open-positions?business_id=123",
    );

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockData);
  });

  it("should return error when fetch fails", async () => {
    mockCookieGet.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "Server error" }),
    });

    const req = new Request(
      "http://localhost/api/open-positions?business_id=123",
    );

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to fetch data: Internal Server Error");
    expect(json.message).toEqual({ message: "Server error" });
  });

  it("should return 500 if fetch throws", async () => {
    mockCookieGet.mockReturnValue({ value: "mock-token" });

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const req = new Request(
      "http://localhost/api/open-positions?business_id=123",
    );

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});
