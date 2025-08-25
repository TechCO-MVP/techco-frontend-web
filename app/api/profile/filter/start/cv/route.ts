import { apiEndpoints } from "@/lib/api-endpoints";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const response = await fetch(`${apiEndpoints.profileFilterStartCv()}`, {
      method: "POST",
      headers: {
        "x-api-key": process.env.API_KEY ?? "",
      },
      body: formData,
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
    console.error("POST /profile/filter/start/cv:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
