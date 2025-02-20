export interface BoardState {
  columns: PipefyPhase[];
}

export type PipefyPipe = {
  name: string;
  id: string;
  phases: PipefyPhase[];
};

export type PipefyPhase = {
  id: string;
  name: string;
  cards_count: number;
  cards: PipefyCard;
  cards_can_be_moved_to_phases: Partial<PipefyPhase>[];
};

export type PipefyCard = {
  nodes: PipefyNode[];
};

export type PipefyNode = {
  id: string;
  fields: PipefyField[];
};

export type PipefyField = {
  name: string;
  value: string;
  indexName: string;
};

export type PipefyPipeResponse = {
  pipe: PipefyPipe;
};

export enum PipefyFieldValues {
  RoleAlignment = "field_2_string",
  CandidateName = "field_3_string",
  CandidateCountry = "field_13_string",
  CandidateCityA = "field_14_string",
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
}
