import { NextResponse } from "next/server";
import { apiEndpoints } from "@/lib/api-endpoints";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing required query parameter: id" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${apiEndpoints.positionDetails({ positionId: id })}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? "",
        },
      },
    );

    const json = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: json?.error || "Failed to fetch position" },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("GET /position/list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
