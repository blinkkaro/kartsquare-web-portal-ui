"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateAuth } from "@/features/ui/authSlice";
import { hydrateTheme } from "@/features/ui/uiSlice";
import { hydrateAppConfig } from "@/features/ui/appConfigSlice";

/**
 * Custom hook to hydrate Redux store from localStorage on app initialization
 * Restores auth state (token, registration step, role), theme preference, and app config
 */
export function useHydrateStore() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate auth state from localStorage
    dispatch(hydrateAuth());

    // Hydrate theme from localStorage or system preference
    dispatch(hydrateTheme());

    // Hydrate app config from localStorage
    dispatch(hydrateAppConfig());
  }, [dispatch]);
}
