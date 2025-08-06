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
  { value: "business_admin", label: "Business Admin" },
  { value: "position_owner", label: "Position Owner" },
  { value: "recruiter", label: "Recruiter" },
];

export const MATCH_OPTIONS = ["Alta", "Media - Alta", "Media", "Baja"];
export const SOURCE_OPTIONS = [
  "Talent Connect",
  "A través de la URL de la vacante",
  "Ingreso manual",
];
export const STATUS_OPTIONS = ["Activo", "Descartado", "Desistió del proceso"];

export const UPLOAD_FILE_PROMPT =
  "Analiza las respuestas contenidas en el documento PDF adjunto, correspondiente a una prueba aplicada. Evalúa cada respuesta con base en los criterios definidos en tu prompt como asistente.";

export const CULTURAL_FIT_FIELD_ID =
  "305713420_334881894_resultadoadndelcandidato";
export const TECHNICAL_TEST_FIELD_ID =
  "305713420_338699108_resultadoassessmenttecnico";

export const CANDIDATE_EMAIL_FIELD_ID = "305713420_334105217_candidateemail";

export const CANDIDATE_PHONE_FIELD_ID =
  "305713420_334105217_candidatesphonenumber";

export const INVITATION_URL_FIELD_ID =
  "305713420_334105217_urloftheinvitationtotheprocess";

export const CANDIDATE_BIRTHDAY_FIELD_ID = "306495670_339242211_birthdate";

export const CANDIDATE_DNI_FIELD_ID = "306495670_339242211_dni";

export const CANDIDATE_FATHERS_FULLNAME_FIELD_ID =
  "306495670_339242211_fathersfullname";

export const CANDIDATE_FATHERS_LASTNAME_FIELD_ID =
  "305713420_334105217_apellidoscompletosdelpadre";

export const CANDIDATE_MOTHERS_LASTNAME_FIELD_ID =
  "305713420_334105217_apellidoscompletosdelamadre";

export const CANDIDATE_MOTHERS_FULLNAME_FIELD_ID =
  "306495670_339242211_mothersfullname";

export const CERTIFICATES_FIELD_ID = "305713420_334881894_certificates";

export const STATEMENT_BUTTON_TEXT = "statement_pipefy";

export const ABANDON_PROCESS_PHASE_NAME = "Abandonaron el proceso";

export const REJECTED_PHASE_NAME = "Descartados";

export const INITIAL_FILTER_SCORE_THRESHOLD = 4;

export const GLORIA_BUSINESSES_ID = [
  "685b1e10e6cc8b62bd5c3082",
  "687894f9a1a5b4328f29ee5d",
  "685dacc01c0b92f2b7120140",
  "685c113b7d122deeabcd0f50",
];

export const CANDIDATE_SOURCE_FIELD_ID = "305713420_334220463_candidatesource2";
export const CANDIDATE_OTHER_SOURCE_FIELD_ID =
  "305713420_334220463_othercandidatesource";
