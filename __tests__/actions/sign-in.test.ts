import { describe, it, expect, vi, beforeEach } from "vitest";
import { signIn } from "@/actions";
import { SignInFormData } from "@/lib/schemas";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const mockData: SignInFormData = {
  email: "test@example.com",
};

describe("signIn Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return success when the API responds with a valid session", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        session: "mock-session-token",
        message: "Sign-in successful!",
      }),
    });

    const response = await signIn(mockData);

    expect(response).toEqual({
      success: true,
      message: "Sign-in successful!",
      session: "mock-session-token",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.SERVERLESS_URL}/start_auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? "",
        },
        body: JSON.stringify({
          email: mockData.email,
        }),
      },
    );
  });

  it("should return an error if the API responds without a session", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        message: "Invalid email or password",
      }),
    });

    const response = await signIn(mockData);

    expect(response).toEqual({
      success: false,
      message: "Invalid email or password",
    });
  });

  it("should return a generic error if the API response lacks a message", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({}), // No session, no message
    });

    const response = await signIn(mockData);

    expect(response).toEqual({
      success: false,
      message: "Unexpected response from server.",
    });
  });

  it("should return an error when fetch throws an exception", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const response = await signIn(mockData);

    expect(response).toEqual({
      success: false,
      message: "Network error",
    });
  });
});
