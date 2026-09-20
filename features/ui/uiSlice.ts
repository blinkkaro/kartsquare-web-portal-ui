import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  mode: "light" | "dark";
  isAiOpen: boolean;
  /** A query another screen wants the assistant to run when it opens (home search, symptom chips). */
  aiPendingQuery: string | null;
}

const initialState: UiState = {
  mode: "light", // Default to light, but will be hydrated from localStorage/system
  isAiOpen: false,
  aiPendingQuery: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";

      // Persist theme to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.mode);
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.mode = action.payload;

      // Persist theme to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
      }
    },
    hydrateTheme: (state) => {
      // Restore theme from localStorage or system preference
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme") as
          | "light"
          | "dark"
          | null;

        if (savedTheme) {
          state.mode = savedTheme;
        } else {
          // Fallback to system preference
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;
          state.mode = prefersDark ? "dark" : "light";
        }
      }
    },
    setAiOpen: (state, action: PayloadAction<boolean>) => {
      state.isAiOpen = action.payload;
    },
    /** Open the assistant and have it run `query` immediately. */
    openAiWithQuery: (state, action: PayloadAction<string>) => {
      state.isAiOpen = true;
      state.aiPendingQuery = action.payload;
    },
    clearAiPendingQuery: (state) => {
      state.aiPendingQuery = null;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  hydrateTheme,
  setAiOpen,
  openAiWithQuery,
  clearAiPendingQuery,
} = uiSlice.actions;
export default uiSlice.reducer;
