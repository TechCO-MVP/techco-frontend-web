import { apiEndpoints } from "@/lib/api-endpoints";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ threadId: string }> },
) {
  const { threadId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing token" },
      { status: 401 },
    );
  }

  if (!threadId) {
    return NextResponse.json(
      { error: "Missing required path parameter: threadId" },
      { status: 400 },
    );
  }

  const url = new URL(req.url);
  const limit = url.searchParams.get("limit") || "20";
  const messageId = url.searchParams.get("message_id");

  const queryParams = new URLSearchParams();
  if (limit) queryParams.append("limit", limit);
  if (messageId) queryParams.append("message_id", messageId);

  try {
    const response = await fetch(
      `${apiEndpoints.messageHistory()}/${threadId}?${queryParams.toString()}`,
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
          error: json?.error || "Failed to fetch message history",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("GET /llm/message-history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
