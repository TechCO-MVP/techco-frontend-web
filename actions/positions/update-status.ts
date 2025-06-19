"use server";

import { UpdatePositionStatusData } from "@/types";
import { apiEndpoints } from "@/lib/api-endpoints";
import { cookies } from "next/headers";

interface UpdatePositionStatusResponse {
  success: boolean;
  message: string;
}

export async function updatePositionStatus(
  data: UpdatePositionStatusData,
): Promise<UpdatePositionStatusResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("idToken")?.value;
    const response = await fetch(apiEndpoints.updatePositionStatus(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        user_id: data.userId,
        position_status: data.status,
        position_id: data.positionId,
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
