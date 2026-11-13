"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { useIsFetching } from "@tanstack/react-query";
import { COLORS } from "@/constants/colors";
import type { SxProps, Theme } from "@mui/material/styles";

/**
 * Loading for the home page. Three pieces, all Kartsquare's: a violet-tinted shimmer for placeholders that
 * hold the exact size of what is coming (so nothing jumps when it arrives), the "k" mark drawing itself,
 * and a slim progress bar across the top of the page. Motion here is loading feedback only, and all of it
 * stops under reduced motion.
 */

const sweep = keyframes`from { transform: translateX(-100%); } to { transform: translateX(100%); }`;
const draw = keyframes`0% { stroke-dashoffset: 1; } 55% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 0; }`;
const slide = keyframes`from { transform: translateX(-110%); } to { transform: translateX(320%); }`;

/** A placeholder block. Give it the same width and height as the content that replaces it. */
export function ShimmerBox({ sx, tone = "light" }: { sx?: SxProps<Theme>; tone?: "light" | "onDark" }) {
  const onDark = tone === "onDark";
  return (
    <Box
      aria-hidden
      sx={[
        {
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          bgcolor: onDark ? "rgba(255,255,255,0.14)" : COLORS.PURPLE_ALPHA_10,
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${onDark ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.7)"}, transparent)`,
            animation: `${sweep} 1.4s ease-in-out infinite`,
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

/** The Kartsquare "k" mark, its outline drawing itself in a loop. Still under reduced motion. */
export function KartMark({ size = 32, color = COLORS.PRIMARY_PURPLE }: { size?: number; color?: string }) {
  return (
    <Box
      component="svg"
      aria-hidden
      viewBox="0 0 36 36"
      width={size}
      height={size}
      sx={{ display: "block", flexShrink: 0 }}
    >
      <Box
        component="rect"
        x="3"
        y="3"
        width="30"
        height="30"
        rx="7"
        fill="none"
        stroke={color}
        strokeWidth="3"
        pathLength="1"
        sx={{ strokeDasharray: 1, animation: `${draw} 1.8s ease-in-out infinite`, "@media (prefers-reduced-motion: reduce)": { animation: "none", strokeDashoffset: 0 } }}
      />
      <path d="M13 10v16M13 19l8-8M16 18l6 8" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    </Box>
  );
}

/** The mark with a short line of Kartsquare's own voice, for a placeholder big enough to carry it. */
export function KartLoadingNote({ children = "Aapke liye services dhoondh rahe hain…" }: { children?: React.ReactNode }) {
  return (
    <Box role="status" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.25, textAlign: "center", px: 2 }}>
      <KartMark />
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "text.secondary" }}>{children}</Typography>
    </Box>
  );
}

const SHOW_AFTER_MS = 150;
const MIN_VISIBLE_MS = 500;

/**
 * A slim bar across the top edge of its (positioned) parent while the page is fetching. It only shows after
 * 150ms and stays at least 500ms, so a fast load never flickers it.
 */
export function HomeLoadingBar() {
  const fetching = useIsFetching() > 0;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(fetching), fetching ? SHOW_AFTER_MS : MIN_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [fetching]);

  if (!visible) return null;
  return (
    <Box aria-hidden sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, overflow: "hidden", zIndex: 2, bgcolor: "rgba(255,255,255,0.18)" }}>
      <Box
        sx={{
          width: "30%",
          height: "100%",
          borderRadius: 3,
          background: `linear-gradient(90deg, transparent, ${COLORS.SECONDARY_ORANGE}, ${COLORS.WHITE})`,
          animation: `${slide} 1.1s ease-in-out infinite`,
          "@media (prefers-reduced-motion: reduce)": { animation: "none", width: "100%", background: COLORS.SECONDARY_ORANGE },
        }}
      />
    </Box>
  );
}
