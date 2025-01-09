import { ValidationErrorMessages } from "@/types/i18n";

export const VALIDATION_ERROR_KEYS: {
  [K in keyof ValidationErrorMessages]: K;
} = {
  emailError: "emailError",
  nameError: "nameError",
  companyError: "companyError",
  countryError: "countryError",
  roleError: "roleError",
  companySizeError: "companySizeError",
  otpCodeError: "otpCodeError",
  otpCodeLengthError: "otpCodeLengthError",
  companyNameError: "companyNameError",
  companyDescriptionError: "companyDescriptionError",
  companyLinkedinError: "companyLinkedinError",
  companyWebsiteError: "companyWebsiteError",
};
