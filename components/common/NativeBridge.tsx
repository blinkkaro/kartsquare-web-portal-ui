"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser, selectIsAuthenticated } from "@/features/ui/authSlice";
import { getTokens } from "@/utils/auth";

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void };
    __KARTSQUARE_WEBVIEW__?: boolean;
  }
}

/**
 * Inside the Kartsquare mobile app this reports the session to the native
 * shell so native screens (reels, tab bar) can call the API and show the
 * right tabs for the user's role. No-op in a normal browser.
 */
export default function NativeBridge() {
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const role = user?.role ?? null;

  useEffect(() => {
    if (typeof window !== "undefined" && window.ReactNativeWebView) {
      // Fallback in case the pre-paint script in layout ran before the bridge existed.
      document.documentElement.setAttribute("data-native", "1");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ReactNativeWebView) return;
    // Debounced: auth state hydrates from storage a tick after mount, and the
    // transient "signed out" state must not reach the native shell.
    const timer = setTimeout(() => {
      const { accessToken } = getTokens();
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "session",
          isAuthenticated,
          role,
          userId: user?.id ?? null,
          // re-sent on route change so a token refreshed by the web app is picked up
          accessToken: isAuthenticated ? accessToken : null,
        }),
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [isAuthenticated, role, user?.id, pathname]);

  return null;
}
