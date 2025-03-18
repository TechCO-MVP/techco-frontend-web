"use server";

import { CreateBusinessData } from "@/lib/schemas";
import { apiEndpoints } from "@/lib/api-endpoints";
import { cookies } from "next/headers";
import { countryCodeLookup } from "@/lib/utils";

interface CreateResponse {
  success: boolean;
  message?: string;
}

export async function createCompanyAction(
  data: CreateBusinessData,
): Promise<CreateResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("idToken")?.value;
    const countryCode = countryCodeLookup(data.country ?? "colombia");

    const response = await fetch(apiEndpoints.createBusiness(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        country_code: countryCode,
        company_size: data.companySize,
        parent_business_id: data.parentBusinessId,
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
