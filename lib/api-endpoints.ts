const BASE_URL = process.env.SERVERLESS_URL as string;

/**
 * Helper to handle api endpoints
 */
export const apiEndpoints = {
  signUp() {
    return `${BASE_URL}/auth/signup`;
  },
  signOut() {
    return `${BASE_URL}/auth/sign_out`;
  },
  startAuth() {
    return `${BASE_URL}/auth/start_auth`;
  },
  verifyOtpCode() {
    return `${BASE_URL}/auth/verify_auth_otp_code`;
  },
  verifyOtpCodeSignUp() {
    return `${BASE_URL}/auth/verify_auth_otp_code_signup`;
  },
  updateBusiness(id?: string) {
    return `${BASE_URL}/business/update/${id}`;
  },
  createBusiness() {
    return `${BASE_URL}/business/create`;
  },
  listBusiness() {
    return `${BASE_URL}/business/list`;
  },
  listUsers() {
    return `${BASE_URL}/user/list`;
  },
  listPositions() {
    return `${BASE_URL}/position/list`;
  },
  getHiringProcess() {
    return `${BASE_URL}/hiring_process/id`;
  },
  sendFileToAssistant() {
    return `${BASE_URL}/hiring_process/send_file_to_assistant`;
  },
  createUser() {
    return `${BASE_URL}/user/create`;
  },
  updateUser() {
    return `${BASE_URL}/user/data`;
  },
  updateUserStatus() {
    return `${BASE_URL}/user/status`;
  },
  updatePositionStatus() {
    return `${BASE_URL}/position/status`;
  },
  refreshTokens() {
    return `${BASE_URL}/auth/refresh_tokens`;
  },
  positionsByBusiness({ businessId }: { businessId: string }) {
    return `${BASE_URL}/position/list/${businessId}`;
  },
  positionDetails({
    token,
    positionId,
  }: {
    token?: string;
    positionId?: string;
  }) {
    if (token) {
      return `${BASE_URL}/position/token?token=${token}`;
    }
    if (positionId) {
      return `${BASE_URL}/position/token?position_id=${positionId}`;
    }
    return `${BASE_URL}/position/token?token=${token}`;
  },
  getProfileFilterStatus() {
    return `${BASE_URL}/profile/filter`;
  },
  getNotifications() {
    return `${BASE_URL}/notification/list`;
  },
  updateNotificationStatus() {
    return `${BASE_URL}/notification/status`;
  },
  createNotification() {
    return `${BASE_URL}/notification/create`;
  },
  messageHistory() {
    return `${BASE_URL}/llm/message_history`;
  },
  checkFileProcessingStatus() {
    return `${BASE_URL}/hiring_process/check_status`;
  },
  assistantResponse() {
    return `${BASE_URL}/hiring_process/assistant/response`;
  },
  createPositionConfiguration() {
    return `${BASE_URL}/position_configuration/create`;
  },
  createPosition() {
    return `${BASE_URL}/position_configuration/create/position`;
  },
  updatePositionConfiguration() {
    return `${BASE_URL}/position_configuration/update`;
  },
  updateHiringProcessCustomFields() {
    return `${BASE_URL}/hiring_process/custom_fields/update`;
  },
  listPositionConfigurations() {
    return `${BASE_URL}/position_configuration/list`;
  },
  completePhase() {
    return `${BASE_URL}/position_configuration/complete/phase`;
  },
  nextPhase() {
    return `${BASE_URL}/position_configuration/next_phase`;
  },
  profileFilterStartUrl() {
    return `${BASE_URL}/profile/filter/start/url`;
  },
  deletePositionConfiguration(id: string) {
    return `${BASE_URL}/position_configuration/${id}`;
  },
};
