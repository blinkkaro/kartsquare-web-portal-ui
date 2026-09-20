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

export function SectionHeader({
  title,
  subtitle,
  action,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 2 }}>
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && (
          <Typography sx={{ ...sectionEyebrowSx, color: COLORS.PRIMARY_PURPLE }}>{eyebrow}</Typography>
        )}
        <Typography component="h2" sx={sectionTitleSx}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={sectionSubtitleSx}>{subtitle}</Typography>
        )}
      </Box>
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
