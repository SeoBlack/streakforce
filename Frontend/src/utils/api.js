export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY: "/auth/verify",
  USERS: "/users",
  HABITS: "/habits",
  CHECKINS: "/checkins",
  AI: "/ai",
  SUBMISSIONS: "/submissions",
  GOOGLE_AUTH: "/auth/google-auth",
};

export const API_BASE_URL = import.meta.env.VITE_BACKEND_ENDPOINT;
