import { describe, it, expect, vi, beforeEach } from "vitest";
import { PUT } from "@/app/api/position-configuration/update/route";

const mockFetch = vi.fn();
const mockGetCookie = vi.fn();

vi.stubGlobal("fetch", mockFetch);

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockGetCookie,
  }),
}));

const createRequest = (body: object) =>
  new Request("http://localhost/api/position-configuration/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("PUT /api/position-configuration/update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SERVERLESS_URL = "https://mock-api.com";
    process.env.API_KEY = "test-api-key";
  });

  it("returns 401 if token is missing", async () => {
    mockGetCookie.mockReturnValue(undefined);

    const req = createRequest({ _id: "abc" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized: Missing token");
  });

  it("returns 200 if update succeeds", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    const mockResponse = { message: "Updated successfully" };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const reqBody = { _id: "abc", status: "COMPLETED" };
    const req = createRequest(reqBody);
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual(mockResponse);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://mock-api.com/position_configuration/update",
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "x-api-key": "test-api-key",
          Authorization: "Bearer mock-token",
        }),
        body: JSON.stringify(reqBody),
      }),
    );
  });

  it("returns custom error if fetch fails", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "Invalid data" }),
    });

    const req = createRequest({ _id: "bad" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid data");
  });

  it("returns 500 if fetch throws", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const req = createRequest({ _id: "abc" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });

  it("falls back to default error message if json.error is missing", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({}), // <-- No error field
    });

    const req = createRequest({ _id: "abc" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Failed to update position configuration");
  });

  it("uses empty string as x-api-key if API_KEY is undefined", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    const originalApiKey = process.env.API_KEY;
    delete process.env.API_KEY;

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const req = createRequest({ _id: "abc" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);

    const fetchHeaders = mockFetch.mock.calls[0][1]?.headers;
    expect(fetchHeaders["x-api-key"]).toBe("");

    process.env.API_KEY = originalApiKey; // restore
  });
});
