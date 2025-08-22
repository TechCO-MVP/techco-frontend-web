export type Country = {
  label: string;
  value: string;
  code: string;
};

export type CountryDialCode = {
  label: string;
  value: string;
};

export type UserRole = {
  business_id: string;
  role: "super_admin" | "business_admin" | "position_owner" | "recruiter";
};

export type DeletePositionConfigurationInput = {
  id: string;
};

export type DeletePositionConfigurationResponse = {
  message: string;
  body: {
    data: {
      _id: string;
    };
  };
};

export type User = {
  _id: string;
  full_name: string;
  email: string;
  company_position: string;
  role: string;
  business_id: string;
  status: "enabled" | "disabled" | "pending";
  roles: UserRole[];
};

export type CognitoUser = {
  name: string;
  email: string;
};

export type Business = {
  _id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  country_code: string;
  company_size: string;
  is_admin: boolean;
  logo: string | null;
  description: string | null;
  url: string | null;
  linkedin_url: string | null;
  segment: string | null;
  industry: string | null;
  parent_business_id: string | null;
  business_configuration: BusinessConfiguration;
};

// --- Business Configuration Types ---

export type EvaluationCriterionType =
  | "TALENT_DNA"
  | "CHALLENGES_AND_BEHAVIORS_RESULT"
  | "FIRST_INTERVIEW"
  | "BUSINESS_CASE_RESULT"
  | "FINAL_INTERVIEW";

export interface EvaluationWeight {
  name: string;
  criterion_type: EvaluationCriterionType;
  weight: number;
}

export interface BusinessConfiguration {
  evaluation_weights: {
    HIGH_PROFILE_FLOW: EvaluationWeight[];
    MEDIUM_PROFILE_FLOW: EvaluationWeight[];
    LOW_PROFILE_FLOW: EvaluationWeight[];
  };
}

export type ListBusinessApiResponse = {
  message: string;
  body: Business[];
};

export type CurrentUserApiResponse = {
  status?: number;
  body?: {
    user?: CognitoUser;
  };
};

export type ListUserApiResponse = {
  message: string;
  body: {
    data: User[];
  };
};

export interface Position {
  id: number;
  status: "Activa" | "Inactiva" | "Cancelada";
  name: string;
  created_at: Date;
  candidates: number;
  priority: "Alta" | "Media" | "Baja";
  responsible: string;
  recruiter: string;
}

export type ListPositionsApiResponse = {
  message: string;
  body: {
    data: Position[];
  };
};

export type UpdateUserStatusData = {
  email: string;
  id: string;
  status: "enabled" | "disabled";
};

export type UpdatePositionStatusData = {
  userId: string;
  positionId: string;
  status: "CANCELED" | "ACTIVE" | "FINISHED" | "INACTIVE" | "DRAFT";
};

export type PositionSkill = {
  name: string;
  required: boolean;
};

export type PositionSalaryRange = {
  currency: string;
  salary: string;
  disclosed?: boolean;
  salary_range: {
    min: string;
    max: string;
  };
};

