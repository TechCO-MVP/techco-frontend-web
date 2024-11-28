import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";

describe("Middleware", () => {
  const mockRequest = (url: string, headers: Record<string, string> = {}) =>
    new NextRequest(new URL(url, "http://localhost:3000"), {
      headers: new Headers(headers),
    });

  it("should redirect to default locale if no locale is in the pathname", () => {
    const request = mockRequest("/", { "accept-language": "en" });
    const response = middleware(request);

    expect(response?.status).toBe(307); // Redirect
    const locationHeader = response?.headers.get("location");
    expect(new URL(locationHeader!).pathname).toBe("/en/");
  });

  it("should not redirect if the pathname includes a supported locale", () => {
    const request = mockRequest("/en");
    const response = middleware(request);

    expect(response).toBeUndefined();
  });

  it("should handle unsupported locales gracefully", () => {
    const request = mockRequest("dashboard", { "accept-language": "fr" });
    const response = middleware(request);

    const locationHeader = response?.headers.get("location");
    expect(new URL(locationHeader!).pathname).toBe("/es/dashboard");
  });

  it("should redirect correctly for a pathname without leading slash", () => {
    const request = mockRequest("dashboard", { "accept-language": "es" });
    const response = middleware(request);

    expect(response?.status).toBe(307);
    const locationHeader = response?.headers.get("location");
    expect(new URL(locationHeader!).pathname).toBe("/es/dashboard");
  });
});
