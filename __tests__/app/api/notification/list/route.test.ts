import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/notification/list/route";

const mockFetch = vi.fn();
const mockGetCookie = vi.fn();

vi.stubGlobal("fetch", mockFetch);

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockGetCookie,
  }),
}));

describe("GET /api/notification/list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = () =>
    new Request("http://localhost/api/notification/list");

  it("should return 401 if token is missing", async () => {
    mockGetCookie.mockReturnValue(undefined);

    const res = await GET(createRequest());
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized: Missing token");
  });

  it("should return 200 with notifications when fetch succeeds", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Success",
        body: {
          data: [
            { id: "notif-1", message: "You have a new message" },
            { id: "notif-2", message: "Your job was posted" },
          ],
        },
      }),
    });

    const res = await GET(createRequest());
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(json.body.data)).toBe(true);
    expect(json.body.data.length).toBe(2);
  });

  it("should return 500 if body is missing or not an array", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Invalid format",
        body: { data: null },
      }),
    });

    const res = await GET(createRequest());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Unexpected API response format");
  });

  it("should return error if response is not ok", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: async () => ({
        message: "Access denied",
      }),
    });

    const res = await GET(createRequest());
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toContain("Failed to fetch data");
    expect(json.message.message).toBe("Access denied");
  });

  it("should return 500 if fetch throws", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const res = await GET(createRequest());
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});
