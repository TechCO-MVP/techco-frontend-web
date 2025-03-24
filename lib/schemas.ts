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
  role: z.string().min(3, { message: VALIDATION_ERROR_KEYS.companyRoleError }),
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
  name: z.string(),
  countryCode: z.string(),
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
 * Create User Form
 */

export const CreateUserSchema = z.object({
  businessName: z.string(),
  businessId: z.string(),
  fullName: z.string().min(3, { message: VALIDATION_ERROR_KEYS.nameError }),
  email: z.string().email({ message: VALIDATION_ERROR_KEYS.emailError }),
  companyPosition: z
    .string()
    .min(3, { message: VALIDATION_ERROR_KEYS.companyRoleError }),
  role: z.string().min(3, { message: VALIDATION_ERROR_KEYS.roleError }),
});

export type CreateUserData = z.infer<typeof CreateUserSchema>;
export type UpdateUserData = z.infer<typeof CreateUserSchema>;

/**
 * Create Business Form
 */

export const CreateBusinessSchema = z.object({
  parentBusinessId: z.string(),
  name: z.string().min(3, { message: VALIDATION_ERROR_KEYS.companyError }),
  country: z.string().min(2, { message: VALIDATION_ERROR_KEYS.countryError }),
  companySize: z
    .string()
    .min(1, { message: VALIDATION_ERROR_KEYS.companySizeError }),
});

export type CreateBusinessData = z.infer<typeof CreateBusinessSchema>;
