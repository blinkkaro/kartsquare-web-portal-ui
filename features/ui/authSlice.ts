import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { User, LoginCredentials, RegisterData } from "@/services/auth/auth.interface";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { authService } from "@/services/auth/auth.service";
import { secureStorage } from "@/helper/SecureStorage";

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
      console.log("response", response);
      return response.data;
    } catch (error: any) {
      console.log("error", error);
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      // Continue with logout even if API call fails
      return rejectWithValue(
        error.response?.data?.message || "Logout API call failed"
      );
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

      // Persist to secureStorage
      if (typeof window !== "undefined") {
        secureStorage.setItem("user_details", user);
        secureStorage.setItem("register_step", register_step);
        secureStorage.setItem("role", user.role);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.register_step = null;

      // Clear secureStorage
      if (typeof window !== "undefined") {
        secureStorage.removeItem("user_details");
        secureStorage.removeItem("token");
        secureStorage.removeItem("refreshToken");
        secureStorage.removeItem("register_step");
        secureStorage.removeItem("role");
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update secure storage
        secureStorage.setItem("user_details", state.user);
      }
    },
    hydrateAuth: (state) => {
      // Restore auth state from secureStorage
      if (typeof window !== "undefined") {
        const token = secureStorage.getItem("token");
        const user = secureStorage.getItem("user_details");
        const registerStep = secureStorage.getItem("register_step");

        if (token && user) {
          state.token = token;
          state.isAuthenticated = true;
          state.user = user;
          state.register_step = registerStep || user.register_step;
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

        // Secure Storage
        secureStorage.setItem("user_details", action.payload.user);
        secureStorage.setItem("token", action.payload.tokens.access_token);
        secureStorage.setItem(
          "refreshToken",
          action.payload.tokens.refresh_token
        );
        secureStorage.setItem(
          "register_step",
          action.payload.user.register_step
        );
        secureStorage.setItem("role", action.payload.user.role);
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

        // Secure Storage
        secureStorage.setItem("user_details", action.payload.user);
        secureStorage.setItem("token", action.payload.tokens.access_token);
        secureStorage.setItem(
          "refreshToken",
          action.payload.tokens.refresh_token
        );
        secureStorage.setItem(
          "register_step",
          action.payload.user.register_step
        );
        secureStorage.setItem("role", action.payload.user.role);
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
