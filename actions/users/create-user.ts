"use server";

import { CreateUserData } from "@/lib/schemas";
import { apiEndpoints } from "@/lib/api-endpoints";
import { cookies } from "next/headers";
import { User } from "@/types";

interface CreateResponse {
  success: boolean;
  message?: string;
  body?: {
    user: User;
  };
}

export async function createUser(
  data: CreateUserData,
): Promise<CreateResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("idToken")?.value;
    const response = await fetch(apiEndpoints.createUser(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        business_id: data.businessId,
        full_name: data.fullName,
        email: data.email,
        company_position: data.companyPosition,
        role: data.role,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: result?.message,
      };
    }

    return {
      success: false,
      message:
        result?.error || result?.message || "Unexpected response from server.",
    };
  } catch (error: unknown) {
    console.error("update error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unexpected error occurred",
    };
  }
}
