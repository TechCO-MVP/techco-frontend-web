"use server";

import { CompanyDetailsData } from "@/lib/schemas";
import { apiEndpoints } from "@/lib/api-endpoints";
import { cookies } from "next/headers";
import { Business } from "@/types";
import { countryCodeLookup } from "@/lib/utils";

interface UpdateResponse {
  success: boolean;
  message?: string;
}

export async function updateCompanyAction(
  data: CompanyDetailsData & Partial<Business>,
  id: string,
): Promise<UpdateResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("idToken")?.value;
    const countryCode = countryCodeLookup(data.countryCode);
    const response = await fetch(apiEndpoints.updateBusiness(id), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        country_code: countryCode,
        description: data.description,
        segment: data.segment,
        industry: data.industry,
        url: data.website,
        linkedin_url: data.linkedin,
        company_size: data.companySize,
        logo: data.logo,
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
