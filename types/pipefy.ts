export interface BoardState {
  pipe: PipefyPipe;
  columns: PipefyPhase[];
}

export type PipefyPipe = {
  organizationId: string;
  cards_count: number;
  startFormPhaseId: string;
  name: string;
  id: string;
  publicForm: {
    url: string;
  };
  phases: PipefyPhase[];
};

export type PipefyPhase = {
  id: string;
  name: string;
  cards_count: number;
  cards: PipefyCard;
  cards_can_be_moved_to_phases: Partial<PipefyPhase>[];
  next_phase_ids: string[];
  previous_phase_ids: string[];
  fields: PipefyField[];
  fieldConditions: PipefyFieldCondition[];
};

export type PipefyCard = {
  nodes: PipefyNode[];
};

export type PipefyComment = {
  author_name: string;
  created_at: string;
  id: string;
  text: string;
};

export type PipefyNode = {
  id: string;
  fields: PipefyField[];
  comments?: PipefyComment[];
  current_phase: PipefyPhase;
  phases_history: {
    duration: number;
    lastTimeIn: string;
    phase: PipefyPhase;
  }[];
};

export type PipefyFieldCondition = {
  actions: PipefyFieldAction[];
  condition: PipefyCondition;
};

export type PipefyFieldAction = {
  whenEvaluator: boolean;
  phaseField: {
    internal_id: string;
  };
};

export type PipefyCondition = {
  expressions: PipefyConditionExpression[];
};

export type PipefyConditionExpression = {
  field_address: string;
  operation: "equals" | "not_equals" | "greater_than" | "less_than";
  structure_id: string;
  value: string;
};
export type PipefyField = {
  id: string;
  type: PipefyFieldType;
  label: string;
  required?: boolean;
  internal_id: string;
  name: string;
  value: string;
  indexName: string;
  options: string[];
  filled_at?: Date;
  field: { type: PipefyFieldType };
  phase_field: {
    internal_id: string;
    required: boolean;
    options: string[];
  };
};

export type PipefyPipeResponse = {
  pipe: PipefyPipe;
};

export type PipefyCardResponse = {
  card: {
    pipe: {
      phases: {
        id: string;
        name: string;
      }[];
    };
  };
};

export type PipefyPipesResponse = {
  pipes: {
    id: string;
    cards_count: number;
    phases: {
      name: string;
      cards_count: number;
    }[];
  }[];
};

export type UpdateFieldResponse = {
  updateCardField?: {
    card: PipefyCard;
  };
  success: boolean;
  message?: string;
};
export type PipefyFieldType =
  | "assignee_select"
  | "attachment"
  | "checklist_horizontal"
  | "checklist_vertical"
  | "cnpj"
  | "connector"
  | "cpf"
  | "currency"
  | "date"
  | "datetime"
  | "due_date"
  | "email"
  | "id"
  | "label_select"
  | "long_text"
  | "number"
  | "phone"
  | "radio_horizontal"
  | "radio_vertical"
  | "select"
  | "short_text"
  | "statement"
  | "time"
  | "dynamic_content";

export enum PipefyFieldValues {
  RoleAlignment = "field_2_string",
  CandidateName = "field_3_string",
  CandidateCountry = "field_13_string",
  CandidateCityA = "field_20_string",
  CandidateCityB = "field_16_string",
  CurrentPosition = "field_4_string",
  CurrentCompany = "field_5_string",
  TimeInPosition = "field_6_string",
  CurrentlyEmployed = "field_7_string",
  YearsOfExperience = "field_8_string",
  CandidateEmail = "field_10_string",
  CandidateStatus = "field_11_string",
  CandidateSource = "field_12_string",
  ProcessStartDate = "field_1_datetime",
  LinkedInURL = "field_9_string",
  Avatar = "field_1_string",
  PositionMatch = "field_21_string",
  Recomendation = "field_23_string",
  CandidateBio = "field_24_string",
}
