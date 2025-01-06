"use server";

import { OTPFormData } from "@/lib/schemas";
import { cookies } from "next/headers";

import { apiEndpoints } from "@/lib/api-endpoints";

interface SignInResponse {
  success: boolean;
  message?: string;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
}
export async function verifyCode(data: OTPFormData): Promise<SignInResponse> {
  try {
    const response = await fetch(apiEndpoints.verifyOtpCode(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
      },
      body: JSON.stringify({
        email: data.email,
        session: data.session,
        otp: data.code,
      }),
    });

    const result = await response.json();

    if (result.accessToken) {
      const cookieStore = await cookies();

      cookieStore.set("idToken", result.idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60,
      });

      cookieStore.set("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60,
      });

      cookieStore.set("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
      });

      return {
        success: true,
        message: result?.message,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        idToken: result.idToken,
      };
    }

    return {
      success: false,
      message: result?.message || "Unexpected response from server.",
    };
  } catch (error: unknown) {
    console.error("Verify Token Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
