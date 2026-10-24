import React from "react";
import { Box, Typography } from "@mui/material";
import { COLORS } from "@/constants/colors";

/**
 * One typographic scale for every section heading on the home page, so titles never
 * differ in size from section to section. Change it here, it changes everywhere.
 */
export const sectionEyebrowSx = {
  fontSize: "0.68rem",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
} as const;
export const sectionTitleSx = {
  fontSize: { xs: "1.15rem", md: "1.4rem" },
  fontWeight: 800,
  letterSpacing: "-0.01em",
  lineHeight: 1.25,
} as const;
export const sectionSubtitleSx = { fontSize: "0.82rem", color: "text.secondary", mt: 0.25 } as const;

/** Page-width wrapper used by every homepage section. */
export function Section({
  children,
  id,
  sx,
}: {
  children: React.ReactNode;
  id?: string;
  sx?: object;
}) {
  return (
    <Box component="section" id={id} sx={{ px: { xs: 2, md: 0 }, py: { xs: 2, md: 3 }, ...sx }}>
      {children}
    </Box>
  );
}

/** Horizontal inset shared by every home panel and heading so titles line up on one left edge. */
/** xs is 0: the page Section already supplies the 16px gutter, and panels are frameless on phones. */
export const PANEL_PX = { xs: 0, md: 5 } as const;

/** One heading size for every home section (Popular services in <city> is the only exception). */
export const headingSx = {
  m: 0,
  fontSize: { xs: "1.375rem", md: "2rem" },
  fontWeight: 800,
  letterSpacing: "-0.035em",
  lineHeight: { xs: 1.25, md: 1.15 },
} as const;

/** Heading + short purple bar. `light` swaps the bar for the lavender used on the violet banner. */
export function SectionTitle({
  children,
  subtitle,
  light,
  sx,
}: {
  children: React.ReactNode;
  subtitle?: string;
  light?: boolean;
  sx?: object;
}) {
  return (
    <Box sx={{ minWidth: 0, ...sx }}>
      <Typography component="h2" sx={headingSx}>
        {children}
      </Typography>
      <Box
        aria-hidden
        sx={{
          width: 44,
          height: 4,
          mt: 1,
          borderRadius: 2,
          background: light ? "#c4b5fd" : `linear-gradient(90deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.ACCENT_BLUE_DARK})`,
        }}
      />
      {subtitle && <Typography sx={{ ...sectionSubtitleSx, mt: 1.25, fontSize: { xs: "0.9rem", md: "0.95rem" } }}>{subtitle}</Typography>}
    </Box>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  /** @deprecated eyebrows were dropped so every heading looks the same */
  eyebrow?: string;
}) {
  return (
    <Box sx={{ display: "flex", flexWrap: { xs: "wrap", sm: "nowrap" }, alignItems: "flex-end", justifyContent: "space-between", gap: { xs: 1, sm: 2 }, mb: { xs: 2.5, md: 3 } }}>
      <SectionTitle subtitle={subtitle} sx={{ flex: { xs: "1 1 100%", sm: "1 1 auto" } }}>
        {title}
      </SectionTitle>
      {action}
    </Box>
  );
}

/** Shared "tap" surface: soft border, lifts on hover, presses on tap. Honors reduced motion. */
export const tappableCard = {
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 4,
  transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
  "&:hover": { borderColor: COLORS.PRIMARY_PURPLE, boxShadow: `0 8px 24px ${COLORS.PURPLE_ALPHA_10}` },
  "&:active": { transform: "scale(0.985)" },
  "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:active": { transform: "none" } },
} as const;

export const scrollRow = {
  display: "flex",
  gap: 1.5,
  overflowX: "auto",
  scrollSnapType: "x proximity",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
  mx: { xs: -2, md: 0 },
  px: { xs: 2, md: 0 },
  pb: 1,
} as const;
