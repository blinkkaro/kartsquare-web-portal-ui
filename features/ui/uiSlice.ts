import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  mode: 'light' | 'dark';
}

const initialState: UiState = {
  mode: 'light', // Default to light, but will be hydrated from localStorage/system
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