export type PositionData = {
  business_name: string;
  business_id: string;
  business_logo: string | null;
  business_description: string | null;
  position_id: string;
  position_role: string;
  position_country: string;
  position_city: string;
  position_work_mode: string;
  position_description: string;
  position_responsabilities: string[];
  position_languages: {
    name: string;
    level: string;
  }[];
  position_education: string[];
  position_seniority: string;
  position_skills: PositionSkill[];
  position_benefits: string[] | null;
  position_salary_range: PositionSalaryRange | null;
  hiring_id: string;
  hiring_profile_name: string | null;
  hiring_card_id: string;
  position_flow: PositionFlow;
  position_assessments: {
    type:
      | PositionConfigurationPhaseTypes.SOFT_SKILLS
      | PositionConfigurationPhaseTypes.TECHNICAL_TEST;
    data: Assessment | TechnicalAssessment;
  }[];
  position_entity: {
    position_flow: PositionFlow;
    _id: string;
    city: string;
    country_code: string;
    business_id: string;
    description: string;
    education: string[];
    benefits: string[] | null;
    flow_type: PositionConfigurationFlowTypes;
    hiring_priority: "high" | "medium" | "low";
    languages: {
      name: string;
      level: string;
    }[];
    owner_position_user_id: string;
    pipe_id: string;
    recruiter_user_id: string;
    role: string;
    salary: PositionSalaryRange;
    responsabilities: string[];
    seniority: string;
    skills: {
      name: string;
      required: boolean;
    }[];
    work_mode: string;
    status: "CANCELED" | "ACTIVE" | "FINISHED" | "INACTIVE" | "DRAFT";
    assessments: {
      type:
        | PositionConfigurationPhaseTypes.SOFT_SKILLS
        | PositionConfigurationPhaseTypes.TECHNICAL_TEST;
      data: Assessment | TechnicalAssessment;
    }[];
  };
};

export type PositionResponseBody = {
  data: PositionData;
};

export type PositionResponse = {
  message: string;
  body: PositionResponseBody;
};

type HiringUser = {
  user_name: string | null;
  user_id: string;
};

export type HiringResponsibleUser = HiringUser & {
  can_edit: boolean;
};
export type CulturalAssessmentResultType = {
  comportamientos: {
    name: string;
    dimensions: {
      dimension: string;
      pregunta: string;
      respuesta_candidato: string;
      calificacion: number; // 1 to 5
      justificacion: string;
    }[];
  }[];
  feedback_general: string;
};
export type HiringProcess = {
  _id: string;
  created_at: string;
  business_id: string;
  card_id: string;
  phase_id: string;
  position_id: string;

  phases: {
    [key: string]: {
      phase_id: number;
      fields: Record<string, any>;
      custom_fields: {
        has_seniority?: boolean;
        accepted_terms?: boolean;
        responsibilities: Record<string, boolean>;
        skills: Record<string, boolean>;
        expected_salary: string;
        process_id: string;
        assistant_response: {
          assesment_result:
            | CulturalAssessmentResultType
            | TechnicalAssesmentResult
            | null;
        };
      };
    };
  };
  profile: {
    source: string;
    url: string;
    country_code: string;
    city: string;
    current_company_name: string;
    avatar: string;
    name: string;
    education: {
      description: string | null;
      description_html: string | null;
      end_year: string;
      institute_logo_url: string;
      start_year: string;
      title: string;
    }[];
    experience: {
      company: string;
      company_id: string;
      company_logo_url: string;
      description: string;
      description_html: string;
      end_date: string;
      start_date: string;
    }[];
  };
};

export type HiringPositionData = {
  _id: string;
  city: string;
  country_code: string;
  description: string;
  responsabilities: string[];
  education: string[];
  skills: {
    name: string;
    required: boolean;
  }[];
  languages: {
    name: string;
    level: string;
  }[];
  business_configuration: BusinessConfiguration;
  benefits: string[];
  work_mode: string;
  status: "CANCELED" | "ACTIVE" | "FINISHED" | "INACTIVE" | "DRAFT"; // Adjust possible statuses if known
  owner_position_user_id: string;
  owner_position_user_name: string;
  recruiter_user_id: string;
  recruiter_user_name: string;
  responsible_users: HiringResponsibleUser[];
  role: string;
  hiring_priority: "high" | "medium" | "low";
  pipe_id: string;
  seniority: string;
  flow_type: PositionConfigurationFlowTypes;
  created_at: string;
  hiring_processes: HiringProcess[];
  position_configuration_id?: string;
  position_flow: PositionFlow;
  position_assessments: {
    type:
      | PositionConfigurationPhaseTypes.SOFT_SKILLS
      | PositionConfigurationPhaseTypes.TECHNICAL_TEST;
    data: Assessment | TechnicalAssessment;
  }[];
  salary?: {
    currency: string;
    disclosed?: boolean;
    salary?: string;
    salary_range?: {
      min: string;
      max: string;
    };
  };
};

