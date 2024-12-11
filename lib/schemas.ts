import { VALIDATION_ERROR_KEYS } from "@/constants";
import { z } from "zod";

export const SignUpFormSchema = z.object({
  email: z.string().email({ message: VALIDATION_ERROR_KEYS.emailError }),
  company: z.string().min(3, { message: VALIDATION_ERROR_KEYS.companyError }),
  companySize: z
    .string()
    .min(3, { message: VALIDATION_ERROR_KEYS.companySizeError }),
  country: z.string().min(2, { message: VALIDATION_ERROR_KEYS.countryError }),
  role: z.string().min(3, { message: VALIDATION_ERROR_KEYS.roleError }),
});

export type SignUpFormData = z.infer<typeof SignUpFormSchema>;
