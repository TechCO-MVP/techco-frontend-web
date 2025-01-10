export type Country = {
  label: string;
  value: string;
  code: string;
};

export type User = {
  name: string;
  email: string;
  position?: string;
  role?: string;
  status: string;
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