export type PositionFilterStatusResponse = {
  message: string;
  body: {
    status: "pending" | "in_progress" | "completed" | "failed";
    pipe_id: string;
    created_at: string;
    process_filters: {
      city: string;
      country_code: string;
      role: string;
    };
  };
};

export type HiringPositionResponse = {
  message: string;
  body: {
    data: HiringPositionData[];
  };
};
export type HiringPositionByIdResponse = {
  message: string;
  body: {
    data: PositionData;
  };
};
export type Stakeholder = {
  stakeholder_id: string;
  stakeholder_name: string;
  can_edit: boolean;
};

export type HiringProcessData = {
  position_country: string;
  position_city: string;
  position_status: "ACTIVE" | "INACTIVE" | string; // Adjust based on known statuses
  recruiter_id: string;
  recruiter_name: string;
  owner_id: string;
  owner_name: string;
  stakeholders: Stakeholder[];
};

export type HiringProcessResponse = {
  message: string;
  body: {
    data: HiringProcessData;
  };
};
export type NotificationStatus = "NEW" | "READ" | "REVIEWED";

export enum PhaseType {
  INFORMATIVE = "INFORMATIVE",
  ACTION_CALL = "CALL_TO_ACTION",
}

export enum AssistantName {
  CULTURAL_FIT_ASSESSMENT = "soft_assessment_assistant",
  TECHNICAL_ASSESSMENT = "technical_assessment_assistant",
}
export enum NotificationType {
  PHASE_CHANGE = "PHASE_CHANGE",
  TAGGED_IN_COMMENT = "TAGGED_IN_COMMENT",
  PROFILE_FILTER_PROCESS = "PROFILE_FILTER_PROCESS",
}

export type NotificationPayload = {
  message: {
    _id: string;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
    deleted_at: string | null;
    phase_name?: string;
    phase_type?: PhaseType;
    user_id: string;
    business_id: string;
    message: string;

    notification_type: NotificationType;

    status: "NEW" | "READ" | "REVIEWED"; // define actual statuses you support

    process: string;
    hiring_process_id: string;
    read_at: string | null;

    phase_id: string;
    card_id: string;
    position_id: string;
    profile_name: string;
    pipe_id: string;
    position_name: string;
  };
};

export type WebSocketMessagePayload = {
  action: "chat_message" | "notification";
  payload: NotificationPayload | BotMessagePayload;
};
export interface PositionDTO {
  business_id?: string;
  recruiter_user_id: string;
  responsible_users?: string[];
  role: string;
  seniority: string;
  country_code: string;
  city: string;
  description: string;
  responsabilities: string[];
  skills: string[];
  languages: string[];
  hiring_priority: "high" | "medium" | "low";
  work_mode: "REMOTE" | "ON_SITE" | "HYBRID";
  benefits?: string[] | null;

  salary?: {
    currency: string;
    disclosed?: boolean;
    salary?: string;
    salary_range?: {
      min: string;
      max: string;
    };
  };
}
export interface BotMessagePayload {
  id: string;
  role: "user" | "assistant";
  business_id: string;
  message: string;
  response_type: BotResponseTypes;
  options?: string[];
  position?: DraftPositionData;
  assesment?: Assessment | TechnicalAssessment;
  phase_type: string;
  position_configuration_id: string;
  thread_id: string;
}

export type GetNotificationsApiResponse = {
  message: string;
  body: {
    data: NotificationPayload["message"][];
  };
};

export interface CreateNotificationInput {
  user_id: string[];
  business_id: string;
  message: string;
  notification_type: NotificationPayload["message"]["notification_type"];
  hiring_process_id: string;
  phase_id: string;
  position_id: string;
}

