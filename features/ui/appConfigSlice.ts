import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { AIServiceConfigResponse } from "@/services/appConfig/appConfigInterface";
import { appConfigService } from "@/services/appConfig/appConfigServices";
import { secureStorage } from "@/helper/SecureStorage";

interface AppConfigState {
  aiServiceConfig: AIServiceConfigResponse | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null; // Timestamp of last fetch
}

const initialState: AppConfigState = {
  aiServiceConfig: null,
  loading: false,
  error: null,
  lastFetched: null,
};

// Cache duration: 5 minutes (300000 ms)
const CACHE_DURATION = 5 * 60 * 1000;

// Async thunk to fetch AI Service Config
export const fetchAIServiceConfig = createAsyncThunk(
  "appConfig/fetchAIServiceConfig",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { lastFetched, aiServiceConfig } = state.appConfig;

      // Check if we have cached data that's still fresh
      if (
        aiServiceConfig &&
        lastFetched &&
        Date.now() - lastFetched < CACHE_DURATION
      ) {
        return aiServiceConfig;
      }

      // Try to get from localStorage first
      if (typeof window !== "undefined") {
        const cached = secureStorage.getItem("aiServiceConfig");
        const cachedTimestamp = secureStorage.getItem("aiServiceConfigTimestamp");
        
        if (
          cached &&
          cachedTimestamp &&
          Date.now() - cachedTimestamp < CACHE_DURATION
        ) {
          return cached;
        }
      }

      // Fetch from API
      const data = await appConfigService.getAppAIServiceConfig();

      // Cache in localStorage
      if (typeof window !== "undefined") {
        secureStorage.setItem("aiServiceConfig", data);
        secureStorage.setItem("aiServiceConfigTimestamp", Date.now());
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch AI service config"
      );
    }
  }
);

export const appConfigSlice = createSlice({
  name: "appConfig",
  initialState,
  reducers: {
    clearAIServiceConfig: (state) => {
      state.aiServiceConfig = null;
      state.lastFetched = null;
      if (typeof window !== "undefined") {
        secureStorage.removeItem("aiServiceConfig");
        secureStorage.removeItem("aiServiceConfigTimestamp");
      }
    },
    hydrateAppConfig: (state) => {
      // Restore from localStorage on app load
      if (typeof window !== "undefined") {
        const cached = secureStorage.getItem("aiServiceConfig");
        const cachedTimestamp = secureStorage.getItem("aiServiceConfigTimestamp");
        
        if (
          cached &&
          cachedTimestamp &&
          Date.now() - cachedTimestamp < CACHE_DURATION
        ) {
          state.aiServiceConfig = cached;
          state.lastFetched = cachedTimestamp;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIServiceConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIServiceConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.aiServiceConfig = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchAIServiceConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAIServiceConfig, hydrateAppConfig } =
  appConfigSlice.actions;

export const selectAIServiceConfig = (state: RootState) =>
  state.appConfig.aiServiceConfig;
export const selectAppConfigLoading = (state: RootState) =>
  state.appConfig.loading;
export const selectAppConfigError = (state: RootState) =>
  state.appConfig.error;

export default appConfigSlice.reducer;
