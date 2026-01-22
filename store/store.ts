import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/features/ui/uiSlice";
import authReducer from "@/features/ui/authSlice";
import profileDrawerReducer from "@/features/ui/profileDrawerSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    profileDrawer: profileDrawerReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
