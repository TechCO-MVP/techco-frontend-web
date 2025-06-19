import { describe, it, expect, vi, beforeEach } from "vitest";
import { signOut } from "@/actions";

const mockDeleteCookie = vi.fn();
const mockFetch = vi.fn();

vi.stubGlobal("fetch", mockFetch);
vi.mock("next/headers", () => ({
  cookies: () => ({
    delete: mockDeleteCookie,
    get: vi.fn().mockReturnValue({ value: "mock-token" }),
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("signOut Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete cookies and redirect to the sign-in page", async () => {
    const formData = new FormData();
    formData.append("lang", "en");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Sign-out successful!",
      }),
    });
    await signOut(formData);

    // Assertions for deleting cookies
    expect(mockDeleteCookie).toHaveBeenCalledWith("idToken");
    expect(mockDeleteCookie).toHaveBeenCalledWith("accessToken");
    expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken");
  });

  it("should handle cases where lang is not provided", async () => {
    const formData = new FormData(); // No "lang" key
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Sign-out successful!",
      }),
    });
    await signOut(formData);

    // Assertions for deleting cookies
    expect(mockDeleteCookie).toHaveBeenCalledWith("idToken");
    expect(mockDeleteCookie).toHaveBeenCalledWith("accessToken");
    expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken");
  });
});
