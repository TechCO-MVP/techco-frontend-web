export const QUERIES = {
  COMPANY_LIST: ["companies"] as const,
  USER_LIST: ["users"] as const,
  POSITION_LIST: ["positions"] as const,
  PIPE_DATA: (id: number | string) => ["pipefy-pipe", id] as const,
};
