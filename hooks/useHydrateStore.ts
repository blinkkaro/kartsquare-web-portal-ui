"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateAuth } from "@/features/ui/authSlice";
import { hydrateTheme } from "@/features/ui/uiSlice";

/**
 * Custom hook to hydrate Redux store from localStorage on app initialization
 * Restores auth state (token, registration step, role) and theme preference
 */
export function useHydrateStore() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate auth state from localStorage
    dispatch(hydrateAuth());

    // Hydrate theme from localStorage or system preference
    dispatch(hydrateTheme());
  }, [dispatch]);
}
