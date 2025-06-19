import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/hiring-process/route"; // Update to correct path if different

const mockFetch = vi.fn();
const mockGetCookie = vi.fn();

vi.stubGlobal("fetch", mockFetch);

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockGetCookie,
  }),
}));

describe("GET /api/hiring-process", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (query: string) =>
    new Request(`http://localhost/api/hiring-process${query}`);

  it("returns 401 if no token is found", async () => {
    mockGetCookie.mockReturnValue(undefined);

    const req = createRequest("?hiring_process_id=123");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized: Missing token");
  });

  it("returns 400 if hiring_process_id is missing", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    const req = createRequest(""); // no query param
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe(
      "Missing required query parameter: hiring_process_id",
    );
  });

  it("returns 200 with data when fetch succeeds", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Success",
        body: {
          data: {
            position_country: "Spain",
            position_city: "Barcelona",
            position_status: "ACTIVE",
            recruiter_id: "r123",
            recruiter_name: "Ana",
            owner_id: "o123",
            owner_name: "Carlos",
            stakeholders: [],
          },
        },
      }),
    });

    const req = createRequest("?hiring_process_id=123");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.body.data.position_city).toBe("Barcelona");
    expect(json.message).toBe("Success");
  });

  it("returns 500 if body is missing in response", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "No body",
      }),
    });

    const req = createRequest("?hiring_process_id=123");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Unexpected API response format");
  });

  it("returns fetch error message if response is not ok", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: async () => ({
        message: "Access denied",
      }),
    });

    const req = createRequest("?hiring_process_id=123");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.error).toContain("Failed to fetch data");
    expect(json.message.message).toBe("Access denied");
  });

  it("returns 500 if fetch throws", async () => {
    mockGetCookie.mockReturnValue({ value: "mock-token" });

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const req = createRequest("?hiring_process_id=123");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});
