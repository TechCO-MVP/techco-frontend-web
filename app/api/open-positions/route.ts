import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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
  const businessId = url.searchParams.get("business_id");
  const positionId = url.searchParams.get("id");

  const all = url.searchParams.get("all");

  if (!businessId) {
    return NextResponse.json(
      { error: "Missing required query parameter: business_id" },
      { status: 400 },
    );
  }

  const queryParams = new URLSearchParams({
    business_id: businessId,
  });
  if (positionId) queryParams.append("id", positionId);
  if (all) queryParams.append("all", all);
  try {
    console.log(
      "route",
      `${apiEndpoints.listPositions()}?${queryParams.toString()}`,
    );
    const response = await fetch(
      `${apiEndpoints.listPositions()}?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? "",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch data: ${response.statusText}`,
          message: await response.json(),
          status: response.status,
        },
        { status: response.status },
      );
    }
    const json = await response.json();
    console.log("/api/open-positions", json);

    if (!json.body || !Array.isArray(json.body.data)) {
      return NextResponse.json(
        { error: "Unexpected API response format" },
        { status: 500 },
      );
    }
    return NextResponse.json(json);
  } catch (error: unknown) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
