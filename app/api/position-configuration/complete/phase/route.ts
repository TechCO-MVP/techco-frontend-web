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

    const response = await fetch(`${apiEndpoints.completePhase()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    console.log("response", json);
    if (!response.ok) {
      return NextResponse.json(
        { error: json?.error || "Failed to complete phase" },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("POST /position-configuration/complete/phase error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
