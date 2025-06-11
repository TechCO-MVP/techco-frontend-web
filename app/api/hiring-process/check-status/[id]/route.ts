import { apiEndpoints } from "@/lib/api-endpoints";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing required path parameter: id" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${apiEndpoints.checkFileProcessingStatus()}/${id}`,
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
        {
          error: json?.error || "Failed to fetch file processing status",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("GET /hiring-process/check-status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
