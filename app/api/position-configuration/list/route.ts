import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiEndpoints } from "@/lib/api-endpoints";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing token" },
      { status: 401 },
    );
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const all = url.searchParams.get("all");
  const businessId = url.searchParams.get("business_id");
  if (!businessId) {
    return NextResponse.json(
      { error: "Missing required query parameter: business_id" },
      { status: 400 },
    );
  }
  const queryParams = new URLSearchParams({
    business_id: businessId,
  });
  if (id) queryParams.append("id", id);
  if (all !== null) queryParams.append("all", all);

  try {
    const response = await fetch(
      `${apiEndpoints.listPositionConfigurations()}?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? "",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const json = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: json?.error || "Failed to fetch position configuration" },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("GET /position-configuration/list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
