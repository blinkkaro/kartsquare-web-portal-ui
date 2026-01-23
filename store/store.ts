import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "@/features/ui/uiSlice";
import authReducer from "@/features/ui/authSlice";
import profileDrawerReducer from "@/features/ui/profileDrawerSlice";
import appConfigReducer from "@/features/ui/appConfigSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    profileDrawer: profileDrawerReducer,
    appConfig: appConfigReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
