"use server";

import { SignInFormData } from "@/lib/schemas";

export async function signIn(data: SignInFormData): Promise<SignInFormData> {
  return data;
}
