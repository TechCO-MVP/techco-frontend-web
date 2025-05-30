"use server";

import { OTPFormData } from "@/lib/schemas";
import { cookies } from "next/headers";
import { SignUpState } from "@/lib/store/features/auth/auth";
import { apiEndpoints } from "@/lib/api-endpoints";
import { countryCodeLookup } from "@/lib/utils";

interface SignInResponse {
  success: boolean;
  message?: string;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
}

export async function verifyCodeSignUp(
  data: OTPFormData & Partial<SignUpState>,
): Promise<SignInResponse> {
  try {
    const countryCode = countryCodeLookup(data.country ?? "colombia");

    const response = await fetch(apiEndpoints.verifyOtpCodeSignUp(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
      },
      body: JSON.stringify({
        email: data.email,
        session: data.session,
        otp: data.code,
        company_size: data.companySize,
        country_code: countryCode,
        company_name: data.company,
        company_position: data.role,
        full_name: data.fullName,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      const cookieStore = await cookies();

      cookieStore.set("idToken", result.body.idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });

      cookieStore.set("accessToken", result.body.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });

      cookieStore.set("refreshToken", result.body.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 5,
      });

      return {
        success: true,
        message: result?.message,
        accessToken: result.body.accessToken,
        refreshToken: result.body.refreshToken,
        idToken: result.body.idToken,
      };
    }

    return {
      success: false,
      message:
        result?.error || result?.message || "Unexpected response from server.",
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
