export type Country = {
  label: string;
  value: string;
  code: string;
};

export type User = {
  _id: string;
  full_name: string;
  email: string;
  company_position: string;
  role: string;
  business_id: string;
  status: "enabled" | "disabled" | "pending";
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
