import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { User, LoginCredentials, RegisterData } from "@/services/auth/auth.interface";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { authService } from "@/services/auth/auth.service";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  register_step: UserRegisterSteps | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  register_step: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.signUp(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        register_step: number;
      }>
    ) => {
      const { user, token, register_step } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.register_step = register_step;

      // Persist registration step and role to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("register_step", register_step.toString());
        localStorage.setItem("role", user.role);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.register_step = null;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("register_step");
        localStorage.removeItem("role");
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    hydrateAuth: (state) => {
      // Restore auth state from localStorage
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const registerStep = localStorage.getItem("register_step");
        const role = localStorage.getItem("role");

        if (token && registerStep && role) {
          state.token = token;
          state.isAuthenticated = true;
          state.register_step = parseInt(registerStep, 10);
          // Note: We don't restore full user object, only essential fields
          // The user object will be fetched from API if needed
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.tokens.access_token;
        state.register_step = action.payload.user.register_step;

        // Local Storage
        localStorage.setItem("token", action.payload.tokens.access_token);
        localStorage.setItem("refreshToken", action.payload.tokens.refresh_token);
        localStorage.setItem("register_step", action.payload.user.register_step.toString());
        localStorage.setItem("role", action.payload.user.role);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.tokens.access_token;
        state.register_step = action.payload.user.register_step;

        // Local Storage
        localStorage.setItem("token", action.payload.tokens.access_token);
        localStorage.setItem("refreshToken", action.payload.tokens.refresh_token);
        localStorage.setItem("register_step", action.payload.user.register_step.toString());
        localStorage.setItem("role", action.payload.user.role);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout, updateUser, hydrateAuth } =
  authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
