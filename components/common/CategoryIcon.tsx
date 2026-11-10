"use client";
import React from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { Icon } from "@iconify/react";
import { COLORS } from "@/constants/colors";

/** Shown when a category has no icon name, or an old value that is not one (e.g. a file URL). */
export const DEFAULT_CATEGORY_ICON = "ph:squares-four-duotone";

/** An Iconify icon name, "prefix:name", e.g. "ph:tractor-duotone". */
const ICON_NAME = /^[a-z0-9]+(-[a-z0-9]+)*:[a-z0-9]+(-[a-z0-9]+)*$/;
const iconName = (icon?: string | null): string => (icon && ICON_NAME.test(icon) ? icon : DEFAULT_CATEGORY_ICON);

const HEX = /^#[0-9a-f]{6}$/i;

/** Serve kartsquare.com assets (category photos) from this deploy's own public/ folder, so dev and previews work. */
export const sameOrigin = (url?: string | null): string | null =>
  url?.replace(/^https?:\/\/(www\.)?kartsquare\.com(?=\/)/i, "") || null;

/** The category colour at ~15% alpha over whatever is behind it; the purple tint when there is none. */
export const categoryTint = (color?: string | null): string =>
  color && HEX.test(color) ? `${color}26` : COLORS.PURPLE_ALPHA_10;

type Size = number | { xs: number; sm?: number; md?: number };

interface CategoryIconProps {
  /** Iconify icon name from the API (`icon` on categories and subcategories, `icon_name` on preferences). */
  icon?: string | null;
  /** The category colour (#rrggbb): colours the icon and tints the tile. */
  color?: string | null;
  /** Rendered size of the icon itself. */
  size: Size;
  /** Size of the tinted tile around it. Leave out for an inline icon with no tile, as in chips. */
  tile?: Size;
  /** Tile corner radius, as each position already writes it. */
  radius?: number | string;
  /** Extra styles for the tile, or for the icon when there is no tile. */
  sx?: SxProps<Theme>;
}

/**
 * A category's duotone icon from the Iconify library (fetched on demand and cached by the browser),
 * optionally on a tile tinted with the category colour. The icon is decorative: the category name
 * is always shown or announced beside it.
 */
export default function CategoryIcon({ icon, color, size, tile, radius, sx }: CategoryIconProps) {
  const extra = Array.isArray(sx) ? sx : [sx];
  const glyph = (
    <Box
      component="span"
      aria-hidden
      sx={[
        { width: size, height: size, display: "inline-flex", flexShrink: 0, color: color && HEX.test(color) ? color : COLORS.PRIMARY_PURPLE },
        ...(tile ? [] : extra),
      ]}
    >
      <Icon icon={iconName(icon)} width="100%" height="100%" ssr />
    </Box>
  );
  if (!tile) return glyph;
  return (
    <Box
      sx={[
        { width: tile, height: tile, borderRadius: radius, bgcolor: categoryTint(color), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
        ...extra,
      ]}
    >
      {glyph}
    </Box>
  );
}
