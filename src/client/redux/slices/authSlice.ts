import { LoginSchema, RegisterSchema } from "@/src/schemas";
import axios from "@/src/client/helpers/api.ts";
import { registerUser } from "@/src/client/helpers/auth_helper.ts";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { z } from "zod";
import { IUser } from "../../lib/types";

interface StateType {
  currentUser: IUser | null;
  accessToken: string | null;
  isOnline: boolean;
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: StateType = {
  currentUser: null,
  accessToken: null,
  isOnline: false,
  success: false,
  loading: false,
  error: null,
};

export const loginUserAsync = createAsyncThunk(
  "user/loginUser",
  async (
    { email, password }: z.infer<typeof LoginSchema>,
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post("/login", { email, password });
      toast.success(response.data.message || "Login successful");
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const registerUserAsync = createAsyncThunk(
  "user/registerUser",
  async (data: z.infer<typeof RegisterSchema>, { rejectWithValue }) => {
    try {
      const response = await registerUser(data);
      toast.success(response.data.message || "Registration successful");
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const refreshTokenAsync = createAsyncThunk(
  "user/refreshToken",
  async () => {
    const response = await axios.get("/refresh");
    return response;
  },
);

export const logoutUserAsync = createAsyncThunk("user/logoutUser", async () => {
  const response = await axios.post("/logout");
  return response;
});

export const updateUserProfileAsync = createAsyncThunk(
  "user/updateProfile",
  async (
    data: { name?: string; email?: string; avatar?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.put("/user/profile", data);
      toast.success("Profile updated successfully");
      return response;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to update profile";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentUser = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        localStorage.setItem("authenticated", JSON.stringify(state.success));
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = (action.payload as string) || "Registration failed";
      })
      .addCase(refreshTokenAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.currentUser = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.success = true;
        state.loading = false;
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = (action.payload as string) || "Session failed";
      })
      .addCase(logoutUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.currentUser = null;
        state.accessToken = null;
        state.success = true;
        state.loading = false;
        localStorage.removeItem("authenticated");
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.error = (action.payload as string) || "Logout failed";
        state.loading = false;
        state.success = false;
      })
      .addCase(updateUserProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.currentUser) {
          state.currentUser = {
            ...state.currentUser,
            ...action.payload.data.user,
          };
        }
      })
      .addCase(updateUserProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = (action.payload as string) || "Update failed";
      });
  },
});

export const { setUserOnlineStatus } = authSlice.actions;
export default authSlice.reducer;
