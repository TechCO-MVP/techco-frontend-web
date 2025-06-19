import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiEndpoints } from "@/lib/api-endpoints";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing token" },
      { status: 401 },
    );
  }

  let body: {
    user_id?: string;
    business_id?: string;
    message?: string;
    notification_type?: string;
    hiring_process_id?: string;
    phase_id?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    user_id,
    business_id,
    message,
    notification_type,
    hiring_process_id,
    phase_id,
  } = body;

  if (!user_id || !business_id || !message || !notification_type) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: user_id, business_id, message, notification_type",
      },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(apiEndpoints.createNotification(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id,
        business_id,
        message,
        notification_type,
        hiring_process_id,
        phase_id,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to create notification: ${response.statusText}`,
          message: await response.json(),
          status: response.status,
        },
        { status: response.status },
      );
    }

    const json = await response.json();
    return NextResponse.json(json);
  } catch (error: unknown) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
