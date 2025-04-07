import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { GET } from "@/app/api/current-user/route";
import { NextResponse } from "next/server";
import { decodeToken } from "@/lib/utils";
// Create mocks
const mockGet = vi.fn();

// Stub external modules
vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockGet,
  }),
}));

vi.mock("@/lib/utils", () => ({
  decodeToken: vi.fn(),
}));

describe("GET /api/user/me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if token is missing", async () => {
    mockGet.mockReturnValue(undefined); // No token

    const response = await GET();
    const json = await response.json();

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(401);
    expect(json).toEqual({ error: "Unauthorized: Missing token" });
  });

  it("should return user info when token is valid", async () => {
    mockGet.mockReturnValue({ value: "mock-token" });

    (decodeToken as Mock).mockReturnValue({
      name: "John Doe",
      email: "john@example.com",
    });

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({
      body: {
        user: {
          name: "John Doe",
          email: "john@example.com",
        },
      },
    });
    expect(decodeToken as Mock).toHaveBeenCalledWith("mock-token");
  });
});
