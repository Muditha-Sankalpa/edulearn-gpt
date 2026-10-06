import axios from "axios";
import { forceLogout } from "../utils/authBridge";

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn(
    "VITE_API_BASE_URL is not set — API requests will fail. Set it in your .env file (see .env.example)."
  );
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthRequest) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
