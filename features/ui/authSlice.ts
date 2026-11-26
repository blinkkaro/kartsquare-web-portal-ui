import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { secureStorage } from "@/helper/SecureStorage";
import { authService } from "@/services/auth/auth.service";
import { clearSession, persistSession, SESSION_KEYS } from "@/utils/auth";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "@/services/auth/auth.interface";
import type { RootState } from "@/store/store";
import type { UserRegisterSteps } from "@/types/resgistrationFlow";
import type { PayloadAction } from "@reduxjs/toolkit";

/** The backend's error message from a failed call, or `fallback`. */
const apiErrorMessage = (error: unknown, fallback: string): string => {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data
    ?.message;
  return typeof message === "string" && message ? message : fallback;
};

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
      return response.data as AuthResponse;
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, "Login failed"));
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.signUp(data);
      return response.data as AuthResponse;
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, "Registration failed"));
    }
  },
);

/** One sign-in path for login and registration: Redux state plus persisted session. */
const signIn = (state: AuthState, payload: AuthResponse) => {
  state.loading = false;
  state.error = null;
  state.isAuthenticated = true;
  state.user = payload.user;
  state.token = payload.tokens.access_token;
  state.register_step = payload.user.register_step;
  persistSession(payload.user, payload.tokens);
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
      }>,
    ) => {
      const { user, token, register_step } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.register_step = register_step;

      persistSession({ ...user, register_step });
    },
    /** A session started outside the login/register thunks (guest sign-in). Same path as loginUser. */
    sessionStarted: (state, action: PayloadAction<AuthResponse>) => {
      signIn(state, action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.register_step = null;

      // Wipe everything stored about the person (and, via onSessionEnd, the query cache).
      clearSession();
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update secure storage
        secureStorage.setItem(SESSION_KEYS.user, state.user);
      }
    },
    hydrateAuth: (state) => {
      // Restore auth state from secureStorage
      if (typeof window !== "undefined") {
        const token = secureStorage.getItem(SESSION_KEYS.accessToken);
        const user = secureStorage.getItem(SESSION_KEYS.user);
        const registerStep = secureStorage.getItem(SESSION_KEYS.registerStep);

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
        signIn(state, action.payload);
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
        signIn(state, action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, sessionStarted, logout, updateUser, hydrateAuth } =
  authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer;
