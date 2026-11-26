import { COLORS } from "@/constants/colors";
import { sectionEyebrowSx, sectionTitleSx } from "./shared";

/** Shared type and rhythm for the home page's three editorial sections (About, local guide, popular needs). */
export const editorialEyebrow = {
  ...sectionEyebrowSx,
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  color: COLORS.PRIMARY_PURPLE,
  "&::before": { content: '""', width: 28, height: "1px", bgcolor: "currentColor" },
} as const;

/** Same size as every other home section heading (sectionTitleSx), so titles never differ between sections. */
export const editorialTitle = { ...sectionTitleSx, color: COLORS.NEW_UI.INK, textWrap: "balance" } as const;

export const editorialBody = { fontSize: { xs: "1rem", md: "1.0625rem" }, lineHeight: 1.8, color: COLORS.TEXT.SECONDARY_LIGHT } as const;

export const HAIRLINE = `1px solid ${COLORS.NEW_UI.DIVIDER_LIGHT}`;

export const editorialSection = { py: { xs: 6, md: 10 } } as const;

export const editorialFocus = { "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 3 } } as const;
