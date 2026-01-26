import axios from "axios";
import { logoutUserAsync, refreshTokenAsync } from "../redux/slices/authSlice";

import { AppDispatch, RootState } from "../redux/store";

const BASE_URL = "/api";

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

interface StoreInstance {
  getState: () => RootState;
  dispatch: AppDispatch;
}

let storeInstance: StoreInstance | null = null;

export const setStore = (store: StoreInstance) => {
  storeInstance = store;
};

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(
  (config) => {
    const token = storeInstance?.getState().authReducer.accessToken;
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
    if (error.response.status === 403 && !originalRequest.sent) {
      originalRequest.sent = true;
      try {
        const response = await storeInstance.dispatch(refreshTokenAsync());

        if (response.meta.requestStatus === "fulfilled") {
          originalRequest.headers["Authorization"] = `Bearer ${
            storeInstance.getState().authReducer.accessToken
          }`;
          return axiosPrivate(originalRequest);
        }
        storeInstance.dispatch(logoutUserAsync());
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

export { axiosPrivate };
