import { apiEndpoints } from "@/lib/api-endpoints";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
  const id = url.searchParams.get("hiring_process_id");
  if (!id) {
    return NextResponse.json(
      { error: "Missing required path parameter: id" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${apiEndpoints.getHiringProcess()}?hiring_process_id=${id}`,
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
        {
          error: json?.error || "Failed to fetch hiring process",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("GET /hiring-process error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
