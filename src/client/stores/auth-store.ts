import { create } from "zustand";
import { IUser } from "../lib/types";

interface AuthState {
  currentUser: IUser | null;
  accessToken: string | null;
  isOnline: boolean;
  success: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: IUser | null) => void;
  setAccessToken: (token: string | null) => void;
  setOnlineStatus: (online: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  setAuth: (data: { user: IUser; accessToken: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  currentUser: null,
  accessToken: null,
  isOnline: false,
  success: false,
  loading: false,
  error: null,

  setUser: (user) => set({ currentUser: user }),
  setAccessToken: (token) => set({ accessToken: token }),
  setOnlineStatus: (online) => set({ isOnline: online }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),

  setAuth: ({ user, accessToken }) =>
    set({
      currentUser: user,
      accessToken,
      success: true,
      loading: false,
      error: null,
    }),

  clearAuth: () =>
    set({
      currentUser: null,
      accessToken: null,
      isOnline: false,
      success: false,
      loading: false,
      error: null,
    }),
}));
