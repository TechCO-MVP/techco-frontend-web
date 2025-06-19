"use server";
import { apiEndpoints } from "@/lib/api-endpoints";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut(data: FormData) {
  const lang = data.get("lang");
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const token = cookieStore.get("idToken")?.value;

  const response = await fetch(apiEndpoints.signOut(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY ?? "",
      Authorization: `${token}`,
    },
    body: JSON.stringify({ access_token: accessToken }),
  });

  if (response.ok) {
    cookieStore.delete("idToken");
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  }
  redirect(`/${lang}/signin`);
}
