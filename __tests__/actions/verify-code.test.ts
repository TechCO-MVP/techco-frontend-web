import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyCode } from "@/actions";
import { OTPFormData } from "@/lib/schemas";

const mockFetch = vi.fn();
const mockSetCookie = vi.fn();

vi.stubGlobal("fetch", mockFetch);
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    set: mockSetCookie,
  })),
}));

const mockData: OTPFormData = {
  email: "test@example.com",
  session: "mock-session-token",
  code: "123456",
};

describe("verifyCode Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success and set cookies when API responds with access token", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        accessToken: "mock-access-token",
        idToken: "mock-id-token",
        refreshToken: "mock-refresh-token",
        message: "Code verified successfully!",
      }),
    });

    const response = await verifyCode(mockData);

    expect(response).toEqual({
      success: true,
      message: "Code verified successfully!",
      accessToken: "mock-access-token",
      idToken: "mock-id-token",
      refreshToken: "mock-refresh-token",
    });

    expect(mockSetCookie).toHaveBeenCalledWith("idToken", "mock-id-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
    });

    expect(mockSetCookie).toHaveBeenCalledWith(
      "accessToken",
      "mock-access-token",
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      },
    );

    expect(mockSetCookie).toHaveBeenCalledWith(
      "refreshToken",
      "mock-refresh-token",
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      },
    );
  });

  it("should return an error if the API responds without an access token", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        message: "Invalid OTP code",
      }),
    });

    const response = await verifyCode(mockData);

    expect(response).toEqual({
      success: false,
      message: "Invalid OTP code",
    });

    expect(mockSetCookie).not.toHaveBeenCalled();
  });

  it("should return a generic error if the API response lacks a message", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({}), // No tokens, no message
    });

    const response = await verifyCode(mockData);

    expect(response).toEqual({
      success: false,
      message: "Unexpected response from server.",
    });

    expect(mockSetCookie).not.toHaveBeenCalled();
  });

  it("should return an error when fetch throws an exception", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const response = await verifyCode(mockData);

    expect(response).toEqual({
      success: false,
      message: "Network error",
    });

    expect(mockSetCookie).not.toHaveBeenCalled();
  });
});
