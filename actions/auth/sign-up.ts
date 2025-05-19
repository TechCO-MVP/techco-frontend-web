"use server";

import { SignUpFormData } from "@/lib/schemas";
import { apiEndpoints } from "@/lib/api-endpoints";

interface SignUpResponse {
  success: boolean;
  message?: string;
  data?: {
    UserConfirmed: boolean;
    UserSub: string;
  };
}

export async function signUp(data: SignUpFormData): Promise<SignUpResponse> {
  try {
    const response = await fetch(apiEndpoints.signUp(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
      },
      body: JSON.stringify({
        email: data.email,
        full_name: data.full_name,
      }),
    });

    const result = await response.json();

    if (response.status === 200) {
      return {
        success: true,
        message: result?.message,
        data: {
          UserConfirmed: result.body.UserConfirmed,
          UserSub: result.body.UserSub,
        },
      };
    }

    return {
      success: false,
      message:
        result?.error || result?.message || "Unexpected response from server.",
    };
  } catch (error: unknown) {
    console.error("Sign-Up Error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
