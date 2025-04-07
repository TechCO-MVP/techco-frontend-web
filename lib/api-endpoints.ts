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
  positionDetails(token: string) {
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
};
