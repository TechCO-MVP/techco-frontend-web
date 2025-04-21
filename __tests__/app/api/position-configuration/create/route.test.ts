import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "@/app/api/position-configuration/create/route";

const mockFetch = vi.fn();
const mockGetCookie = vi.fn();

vi.stubGlobal("fetch", mockFetch);

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockGetCookie,
  }),
}));

const createRequest = (body: object) =>
  new Request("http://localhost/api/position-configuration/create", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

describe("POST /api/position-configuration/create", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, SERVERLESS_URL: "http://mock-api" };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 401 if token is missing", async () => {
    mockGetCookie.mockReturnValue(undefined);

    const req = createRequest({ some: "data" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized: Missing token");
  });

  it("returns 200 if creation succeeds", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    const mockResponse = { success: true };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const req = createRequest({ name: "test" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockResponse);
  });

  it("returns 500 if fetch throws", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const req = createRequest({ name: "test" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });

  it("returns correct error if fetch response is not ok", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Invalid input" }),
    });

    const req = createRequest({ name: "bad data" });
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid input");
  });

  it("uses empty string as x-api-key if API_KEY is undefined", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    delete process.env.API_KEY;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const req = createRequest({ name: "test" });
    await POST(req);

    const fetchHeaders = mockFetch.mock.calls[0][1]?.headers;
    expect(fetchHeaders["x-api-key"]).toBe("");
  });
});
