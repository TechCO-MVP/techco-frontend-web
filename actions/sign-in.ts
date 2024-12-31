"use server";

import { SignInFormData } from "@/lib/schemas";
import { apiEndpoints } from "@/lib/api-endpoints";

interface SignInResponse {
  success: boolean;
  message?: string;
  session?: string;
}
export async function signIn(data: SignInFormData): Promise<SignInResponse> {
  try {
    const response = await fetch(apiEndpoints.startAuth(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
      },
      body: JSON.stringify({ email: data.email }),
    });

    const result = await response.json();

    if (result.body?.session) {
      return {
        success: true,
        message: result?.message,
        session: result.body.session,
      };
    }

    return {
      success: false,
      message: result?.message || "Unexpected response from server.",
    };
  } catch (error: unknown) {
    console.error("Sign-In Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
