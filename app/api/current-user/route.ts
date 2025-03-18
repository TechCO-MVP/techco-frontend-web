import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeToken } from "@/lib/utils";
import { type CognitoUser } from "@/types";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: Missing token" },
      { status: 401 },
    );
  }
  const user = decodeToken(token) as CognitoUser;

  return NextResponse.json({
    body: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
  });
}
