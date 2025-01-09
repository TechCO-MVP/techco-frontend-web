import { VALIDATION_ERROR_KEYS } from "@/constants";
import { z } from "zod";

/**
 * SignUp Form
 */
export const SignUpFormSchema = z.object({
  name: z.string().min(3, { message: VALIDATION_ERROR_KEYS.nameError }),
  email: z.string().email({ message: VALIDATION_ERROR_KEYS.emailError }),
  company: z.string().min(3, { message: VALIDATION_ERROR_KEYS.companyError }),
  companySize: z
    .string()
    .min(1, { message: VALIDATION_ERROR_KEYS.companySizeError }),
  country: z.string().min(2, { message: VALIDATION_ERROR_KEYS.countryError }),
  role: z.string().min(3, { message: VALIDATION_ERROR_KEYS.roleError }),
});

export type SignUpFormData = z.infer<typeof SignUpFormSchema>;

/**
 * OTP Form
 */
export const OTPFormSchema = z.object({
  session: z.string(),
  email: z.string(),
  code: z
    .string()
    .min(6, { message: VALIDATION_ERROR_KEYS.otpCodeLengthError }),
});

export type OTPFormData = z.infer<typeof OTPFormSchema>;

/**
 * Login Form
 */
export const SignInFormSchema = z.object({
  email: z.string().email({ message: VALIDATION_ERROR_KEYS.emailError }),
});

export type SignInFormData = z.infer<typeof SignInFormSchema>;

/**
 * Company Details Form
 */

export const CompanyDetailsSchema = z.object({
  description: z
    .string()
    .min(10, { message: VALIDATION_ERROR_KEYS.companyDescriptionError }),
  website: z
    .string()
    .url({ message: VALIDATION_ERROR_KEYS.companyWebsiteError }),
  linkedin: z
    .string()
    .url({ message: VALIDATION_ERROR_KEYS.companyLinkedinError }),
  companySize: z
    .string()
    .min(1, { message: VALIDATION_ERROR_KEYS.companySizeError }),
  industry: z.string(),
  segment: z.string(),
});

export type CompanyDetailsData = z.infer<typeof CompanyDetailsSchema>;

/**
 * Create Form
 */

export const CreateUserSchema = z.object({
  company: z.string(),
  name: z.string(),
  email: z.string().email(),
  position: z.string(),
  role: z.string(),
});

export type CreateUserData = z.infer<typeof CreateUserSchema>;
