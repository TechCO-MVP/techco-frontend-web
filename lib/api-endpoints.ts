const BASE_URL = process.env.SERVERLESS_URL as string;

/**
 * Helper to handle api endpoints
 */
export const apiEndpoints = {
  signUp() {
    return `${BASE_URL}/auth/signup`;
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
  listBusiness() {
    return `${BASE_URL}/business/list`;
  },
};
