import React from "react";
import { Box } from "@mui/material";

interface Props {
  children: React.ReactNode;
  /** Seconds for one full loop. Larger = slower. */
  duration?: number;
  gap?: number;
  /** Fade the left/right edges into the background */
  fade?: boolean;
  label?: string;
}

/**
 * Endless auto-scroll row. The content is rendered twice and the track slides by
 * exactly one copy, so the loop is seamless. Pauses while hovered, focused or
 * touched. With prefers-reduced-motion it stops and becomes a normal swipeable row.
 * The duplicate copy is aria-hidden + inert so screen readers/tab order see it once.
 */
export default function Marquee({ children, duration = 40, gap = 10, fade = true, label }: Props) {
  const half = { display: "flex", alignItems: "stretch", gap: `${gap}px`, pr: `${gap}px`, flexShrink: 0 } as const;
  return (
    <Box
      role="group"
      aria-label={label}
      sx={{
        overflow: "hidden",
        mx: { xs: -2, md: 0 },
        WebkitMaskImage: fade ? "linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)" : "none",
        maskImage: fade ? "linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)" : "none",
        "@media (prefers-reduced-motion: reduce)": { overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } },
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "max-content",
          animation: `kMarquee ${duration}s linear infinite`,
          "&:hover, &:focus-within, &:active": { animationPlayState: "paused" },
          "@keyframes kMarquee": { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      >
        <Box sx={half}>{children}</Box>
        <Box sx={{ ...half, "@media (prefers-reduced-motion: reduce)": { display: "none" } }} aria-hidden inert>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
