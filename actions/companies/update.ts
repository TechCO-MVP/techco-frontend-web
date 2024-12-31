"use server";

import { CompanyDetailsData } from "@/lib/schemas";
import { apiEndpoints } from "@/lib/api-endpoints";

interface UpdateResponse {
  success: boolean;
  message?: string;
}

export async function updateCompanyAction(
  data: CompanyDetailsData,
): Promise<UpdateResponse> {
  try {
    const response = await fetch(apiEndpoints.updateCompany(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
      },
      body: JSON.stringify(data),
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
