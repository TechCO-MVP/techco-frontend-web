import { ValidationErrorMessages } from "@/types/i18n";

export const VALIDATION_ERROR_KEYS: {
  [K in keyof ValidationErrorMessages]: K;
} = {
  emailError: "emailError",
  companyError: "companyError",
  countryError: "countryError",

  roleError: "roleError",
  companySizeError: "companySizeError",
};
