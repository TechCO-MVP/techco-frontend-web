"use server";

import { SignUpFormData } from "@/lib/schemas";

export async function signUp(data: SignUpFormData): Promise<SignUpFormData> {
  return data;
}
