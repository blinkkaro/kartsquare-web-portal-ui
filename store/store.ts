import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '@/features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
