"use server";
import { cookies } from "next/headers";
import { decodeToken } from "@/lib/utils";
import { type User } from "@/types";
export default async function UserInfo() {
  const cookieStore = await cookies();
  const token = cookieStore.get("idToken")?.value;

  if (!token) {
    return <p>Unauthorized: No token provided</p>;
  }

  // Verify and decode the token
  const decoded = decodeToken(token) as User;

  return (
    <div>
      <p>Email: {decoded.email}</p>
    </div>
  );
}
