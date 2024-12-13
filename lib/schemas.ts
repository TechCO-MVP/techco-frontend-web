import { VALIDATION_ERROR_KEYS } from "@/constants";
import { z } from "zod";

/**
 * SignUp Form
 */
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

/**
 * OTP Form
 */
export const OTPFormSchema = z.object({
  code: z.string().min(4, { message: VALIDATION_ERROR_KEYS.otpCodeError }),
});

export type OTPFormData = z.infer<typeof OTPFormSchema>;

/**
 * Login Form
 */
export const SignInFormSchema = z.object({
  email: z.string().email({ message: VALIDATION_ERROR_KEYS.emailError }),
});

export type SignInFormData = z.infer<typeof SignInFormSchema>;
