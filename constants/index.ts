import { UserRole } from "@/types";
import { ValidationErrorMessages } from "@/types/i18n";

export const VALIDATION_ERROR_KEYS: {
  [K in keyof ValidationErrorMessages]: K;
} = {
  emailError: "emailError",
  nameError: "nameError",
  companyError: "companyError",
  countryError: "countryError",
  companyRoleError: "companyRoleError",
  roleError: "roleError",
  companySizeError: "companySizeError",
  otpCodeError: "otpCodeError",
  otpCodeLengthError: "otpCodeLengthError",
  companyNameError: "companyNameError",
  companyDescriptionError: "companyDescriptionError",
  companyLinkedinError: "companyLinkedinError",
  companyWebsiteError: "companyWebsiteError",
  companyDescriptionMaxError: "companyDescriptionMaxError",
};

export const ROLES: { value: UserRole["role"]; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "business_admin", label: "Business Admin" },
  { value: "position_owner", label: "Position Owner" },
  { value: "recruiter", label: "Recruiter" },
];

export const MATCH_OPTIONS = ["Alta", "Media - Alta", "Media", "Baja"];
export const SOURCE_OPTIONS = [
  "Talent Connect",
  "URL de la oferta",
  "Ingreso manual",
];
export const STATUS_OPTIONS = ["Activo", "Descartado", "Desistió del proceso"];

export const UPLOAD_FILE_PROMPT =
  "Analiza las respuestas contenidas en el documento PDF adjunto, correspondiente a una prueba aplicada. Evalúa cada respuesta con base en los criterios definidos en tu prompt como asistente.";

export const CULTURAL_FIT_FIELD_ID =
  "305713420_334881894_resultadoadndelcandidato";
export const TECHNICAL_TEST_FIELD_ID =
  "305713420_338699108_resultadoassessmenttecnico";

export const STATEMENT_BUTTON_TEXT = "statement_pipefy";

export const ABANDON_PROCESS_PHASE_NAME = "Abandonaron el proceso";
