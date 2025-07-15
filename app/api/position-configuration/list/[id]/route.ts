import { NextResponse } from "next/server";
import { apiEndpoints } from "@/lib/api-endpoints";
import { cookies } from "next/headers";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing token" },
      { status: 401 },
    );
  }
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing required  parameter: id" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${apiEndpoints.positionsByBusiness({ businessId: id })}`,
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
        { error: json?.error || "Failed to fetch positions" },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("GET /position/list/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
