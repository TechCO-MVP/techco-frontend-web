import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiEndpoints } from "@/lib/api-endpoints";

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing token" },
      { status: 401 },
    );
  }

  let body: { notification_id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { notification_id, status } = body;

  if (!notification_id || !status) {
    return NextResponse.json(
      { error: "Missing required fields: notification_id and status" },
      { status: 400 },
    );
  }

  if (!["READ", "REVIEWED"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'READ' or 'REVIEWED'" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(apiEndpoints.updateNotificationStatus(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notification_id, status }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to update: ${response.statusText}`,
          message: await response.json(),
          status: response.status,
        },
        { status: response.status },
      );
    }

    const json = await response.json();
    return NextResponse.json(json);
  } catch (error: unknown) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
