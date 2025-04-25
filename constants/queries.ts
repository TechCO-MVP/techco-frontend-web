export const QUERIES = {
  COMPANY_LIST: ["companies"] as const,
  NOTIFICATIONS: ["notifications"] as const,
  USER_LIST: (businessId?: string) => ["users", businessId] as const,
  CURRENT_USER: ["current-user"] as const,
  POSITION_LIST: (businessId?: string, userId?: string) =>
    ["positions", businessId, userId] as const,
  PIPE_DATA: (id?: number | string) => ["pipefy-pipe", id] as const,
  CARD_DATA: (id?: number | string) => ["pipefy-card", id] as const,
  PIPES_DATA: (id?: number | string) => ["pipefy-card", id] as const,
  HIRING_PROCESS: (id: number | string) => ["hiring-poccess", id] as const,
  PROFILE_FILTER_STATUS: (id: string) =>
    ["prosition-filter-status", id] as const,
  POSITION_CONFIG_LIST: (business_id: string, id?: string) =>
    ["position-config-list", business_id, id] as const,
  MESSAGE_HISTORY: (threadId?: string, limit?: number, messageId?: string) =>
    ["message-history", threadId, limit, messageId] as const,
};