export type PositionPhase = {
  name: string;
  thread_id: string;
  status: "COMPLETED" | "IN_PROGRESS" | "DRAFT";
  type: PositionConfigurationPhaseTypes;
  data: DraftPositionData | Assessment | TechnicalAssessment;
  configuration_type: PositionConfigurationTypes;
};

export type PositionConfiguration = {
  _id: string;
  business_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: string;
  status: "COMPLETED" | "IN_PROGRESS" | "DRAFT";
  type: PositionConfigurationTypes;
  phases: PositionPhase[];
  flow_type: PositionConfigurationFlowTypes;
  current_phase: PositionConfigurationPhaseTypes;
};

export type GetPositionConfigurationListResponse = {
  message: string;
  body: {
    data: PositionConfiguration[];
  };
};

export enum PositionConfigurationTypes {
  AI_TEMPLATE = "AI_TEMPLATE",
  CUSTOM = "CUSTOM",
  OTHER_POSITION_AS_TEMPLATE = "OTHER_POSITION_AS_TEMPLATE",
  NONE_REQUIRED = "NONE_REQUIRED",
}

export enum PositionConfigurationFlowTypes {
  HIGH_PROFILE_FLOW = "HIGH_PROFILE_FLOW",
  MEDIUM_PROFILE_FLOW = "MEDIUM_PROFILE_FLOW",
  LOW_PROFILE_FLOW = "LOW_PROFILE_FLOW",
}
export enum PositionConfigurationStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  DRAFT = "DRAFT",
}

export enum PositionConfigurationPhaseTypes {
  DESCRIPTION = "DESCRIPTION",
  READY_TO_PUBLISH = "READY_TO_PUBLISH",
  FINAL_INTERVIEW = "FINAL_INTERVIEW",
  TECHNICAL_TEST = "TECHNICAL_TEST",
  SOFT_SKILLS = "SOFT_SKILLS",
}

export enum BotResponseTypes {
  MULTIPLE_SELECTION = "MULTIPLE_SELECTION",
  UNIQUE_SELECTION = "UNIQUE_SELECTION",
  OPEN_QUESTION = "OPEN_QUESTION",
  CURRENT_STATUS = "CURRENT_STATUS",
  FINAL_CONFIRMATION = "FINAL_CONFIRMATION",
}

export type NextPhaseInput = {
  position_configuration_id: string;
  configuration_type: PositionConfigurationTypes;
};

export type CreatePositionInput = {
  position_configuration_id: string;
  configuration_type: PositionConfigurationTypes;
};

export type ProfileFilterStartUrlInput = {
  position_id: string;
  business_id: string;
  url_profiles: {
    email: string;
    url: string;
  }[];
};

export type CompletePhaseInput = {
  position_configuration_id: string;
  data:
    | Assessment
    | TechnicalAssessment
    | DraftPositionData
    | Record<
        string,
        string | number | boolean | string[] | number[] | boolean[]
      >;
};
export type CompletePhaseResponse = {
  message: string;
  body: {
    data: {
      _id: string;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      user_id: string;
      business_id: string;
      current_phase: string;
      status: PositionConfigurationStatus;
      type: PositionConfigurationTypes;
      phases: PositionPhase[];
    };
  };
};
export type PostPositionConfigurationInput = {
  business_id: string;
  flow_type: PositionConfigurationFlowTypes;
};

export type PostPositionConfigurationResponse = {
  body: {
    data: {
      business_id: string;
      created_at: string;
      deleted_at: string | null;
      phases?: PositionPhase[];
      current_phase?: string;
      status: PositionConfigurationStatus;
      type: PositionConfigurationTypes;
      updated_at: string;
      user_id: string;
      _id: string;
    };
  };
  message: string;
};
export type ProfileFilterStartUrlResponse = {
  message: string;
  body: {
    profile_filter: {
      _id: string;
    };
  };
};
export interface UpdateHiringProcessCustomFieldsInput {
  id: string;
  phases: {
    [key: string]: {
      phase_id: string;
      custom_fields: Record<string, unknown>;
    };
  };
}

