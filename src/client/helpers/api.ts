import axios from "axios";
import { useAuthStore } from "../stores/auth-store";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest.sent) {
      originalRequest.sent = true;
      try {
        // Directly call the refresh endpoint instead of dispatching Redux thunk
        const refreshAxios = axios.create({
          baseURL: BASE_URL,
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const response = await refreshAxios.get("/refresh");
        const { user, accessToken } = response.data;

        useAuthStore.getState().setAuth({ user, accessToken });

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosPrivate(originalRequest);
      } catch (err) {
        // Refresh failed, clear auth
        useAuthStore.getState().clearAuth();
        localStorage.removeItem("authenticated");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export { axiosPrivate };
