import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";

describe("Middleware", () => {
  const mockRequest = (url: string, headers: Record<string, string> = {}) =>
    new NextRequest(new URL(url, "http://localhost:3000"), {
      headers: new Headers(headers),
    });

  it("should redirect to default locale if no locale is in the pathname", async () => {
    const request = mockRequest("/", { "accept-language": "en" });
    const response = await middleware(request);

    expect(response?.status).toBe(307); // Redirect
    const locationHeader = response?.headers.get("location");
    expect(new URL(locationHeader!).pathname).toBe("/en/");
  });

  it("should not redirect if the pathname includes a supported locale", async () => {
    const request = mockRequest("/en/signin");
    const response = await middleware(request);

    expect(response).toBeUndefined();
  });

  it("should handle unsupported locales gracefully", async () => {
    const request = mockRequest("dashboard", { "accept-language": "fr" });
    const response = await middleware(request);

    const locationHeader = response?.headers.get("location");
    expect(new URL(locationHeader!).pathname).toBe("/es/dashboard");
  });

  it("should redirect correctly for a pathname without leading slash", async () => {
    const request = mockRequest("dashboard", { "accept-language": "es" });
    const response = await middleware(request);

    expect(response?.status).toBe(307);
    const locationHeader = response?.headers.get("location");
    expect(new URL(locationHeader!).pathname).toBe("/es/dashboard");
  });
});
