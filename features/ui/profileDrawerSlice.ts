import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DrawerState {
  isOpen: boolean;
  userId: string;
}

const initialState: DrawerState = {
  isOpen: false,
  userId: "",
};

const profileDrawerSlice = createSlice({
  name: "profileDrawer",
  initialState,
  reducers: {
    openDrawer: (state, action: PayloadAction<{ userId: string }>) => {
      state.isOpen = true;
      state.userId = action.payload.userId;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
      state.userId = "";
    },
  },
});

export const { openDrawer, closeDrawer } = profileDrawerSlice.actions;
export default profileDrawerSlice.reducer;
