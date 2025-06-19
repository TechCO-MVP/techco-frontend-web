import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/notification/create/route";

const mockFetch = vi.fn();
const mockGetCookie = vi.fn();

vi.stubGlobal("fetch", mockFetch);

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockGetCookie,
  }),
}));

const createRequest = (body: object) =>
  new Request("http://localhost/api/notification/create", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

describe("POST /api/notification/create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if token is missing", async () => {
    mockGetCookie.mockReturnValue(undefined);

    const req = createRequest({
      user_id: "123",
      business_id: "456",
      message: "Hello",
      notification_type: "PHASE_CHANGE",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe("Unauthorized: Missing token");
  });

  it("returns 400 if JSON is invalid", async () => {
    mockGetCookie.mockReturnValue({ value: "token" });

    const req = new Request("http://localhost/api/notification/create", {
      method: "POST",
      body: "invalid-json",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid JSON body");
  });

  it("returns 400 if required fields are missing", async () => {
    mockGetCookie.mockReturnValue({ value: "token" });

    const req = createRequest({ user_id: "123" }); // missing fields
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain(
      "Missing required fields: user_id, business_id, message, notification_type",
    );
  });

  it("returns 200 on success", async () => {
    mockGetCookie.mockReturnValue({ value: "token" });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Notification created" }),
    });

    const req = createRequest({
      user_id: "123",
      business_id: "456",
      message: "Test notification",
      notification_type: "PHASE_CHANGE",
      hiring_process_id: "789",
      phase_id: "321",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe("Notification created");
  });

  it("returns error if fetch fails", async () => {
    mockGetCookie.mockReturnValue({ value: "token" });

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
      json: async () => ({ message: "Access denied" }),
    });

    const req = createRequest({
      user_id: "123",
      business_id: "456",
      message: "Test",
      notification_type: "PHASE_CHANGE",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.message.message).toBe("Access denied");
  });

  it("returns 500 on network error", async () => {
    mockGetCookie.mockReturnValue({ value: "token" });

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const req = createRequest({
      user_id: "123",
      business_id: "456",
      message: "Test",
      notification_type: "PHASE_CHANGE",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Internal server error");
  });
});
