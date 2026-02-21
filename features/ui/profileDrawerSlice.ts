import { AppUserType } from "@/services/auth/auth.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DrawerState {
  isOpen: boolean;
  userId: string;
  role: AppUserType;
  username: string;
}

const initialState: DrawerState = {
  isOpen: false,
  userId: "",
  role: AppUserType.SERVICE_PROVIDER,
  username: "",
};

const profileDrawerSlice = createSlice({
  name: "profileDrawer",
  initialState,
  reducers: {
    openDrawer: (state, action: PayloadAction<{ userId: string; role?: AppUserType; username?: string }>) => {
      state.isOpen = true;
      state.userId = action.payload.userId;
      state.role = action.payload.role || AppUserType.SERVICE_PROVIDER;
      state.username = action.payload.username || "";
    },
    closeDrawer: (state) => {
      state.isOpen = false;
      state.userId = "";
      state.role = AppUserType.SERVICE_PROVIDER;
      state.username = "";
    },
  },
});

export const { openDrawer, closeDrawer } = profileDrawerSlice.actions;
export default profileDrawerSlice.reducer;
