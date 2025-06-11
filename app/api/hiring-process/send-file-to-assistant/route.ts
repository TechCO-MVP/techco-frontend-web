import { apiEndpoints } from "@/lib/api-endpoints";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");
    if (!contentType?.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content-type" },
        { status: 400 },
      );
    }

    const body = await req.arrayBuffer();

    const response = await fetch(apiEndpoints.sendFileToAssistant(), {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "x-api-key": process.env.API_KEY ?? "",
      },
      body,
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: text || "Upload failed" },
        { status: response.status },
      );
    }

    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err) {
    console.error("upload-to-lambda error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
