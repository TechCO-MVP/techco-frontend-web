import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiEndpoints } from "@/lib/api-endpoints";
import { ListBusinessApiResponse } from "@/types";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing token" },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(apiEndpoints.listBusiness(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const json = await response.json();
      console.log("Business List", json);
      return NextResponse.json(
        {
          error: `Failed to fetch data: ${response.statusText}, ${json?.message}`,
          status: response.status,
        },
        { status: response.status },
      );
    }

    const json: ListBusinessApiResponse = await response.json();

    if (!json.body || !Array.isArray(json.body)) {
      return NextResponse.json(
        { error: "Unexpected API response format" },
        { status: 500 },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
