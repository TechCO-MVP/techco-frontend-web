"use server";

import { UpdateUserStatusData } from "@/types";
import { apiEndpoints } from "@/lib/api-endpoints";
import { cookies } from "next/headers";

interface UpdateUserStatusResponse {
  success: boolean;
  message: string;
}

export async function updateUserStatus(
  data: UpdateUserStatusData,
): Promise<UpdateUserStatusResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("idToken")?.value;
    const response = await fetch(apiEndpoints.updateUserStatus(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        user_id: data.id,
        user_status: data.status,
        user_email: data.email,
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
