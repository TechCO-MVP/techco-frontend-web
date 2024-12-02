"use server";
import { getDictionary } from "@/get-dictionary";
import { z } from "zod";
import { redirect } from "next/navigation";

const createSignUpSchema = (
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
) =>
  z.object({
    email: z.string().email(dictionary.signUp.email),
    company: z.string().min(3, dictionary.signUp.email),
    country: z.string().min(3, dictionary.signUp.email),
    terms: z
      .boolean()
      .refine((val) => val, "Debes aceptar los terminos y condiciones"),
  });

interface SignUpFormState {
  errors: {
    email?: string[];
    company?: string[];
    country?: string[];
    terms?: string[];
  };
}

export async function signUp(
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
  formState: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> {
  const email = formData.get("email");
  const company = formData.get("company");
  const country = formData.get("country");
  const terms = !!formData.get("terms");

  const signUpSchema = createSignUpSchema(dictionary);

  const result = signUpSchema.safeParse({
    email,
    company,
    country,
    terms,
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  redirect("/signup/code");
}
