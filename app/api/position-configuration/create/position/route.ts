import { apiEndpoints } from "@/lib/api-endpoints";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

    const response = await fetch(`${apiEndpoints.createPosition()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    console.log("createPosition response", json);
    if (!response.ok) {
      return NextResponse.json(
        { error: json?.message || json?.error || "Failed to create position" },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("POST /position-configuration/create/position error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
