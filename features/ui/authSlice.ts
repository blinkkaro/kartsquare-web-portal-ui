import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { User } from "@/services/auth/auth.interface";
import { UserRegisterSteps } from "@/types/resgistrationFlow";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  register_step: UserRegisterSteps | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  register_step: null,
};

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
});

export const { setCredentials, logout, updateUser, hydrateAuth } =
  authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
