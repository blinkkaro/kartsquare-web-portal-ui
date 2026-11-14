"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { Box } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { COLORS } from "@/constants/colors";
import { useHomeServices } from "@/hooks/useHomeServices";
import { homeServiceNames } from "@/lib/homeServices";
import { searchHref } from "@/lib/homeHero";
import { ShimmerBox } from "./HomeLoading";

const scroll = keyframes`from { transform: translateX(0); } to { transform: translateX(-50%); }`;

/**
 * A slow, endless strip of the service types we really have providers for. Each one is a search link.
 * It pauses on hover and keyboard focus. The second copy exists only to make the loop seamless, so it is
 * hidden from assistive tech and the tab order. Under reduced motion nothing moves: the strip becomes a
 * one swipeable row of the same links. Renders nothing until real services have loaded.
 */
export default function ServiceMarquee() {
  const { services, isLoading } = useHomeServices();
  const names = useMemo(() => homeServiceNames(services, 12), [services]);
  // While services load, keep the strip's height so the page does not jump when it arrives.
  if (isLoading) {
    return (
      <Box aria-hidden sx={{ borderTop: "1px solid rgba(255,255,255,0.16)", display: "flex", alignItems: "center", gap: 2, height: 53, overflow: "hidden" }}>
        {[110, 150, 130, 170, 120, 150].map((w, i) => (
          <ShimmerBox key={i} tone="onDark" sx={{ width: w, height: 16, borderRadius: 1, flexShrink: 0 }} />
        ))}
      </Box>
    );
  }
  if (names.length === 0) return null;

  const item = (name: string, copy: 0 | 1) => (
    <Box
      component={Link}
      key={`${copy}-${name}`}
      href={searchHref(name)}
      tabIndex={copy === 1 ? -1 : undefined}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.5,
        minHeight: 44,
        pr: 1.5,
        color: COLORS.WHITE,
        fontSize: "0.95rem",
        fontWeight: 700,
        textDecoration: "none",
        whiteSpace: "nowrap",
        flexShrink: 0,
        opacity: 0.92,
        transition: "opacity 140ms ease",
        "&:hover": { opacity: 1, textDecoration: "underline", textUnderlineOffset: 4 },
        "&:focus-visible": { outline: `3px solid ${COLORS.SECONDARY_ORANGE}`, outlineOffset: -3, borderRadius: 4 },
      }}
    >
      <Box component="span" aria-hidden sx={{ color: COLORS.SECONDARY_ORANGE, fontSize: "0.8rem" }}>
        ✦
      </Box>
      {name}
    </Box>
  );

  return (
    <Box
      component="nav"
      aria-label="Services we cover"
      sx={{
        borderTop: "1px solid rgba(255,255,255,0.16)",
        overflow: "hidden",
        maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)",
        "@media (prefers-reduced-motion: reduce)": { maskImage: "none", WebkitMaskImage: "none", overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } },
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "max-content",
          py: 0.5,
          animation: `${scroll} ${Math.max(24, names.length * 4)}s linear infinite`,
          "&:hover, &:focus-within": { animationPlayState: "paused" },
          "@media (prefers-reduced-motion: reduce)": { animation: "none", px: 0.5 },
        }}
      >
        {names.map((n) => item(n, 0))}
        <Box
          aria-hidden
          sx={{ display: "flex", "@media (prefers-reduced-motion: reduce)": { display: "none" } }}
          // the repeat is decoration for the loop: no focus, no announcement
          {...({ inert: "" } as Record<string, string>)}
        >
          {names.map((n) => item(n, 1))}
        </Box>
      </Box>
    </Box>
  );
}
