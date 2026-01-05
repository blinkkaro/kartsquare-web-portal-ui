import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
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
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.register_step = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
