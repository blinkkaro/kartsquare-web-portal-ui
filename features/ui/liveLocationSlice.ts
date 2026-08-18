import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { liveLocationService } from "@/services/liveLocation/liveLocationService";
import type {
  LiveLocationStatus,
  LocationMode,
} from "@/services/liveLocation/liveLocationInterface";

/**
 * Broadcast state for the signed-in provider.
 *
 * This is UI state, not server state — it drives the "you are live" indicator
 * that must be visible from every dashboard screen. The positions themselves
 * are never held here; they go straight from the tracker to the network.
 */

interface LiveLocationState {
  mode: LocationMode;
  isBroadcasting: boolean;
  expiresAt: string | null;
  areaLabel: string | null;
  liveRadiusKm: number | null;
  /** Whether the provider has accepted the location-sharing consent. */
  hasConsented: boolean;
  consentPromptOpen: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: LiveLocationState = {
  mode: "STATIC",
  isBroadcasting: false,
  expiresAt: null,
  areaLabel: null,
  liveRadiusKm: null,
  hasConsented: false,
  consentPromptOpen: false,
  loading: false,
  error: null,
};

export const fetchLiveLocationStatus = createAsyncThunk(
  "liveLocation/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      return await liveLocationService.getStatus();
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : "Could not load location status",
      );
    }
  },
);

export const setLiveLocationMode = createAsyncThunk(
  "liveLocation/setMode",
  async (
    payload: { mode: LocationMode; liveRadiusKm?: number | null },
    { rejectWithValue },
  ) => {
    try {
      return await liveLocationService.setMode({
        mode: payload.mode,
        live_radius_km: payload.liveRadiusKm ?? null,
      });
    } catch (e) {
      return rejectWithValue(
        e instanceof Error ? e.message : "Could not change location mode",
      );
    }
  },
);

const applyStatus = (
  state: LiveLocationState,
  status: LiveLocationStatus,
): void => {
  state.mode = status.mode;
  state.isBroadcasting = status.is_broadcasting;
  state.expiresAt = status.expires_at;
  state.areaLabel = status.area_label;
  state.liveRadiusKm = status.live_radius_km;
};

const liveLocationSlice = createSlice({
  name: "liveLocation",
  initialState,
  reducers: {
    // Set from the hook so the indicator reacts immediately rather than waiting
    // for the next status fetch.
    broadcastingChanged(state, action: PayloadAction<boolean>) {
      state.isBroadcasting = action.payload;
      if (!action.payload) state.expiresAt = null;
    },
    consentGranted(state) {
      state.hasConsented = true;
      state.consentPromptOpen = false;
    },
    consentRevoked(state) {
      // Revoking consent must also stop the broadcast, not just hide the UI.
      state.hasConsented = false;
      state.isBroadcasting = false;
      state.mode = "STATIC";
      state.expiresAt = null;
    },
    consentPromptOpened(state) {
      state.consentPromptOpen = true;
    },
    consentPromptClosed(state) {
      state.consentPromptOpen = false;
    },
    errorCleared(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveLocationStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLiveLocationStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        applyStatus(state, action.payload);
      })
      .addCase(fetchLiveLocationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(setLiveLocationMode.pending, (state) => {
        state.loading = true;
      })
      .addCase(setLiveLocationMode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        applyStatus(state, action.payload);
      })
      .addCase(setLiveLocationMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  broadcastingChanged,
  consentGranted,
  consentRevoked,
  consentPromptOpened,
  consentPromptClosed,
  errorCleared,
} = liveLocationSlice.actions;

export const selectLiveLocation = (state: RootState) => state.liveLocation;
export const selectIsBroadcasting = (state: RootState) =>
  state.liveLocation.isBroadcasting;
export const selectHasLocationConsent = (state: RootState) =>
  state.liveLocation.hasConsented;

export default liveLocationSlice.reducer;
