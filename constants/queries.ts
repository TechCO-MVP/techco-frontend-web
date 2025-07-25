export const QUERIES = {
  COMPANY_LIST: ["companies"] as const,
  NOTIFICATIONS: ["notifications"] as const,
  USER_LIST: (businessId?: string, excludeBusinessId?: string) =>
    ["users", businessId, excludeBusinessId] as const,
  CURRENT_USER: ["current-user"] as const,
  POSITION_LIST: (businessId?: string, userId?: string) =>
    ["positions", businessId, userId] as const,
  PIPE_DATA: (id?: number | string) => ["pipefy-pipe", id] as const,
  CARD_DATA: (id?: number | string) => ["pipefy-card", id] as const,
  PIPES_DATA: (id?: number | string) => ["pipefy-card", id] as const,
  HIRING_PROCESS: (id: number | string) => ["hiring-poccess", id] as const,
  PROFILE_FILTER_STATUS: (id: string) =>
    ["prosition-filter-status", id] as const,
  POSITION_CONFIG_LIST: (businessId?: string, id?: string) =>
    ["position-config-list", businessId, id] as const,
  MESSAGE_HISTORY: (threadId?: string, limit?: number, messageId?: string) =>
    ["message-history", threadId, limit, messageId] as const,
  POSITION_CONFIG_LIST_ALL: () => ["position-config-list"] as const,
  PIPE_DATA_ALL: ["pipefy-pipe"] as const,
  POSITION_BY_ID: (id: string) => ["position-by-id", id] as const,
  POSITIONS_BY_BUSINESS: (id: string) => ["positions-by-business", id] as const,
  FILE_PROCESSING_STATUS: (id: string) =>
    ["file-processing-status", id] as const,
};
