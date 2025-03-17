import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiEndpoints } from "@/lib/api-endpoints";
import { HiringProcessResponse } from "@/types";

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
  const hiringProcessId = url.searchParams.get("hiring_process_id");

  if (!hiringProcessId) {
    return NextResponse.json(
      { error: "Missing required query parameter: hiring_process_id" },
      { status: 400 },
    );
  }

  const queryParams = new URLSearchParams({
    hiring_process_id: hiringProcessId,
  });

  try {
    const response = await fetch(
      `${apiEndpoints.getHiringProcess()}?${queryParams.toString()}`,
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

    const json: HiringProcessResponse = await response.json();

    if (!json.body) {
      return NextResponse.json(
        { error: "Unexpected API response format" },
        { status: 500 },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
