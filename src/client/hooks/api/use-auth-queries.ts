import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { LoginSchema, RegisterSchema } from "@/src/schemas";
import axios from "@/src/client/helpers/api";
import { axiosPrivate } from "@/src/client/helpers/api";
import { registerUser } from "@/src/client/helpers/auth_helper";
import { useAuthStore } from "@/src/client/stores/auth-store";

export function useLogin() {
  const { setAuth, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: z.infer<typeof LoginSchema>) => {
      const response = await axios.post("/login", data);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setAuth({
        user: response.data.user,
        accessToken: response.data.accessToken,
      });
      localStorage.setItem("authenticated", JSON.stringify(true));
      toast.success(response.data.message || "Login successful");
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    },
  });
}

export function useRegister() {
  const { setLoading, setError, setSuccess } = useAuthStore();

  return useMutation({
    mutationFn: async (data: z.infer<typeof RegisterSchema>) => {
      const response = await registerUser(data);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setLoading(false);
      setSuccess(true);
      toast.success(response.data.message || "Registration successful");
    },
    onError: (err: any) => {
      setLoading(false);
      setSuccess(false);
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      toast.error(message);
    },
  });
}

export function useRefreshToken() {
  const { setAuth, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.get("/refresh");
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      setAuth({
        user: response.data.user,
        accessToken: response.data.accessToken,
      });
    },
    onError: (err: any) => {
      setLoading(false);
      setError((err as string) || "Session failed");
    },
  });
}

export function useLogout() {
  const { clearAuth, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.get("/logout");
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: () => {
      clearAuth();
      localStorage.removeItem("authenticated");
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || "Logout failed";
      setError(message);
    },
  });
}

export function useUpdateProfile() {
  const { setLoading, setError } = useAuthStore();

  return useMutation({
    mutationFn: async (data: {
      name?: string;
      email?: string;
      avatar?: string;
    }) => {
      const response = await axiosPrivate.put("/user/profile", data);
      return response;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      const currentUser = useAuthStore.getState().currentUser;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          ...response.data.user,
        });
      }
      setLoading(false);
      toast.success("Profile updated successfully");
    },
    onError: (err: any) => {
      setLoading(false);
      const message = err.response?.data?.message || "Failed to update profile";
      setError(message);
      toast.error(message);
    },
  });
}
