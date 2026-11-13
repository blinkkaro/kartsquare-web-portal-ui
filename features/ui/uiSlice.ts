import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  mode: "light" | "dark";
  isAiOpen: boolean;
  /** A query another screen wants the assistant to run when it opens (home search, symptom chips). */
  aiPendingQuery: string | null;
  /** True while an inline Kart AI entry (the home hero) is on screen, so the floating AI button steps aside. */
  inlineAiVisible: boolean;
  /** Goes up each time something asks for a fresh Kart AI conversation; the chat starts over when it sees a new value. */
  aiNewChat: number;
}

const initialState: UiState = {
  mode: "light", // Default to light, but will be hydrated from localStorage/system
  isAiOpen: false,
  aiPendingQuery: null,
  inlineAiVisible: false,
  aiNewChat: 0,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Light-only site: both stay as no-ops so existing imports keep compiling.
    toggleTheme: (state) => {
      state.mode = "light";
    },
    setTheme: (state, _action: PayloadAction<"light" | "dark">) => {
      state.mode = "light";
    },
    hydrateTheme: (state) => {
      // The site is light-only: ignore any saved or system dark preference and
      // drop the stale value so it can never come back.
      state.mode = "light";
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("theme");
        } catch {
          /* storage unavailable */
        }
      }
    },
    /** Open the assistant on a brand-new conversation: its welcome message, nothing carried over, nothing run. */
    openAiNewChat: (state) => {
      state.isAiOpen = true;
      state.aiPendingQuery = null;
      state.aiNewChat += 1;
    },
    setInlineAiVisible: (state, action: PayloadAction<boolean>) => {
      state.inlineAiVisible = action.payload;
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
  setInlineAiVisible,
  openAiNewChat,
  openAiWithQuery,
  clearAiPendingQuery,
} = uiSlice.actions;
export default uiSlice.reducer;
