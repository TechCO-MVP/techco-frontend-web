import { describe, it, expect, vi, beforeEach } from "vitest";
import { PUT } from "@/app/api/notification/status/route";

const mockFetch = vi.fn();
const mockGetCookie = vi.fn();

vi.stubGlobal("fetch", mockFetch);

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockGetCookie,
  }),
}));

const createRequest = (body: object) =>
  new Request("http://localhost/api/notification/status", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

describe("PUT /api/notification/status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if token is missing", async () => {
    mockGetCookie.mockReturnValue(undefined);

    const req = createRequest({ notification_id: "123", status: "READ" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized: Missing token");
  });

  it("returns 400 if JSON is invalid", async () => {
    mockGetCookie.mockReturnValue({ value: "token" });

    const req = new Request("http://localhost/api/notification/status", {
      method: "PUT",
      body: "invalid-json",
    });

    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid JSON body");
  });

  it("returns 400 if required fields are missing", async () => {
    mockGetCookie.mockReturnValue({ value: "token" });

    const req = createRequest({ notification_id: "123" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Missing required fields");
  });

  it("returns 400 if status is invalid", async () => {
    mockGetCookie.mockReturnValue({ value: "token" });

    const req = createRequest({ notification_id: "123", status: "INVALID" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain("Invalid status");
  });

  it("returns 200 on successful update", async () => {
    mockGetCookie.mockReturnValue({ value: "token" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Updated successfully" }),
    });

    const req = createRequest({ notification_id: "123", status: "READ" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("Updated successfully");
  });

  it("returns error if update fails", async () => {
    mockGetCookie.mockReturnValue({ value: "token" });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: async () => ({ message: "Access denied" }),
    });

    const req = createRequest({ notification_id: "123", status: "READ" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.message.message).toBe("Access denied");
  });

  it("returns 500 if fetch throws", async () => {
    mockGetCookie.mockReturnValue({ value: "token" });

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const req = createRequest({ notification_id: "123", status: "READ" });
    const res = await PUT(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});
