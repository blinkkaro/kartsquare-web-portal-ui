"use client";
import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { COLORS } from "@/constants/colors";

/** Shown when a category has no icon, or its icon fails to load. */
export const DEFAULT_CATEGORY_ICON = "/category-icons/default.svg";

/** Serve kartsquare.com assets from this deploy's own public/ folder, so dev and preview deploys work. */
export const sameOrigin = (url?: string | null): string | null =>
  url?.replace(/^https?:\/\/(www\.)?kartsquare\.com(?=\/)/i, "") || null;

/** The category colour at ~15% alpha over whatever is behind it; the purple tint when there is none. */
export const categoryTint = (color?: string | null): string =>
  color && /^#[0-9a-f]{6}$/i.test(color) ? `${color}26` : COLORS.PURPLE_ALPHA_10;

type Size = number | { xs: number; sm?: number; md?: number };
const largest = (s: Size) => (typeof s === "number" ? s : Math.max(...Object.values(s).filter((v): v is number => typeof v === "number")));

interface CategoryIconProps {
  /** The icon URL from the API (`icon` on categories and preferences, `image` on subcategories). */
  icon?: string | null;
  /** The category colour (#rrggbb); tints the tile. */
  color?: string | null;
  /** Rendered size of the icon itself. */
  size: Size;
  /** Size of the tinted tile around it. Leave out for an inline icon with no tile, as in chips. */
  tile?: Size;
  /** Tile corner radius, as each position already writes it. */
  radius?: number | string;
  /** Above the fold: load straight away instead of lazily (normal fetch priority, so photos still go first). */
  priority?: boolean;
  /** Extra styles for the tile, or for the icon when there is no tile. */
  sx?: SxProps<Theme>;
}

/**
 * A category's duotone icon, optionally on a tile tinted with the category colour.
 * The icon is decorative: the category name is always shown or announced beside it.
 */
export default function CategoryIcon({ icon, color, size, tile, radius, priority = false, sx }: CategoryIconProps) {
  const px = largest(size);
  const img = (
    <Box
      component="img"
      src={sameOrigin(icon) ?? DEFAULT_CATEGORY_ICON}
      alt=""
      aria-hidden
      width={px}
      height={px}
      draggable={false}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
        const el = e.currentTarget;
        if (!el.src.endsWith(DEFAULT_CATEGORY_ICON)) el.src = DEFAULT_CATEGORY_ICON;
      }}
      sx={[{ width: size, height: size, display: "block", flexShrink: 0 }, ...(tile ? [] : Array.isArray(sx) ? sx : [sx])]}
    />
  );
  if (!tile) return img;
  return (
    <Box
      sx={[
        { width: tile, height: tile, borderRadius: radius, bgcolor: categoryTint(color), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {img}
    </Box>
  );
}