export type UpdateHiringProcessCustomFieldsResponse = {
  message: string;
  body: {
    data: {
      _id: string;
    };
  };
};
export interface UpdatePositionConfigurationInput {
  _id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  business_id: string;
  status: "COMPLETED" | "IN_PROGRESS" | "DRAFT";
  type: PositionConfigurationTypes;
  phases: {
    name: string;
    thread_id: string;
    status: "COMPLETED" | "IN_PROGRESS" | "DRAFT";
    type: PositionConfigurationPhaseTypes;
    data: Record<string, unknown> | DraftPositionData | null;
  }[];
}

export interface UpdatePositionConfigurationResponse {
  _id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: string;
  business_id: string;
  thread_id: string;
  status: "COMPLETED" | "IN_PROGRESS" | "DRAFT";
  type: PositionConfigurationTypes;
  phases: UpdatePositionConfigurationInput["phases"];
}

export type WebSocketStatus = "connecting" | "connected" | "disconnected";
export type MessageHandler = (data: WebSocketMessagePayload) => void;
export type StatusChangeHandler = (status: WebSocketStatus) => void;

export type ChatMessage = {
  id: string;
  created_at: number;
  role: string;
  content: any[];
};

export type MessageHistoryResponse = {
  message: string;
  body: {
    data: {
      object: string;
      data: ChatMessage[];
      first_id: string;
      last_id: string;
      has_more: boolean;
    };
  };
};

export interface DraftPositionData {
  business_id: string;
  recruiter_user_id: string;
  owner_position_user_id: string;
  responsible_users: string[];
  role: string;
  seniority: string;
  country_code: string;
  city: string;
  description: string;
  responsabilities: string[];
  education?: string[];
  skills: {
    name: string;
    required: boolean;
  }[];
  languages: {
    name: string;
    level: string;
  }[];
  hiring_priority: string;
  work_mode: string;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
  benefits: string[];
  salary?: {
    disclosed?: boolean;
    currency: string;
    salary: string | null;
    salary_range?: {
      min?: string;
      max?: string;
    } | null;
  };
}

export type Assessment = {
  is_lead_position: boolean;
  how_much_autonomy: string;
  challenges_of_the_position: string;
  soft_skills: AssessmentSoftSkill[];
};

export type AssessmentSoftSkill = {
  description: string;
  name: string;
  dimensions: AssessmentSoftSkillDimension[];
};

export type AssessmentSoftSkillDimension = {
  name: string;
  question: string;
  explanation: string;
};
export type FileProcessingStatus = {
  process_id: string;
  run_id: string;
  created_at: string;
  thread_id: string;
  expires_at: string;
  status: "COMPLETED" | "IN_PROGRESS" | "FAILED";
};

export type AssistantResponse = {
  message: string;
  data: {
    message: string;
    response_type: string;
    assesment_result: CulturalAssesmentResult | TechnicalAssesmentResult;
  };
};

export type AssistantResponseInput = {
  run_id: string;
  assistant_type: AssistantName;
  thread_id: string;
  hiring_process_id: string;
};

/**
 * {
  "assesment": {
    "business_case_title": "Desarrollo y Liderazgo en Prototipo de Dashboard Web",
    "assesment_goal": "Evaluar la capacidad para diseñar, implementar y liderar el desarrollo de una solución frontend en un entorno colaborativo y dinámico, alineada a las mejores prácticas e integración con equipos multidisciplinarios.",
    "challenge": "La empresa está lanzando una nueva plataforma SaaS para gestión de talento. Se requiere un prototipo funcional de un dashboard principal, que muestre información clave (KPIs, alertas, datos de usuarios), totalmente responsive, que consuma datos de una API y que pueda ser fácilmente ampliable. Los equipos de diseño y backend te facilitarán recursos y especificaciones, pero esperan de ti liderazgo técnico, criterio de diseño, buenas prácticas y claridad para comunicar tus decisiones.",
    "your_mission": "1. Desarrolla un prototipo funcional del dashboard usando React.js (o Angular, si prefieres) y especifica brevemente cómo estructuraste el código (componentes, organización, estilos, etc.). 2. Explica las decisiones técnicas tomadas (librerías usadas, manejo de estado, estrategia de integración con APIs, control de versiones y testeo) y cómo evaluaste su impacto en performance y escalabilidad. 3. Describe cómo guiarías y mentorearías a un miembro junior del equipo en este proyecto. 4. Resume cómo asegurarías la colaboración efectiva entre producto, diseño y desarrollo backend en este contexto. Presenta tu entrega en un repositorio privado y acompáñalo de un README claro para entender tu solución."
  }
}
 */
