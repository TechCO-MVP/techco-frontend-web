import { describe, it, expect, vi, beforeEach } from "vitest";
import { signOut } from "@/actions";

const mockDeleteCookie = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => ({
    delete: mockDeleteCookie,
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

    await signOut(formData);

    // Assertions for deleting cookies
    expect(mockDeleteCookie).toHaveBeenCalledWith("idToken");
    expect(mockDeleteCookie).toHaveBeenCalledWith("accessToken");
    expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken");
  });

  it("should handle cases where lang is not provided", async () => {
    const formData = new FormData(); // No "lang" key

    await signOut(formData);

    // Assertions for deleting cookies
    expect(mockDeleteCookie).toHaveBeenCalledWith("idToken");
    expect(mockDeleteCookie).toHaveBeenCalledWith("accessToken");
    expect(mockDeleteCookie).toHaveBeenCalledWith("refreshToken");
  });
});
