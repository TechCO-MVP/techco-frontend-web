"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut(data: FormData) {
  const lang = data.get("lang");
  const cookieStore = await cookies();
  cookieStore.delete("idToken");
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  redirect(`/${lang}/signin`);
}
