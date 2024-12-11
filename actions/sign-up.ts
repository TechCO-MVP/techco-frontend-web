"use server";

// import { redirect } from "next/navigation";
import { SignUpFormData } from "@/lib/schemas";

export async function signUp(data: SignUpFormData): Promise<SignUpFormData> {
  return data;

  // redirect("/signup/code");
}