export type TechnicalAssessment = {
  business_case_title: string;
  assesment_goal: string;
  challenge: string;
  your_mission: string;
};

export interface PositionFlowDataSection {
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
}

export interface PositionFlowData {
  sections: PositionFlowDataSection[];
}

export interface PositionFlowPhase {
  name: string;
  phase_classification: "INFORMATIVE" | "CALL_TO_ACTION";
  candidate_data: PositionFlowData | null;
  interviewer_data: PositionFlowData | null;
}
export interface PhaseFlowGroup {
  name: string;
  phases: PositionFlowPhase[];
}

export interface PositionFlow {
  flow_type: PositionConfigurationFlowTypes;
  pipe_id: number;
  groups: PhaseFlowGroup[];
}

export interface PositionPhaseSearchResult {
  phase: PositionFlowPhase;
  groupName: string;
  candidateData: PositionFlowData | null;
  interviewerData: PositionFlowData | null;
}

export type CulturalAssesmentResult = {
  comportamientos: {
    dimension: string;
    pregunta: string;
    respuesta_candidato: string;
    calificacion: number; // 1 to 5
    justificacion: string;
  }[];
  feedback_general: string;
};

export type TechnicalAssesmentResult = {
  dimensiones: {
    nombre: string;
    calificacion: number; // 1 to 5
    justificacion: string;
  }[];
  feedback_general: string;
};

export const PHASE_NAMES = {
  SUGGESTED_CANDIDATES: "Candidatos sugeridos",
  OFFER_SENT: "Oferta enviada",
  INITIAL_FILTER: "Filtro inicial",
  CULTURAL_FIT_ASSESSMENT: "Assessment fit Cultural",
  CULTURAL_FIT_ASSESSMENT_RESULTS: "Resultado Fit Cultural",
  FIRST_INTERVIEW_REQUESTED: "Primera entrevista solicitada",
  FIRST_INTERVIEW_SCHEDULED: "Primera entrevista programada",
  FIRST_INTERVIEW_RESULTS: "Resultado primer entrevista",
  TECHNICAL_ASSESSMENT: "Assessment técnico",
  TECHNICAL_ASSESSMENT_RESULTS: "Resultado Assessment técnico",
  FINAL_INTERVIEW_REQUESTED: "Entrevista final solicitada",
  FINAL_INTERVIEW_SCHEDULED: "Entrevista final programada",
  FINAL_INTERVIEW_RESULTS: "Resultado entrevista final",
  FINALISTS: "Finalistas",
  SELECTED_CANDIDATES: "Candidato seleccionado",
  REJECTED: "Descartados",
  ABBANDONED_PROCESS: "Abandonaron el proceso",
} as const;

export interface EvaluationMetric {
  id: string;
  title: string;
  score?: number;
  icon: "user" | "target" | "message-circle" | "clock" | "bar-chart";
  maxScore?: number;
}

export interface PhaseData {
  id: string;
  name: string;
  score?: number;
  maxScore: number;
  component?: React.ReactNode;
  status: "completed" | "pending" | "in-progress";
  details?: {
    description?: string;
    completedDate?: string;
    duration?: string;
    evaluator?: string;
    notes?: string;
  };
}
