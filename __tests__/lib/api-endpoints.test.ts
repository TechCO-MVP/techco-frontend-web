import { describe, it, expect, beforeAll } from "vitest";
import { apiEndpoints } from "@/lib/api-endpoints";

describe("apiEndpoints helper", () => {
  const baseUrl = process.env.SERVERLESS_URL;

  const endpointsToTest: {
    key: keyof typeof apiEndpoints;
    expectedPath: string;
    args?: unknown[];
  }[] = [
    {
      key: "verifyOtpCodeSignUp",
      expectedPath: "/auth/verify_auth_otp_code_signup",
    },
    { key: "signUp", expectedPath: "/auth/signup" },
    { key: "getNotifications", expectedPath: "/notification/list" },
    { key: "signOut", expectedPath: "/auth/sign_out" },
    { key: "startAuth", expectedPath: "/auth/start_auth" },
    { key: "verifyOtpCode", expectedPath: "/auth/verify_auth_otp_code" },
    { key: "createBusiness", expectedPath: "/business/create" },
    { key: "listBusiness", expectedPath: "/business/list" },
    { key: "listUsers", expectedPath: "/user/list" },
    { key: "listPositions", expectedPath: "/position/list" },
    { key: "getHiringProcess", expectedPath: "/hiring_process/id" },
    { key: "createUser", expectedPath: "/user/create" },
    { key: "updateUser", expectedPath: "/user/data" },
    { key: "updateUserStatus", expectedPath: "/user/status" },
    { key: "updatePositionStatus", expectedPath: "/position/status" },
    { key: "refreshTokens", expectedPath: "/auth/refresh_tokens" },
    { key: "getProfileFilterStatus", expectedPath: "/profile/filter" },
    { key: "updateNotificationStatus", expectedPath: "/notification/status" },
    {
      key: "updateBusiness",
      expectedPath: "/business/update/123",
      args: ["123"],
    },
    {
      key: "positionDetails",
      expectedPath: "/position/token?token=abc123",
      args: ["abc123"],
    },
  ];

  for (const { key, expectedPath, args = [] } of endpointsToTest) {
    it(`should return the correct URL for ${key}`, () => {
      const fn = apiEndpoints[key] as (...args: unknown[]) => string;
      const result = fn(...args);
      expect(result).toBe(`${baseUrl}${expectedPath}`);
    });
  }
});
