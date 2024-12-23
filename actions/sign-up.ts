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
      body: JSON.stringify({ email: data.email, name: data.email }),
    });

    const result = await response.json();

    if (result.statusCode === 200) {
      return {
        success: true,
        message: result.body.message,
        data: {
          UserConfirmed: result.body.data.UserConfirmed,
          UserSub: result.body.data.UserSub,
        },
      };
    }

    return {
      success: false,
      message: result.body?.message || "Unexpected response from server.",
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
