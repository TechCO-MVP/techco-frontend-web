import { NextResponse } from "next/server";
import { apiEndpoints } from "@/lib/api-endpoints";
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${apiEndpoints.updateHiringProcessCustomFields()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? "",
        },
        body: JSON.stringify(body),
      },
    );

    const json = await response.json();
    console.log(
      "%c[Debug] json",
      "background-color: teal; font-size: 20px; color: white",
      json,
    );
    if (!response.ok) {
      return NextResponse.json(
        { error: json?.error || "Failed to update hiring process" },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("PUT /hiring-process/update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
