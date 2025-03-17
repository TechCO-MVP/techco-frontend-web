export const QUERIES = {
  COMPANY_LIST: ["companies"] as const,
  USER_LIST: ["users"] as const,
  CURRENT_USER: ["current-user"] as const,
  POSITION_LIST: (businessId?: string, all?: boolean) =>
    ["positions", businessId, all] as const,
  PIPE_DATA: (id?: number | string) => ["pipefy-pipe", id] as const,
  CARD_DATA: (id?: number | string) => ["pipefy-card", id] as const,
  PIPES_DATA: (id?: number | string) => ["pipefy-card", id] as const,
  HIRING_PROCESS: (id: number | string) => ["hiring-poccess", id] as const,
  PROFILE_FILTER_STATUS: (id: string) =>
    ["prosition-filter-status", id] as const,
};
