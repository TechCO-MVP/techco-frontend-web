import { apiEndpoints } from "@/lib/api-endpoints";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(`${apiEndpoints.profileFilterStartUrl()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    console.log("response", json);
    if (!response.ok) {
      return NextResponse.json(
        { error: json?.error || "Failed to create position configuration" },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("POST /position-configuration/create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
