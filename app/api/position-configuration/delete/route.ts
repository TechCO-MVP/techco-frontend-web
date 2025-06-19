import { apiEndpoints } from "@/lib/api-endpoints";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("idToken")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing token" },
        { status: 401 },
      );
    }
    const body = await req.json();

    const response = await fetch(
      `${apiEndpoints.deletePositionConfiguration(body.id)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? "",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const json = await response.json();
    console.log("response", json);
    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            json?.message ||
            json?.error ||
            "Failed to delete position configuration",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("POST /position-configuration/delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
