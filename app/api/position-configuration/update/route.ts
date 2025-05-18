// app/api/position-configuration/update/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiEndpoints } from "@/lib/api-endpoints";
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("idToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const response = await fetch(
      `${apiEndpoints.updatePositionConfiguration()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );

    const json = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: json?.error || "Failed to update position configuration" },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("PUT /position-configuration/update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
