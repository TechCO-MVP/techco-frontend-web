export type Country = {
  label: string;
  value: string;
  code: string;
};

export type UserRole = {
  business_id: string;
  role: "super_admin" | "business_admin" | "position_owner" | "recruiter";
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
};

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
  position_skills: PositionSkill[];
  position_benefits: string[] | null;
  position_salary_range: PositionSalaryRange | null;
  hiring_id: string;
  hiring_profile_name: string | null;
  hiring_card_id: string;
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

export type HiringPositionData = {
  _id: string;
  status: "CANCELED" | "ACTIVE" | "FINISHED" | "INACTIVE" | "DRAFT"; // Adjust possible statuses if known
  owner_position_user_id: string;
  owner_position_user_name: string;
  recruiter_user_id: string;
  recruiter_user_name: string;
  responsible_users: HiringResponsibleUser[];
  role: string;
  hiring_priority: "high" | "medium" | "low";
  pipe_id: string;
  created_at: string;
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

export type NotificationType =
  | "PHASE_CHANGE"
  | "TAGGED_IN_COMMENT"
  | "PROFILE_FILTER_PROCESS";

export type Notification = {
  _id: string;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  deleted_at: string | null;

  user_id: string;
  business_id: string;
  message: string;

  notification_type:
    | "PHASE_CHANGE"
    | "TAGGED_IN_COMMENT"
    | "PROFILE_FILTER_PROCESS";

  status: "NEW" | "READ" | "REVIEWED"; // define actual statuses you support

  process: string;
  hiring_process_id: string;
  read_at: string | null;

  phase_id: string;
  card_id: string;

  profile_name: string;
  pipe_id: string;
  position_name: string;
};

export type WebSocketNotificationPayload = {
  message: Notification;
};

export type GetNotificationsApiResponse = {
  message: string;
  body: {
    data: Notification[];
  };
};
