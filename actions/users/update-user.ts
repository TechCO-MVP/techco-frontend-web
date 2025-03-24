"use server";

import { UpdateUserData } from "@/lib/schemas";
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

export async function updateUser(
  data: UpdateUserData & { id: string },
): Promise<CreateResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("idToken")?.value;
    const response = await fetch(apiEndpoints.updateUser(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        user_id: data.id,
        business_id: data.businessId,
        user_full_name: data.fullName,
        user_email: data.email,
        company_position: data.companyPosition,
        user_role: data.role,
      }),
    });
    console.log("data", {
      user_id: data.id,
      business_id: data.businessId,
      user_full_name: data.fullName,
      user_email: data.email,
      company_position: data.companyPosition,
      user_role: data.role,
    });
    const result = await response.json();
    console.log("result", result);

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
