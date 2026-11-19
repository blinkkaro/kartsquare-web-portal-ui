"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Box } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { COLORS } from "@/constants/colors";
import { NAVIGATION_START_EVENT } from "@/lib/navigationProgress";

/** Wait this long before showing: a prefetched page usually swaps in sooner, and then no bar flickers. */
export const SHOW_DELAY_MS = 120;
/** Never leave the bar up longer than this (a navigation that fails or is cancelled). */
export const MAX_VISIBLE_MS = 15000;
/** How long the finished (full) bar stays before it is removed. */
export const FINISH_MS = 300;

type Phase = "idle" | "pending" | "loading" | "done";

const grow = keyframes`from { transform: scaleX(0.08); } to { transform: scaleX(0.9); }`;
const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.35; }`;

/**
 * A slim bar across the top of the screen from the moment a link is tapped until the next page is
 * on screen, on phones and desktop alike. Without it a tap on a slow mobile connection looks ignored.
 * Under reduced motion (often switched on by Android battery saver) it stays full width and only
 * fades in and out, so it is still visible instead of frozen.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const search = useSearchParams()?.toString() ?? "";
  const routeKey = `${pathname}?${search}`;
  const [phase, setPhase] = useState<Phase>("idle");
  const [lastRouteKey, setLastRouteKey] = useState(routeKey);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // The URL changed: the new page is rendering, so finish the bar (or drop it if it never showed).
  // Adjusted during render, React's pattern for state that follows a prop.
  if (routeKey !== lastRouteKey) {
    setLastRouteKey(routeKey);
    const next = phase === "loading" ? "done" : "idle";
    if (next !== phase) setPhase(next);
  }

  // A navigation started (announced from instrumentation-client's onRouterTransitionStart).
  useEffect(() => {
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const onStart = () => {
      clear();
      setPhase("pending");
      timers.current.push(
        setTimeout(() => setPhase((p) => (p === "pending" ? "loading" : p)), SHOW_DELAY_MS),
        setTimeout(() => setPhase("idle"), MAX_VISIBLE_MS),
      );
    };
    window.addEventListener(NAVIGATION_START_EVENT, onStart);
    return () => {
      window.removeEventListener(NAVIGATION_START_EVENT, onStart);
      clear();
    };
  }, []);

  // Let the full bar fade out, then remove it.
  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => setPhase((p) => (p === "done" ? "idle" : p)), FINISH_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "idle" || phase === "pending") return null;

  const done = phase === "done";
  return (
    <Box
      role="progressbar"
      aria-label="Loading page"
      aria-busy={!done}
      sx={{
        position: "fixed",
        top: "env(safe-area-inset-top, 0px)",
        left: 0,
        right: 0,
        height: 3,
        zIndex: 2000, // above the fixed header (1200) and drawers
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <Box
        data-phase={phase}
        sx={{
          height: "100%",
          transformOrigin: "left center",
          background: `linear-gradient(90deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.SECONDARY_ORANGE})`,
          boxShadow: `0 0 8px ${COLORS.PRIMARY_PURPLE}`,
          ...(done
            ? {
                transform: "scaleX(1)",
                opacity: 0,
                transition: `transform 150ms ease-out, opacity ${FINISH_MS}ms ease ${FINISH_MS / 3}ms`,
              }
            : { animation: `${grow} 8s cubic-bezier(0.1, 0.7, 0.3, 1) forwards` }),
          "@media (prefers-reduced-motion: reduce)": done
            ? { transition: `opacity ${FINISH_MS}ms ease`, transform: "scaleX(1)" }
            : { transform: "scaleX(1)", animation: `${pulse} 1.2s ease-in-out infinite` },
        }}
      />
    </Box>
  );
}
