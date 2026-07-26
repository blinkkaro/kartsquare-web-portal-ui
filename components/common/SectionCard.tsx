"use client";
import React from "react";
import { Box, BoxProps, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";

interface SectionCardProps extends BoxProps {
  /** Radius tier relative to theme.shape.borderRadius (12px base): sm=0.67x, md=1x, lg=1.5x. */
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const RADIUS_MULTIPLIER: Record<NonNullable<SectionCardProps["size"]>, number> = {
  sm: 0.67,
  md: 1,
  lg: 1.5,
};

/**
 * Standard card/section wrapper: theme-driven radius tier + theme-aware shadow + padding.
 * Replaces the ad-hoc `Box` card styling repeated across page sections.
 */
const SectionCard: React.FC<SectionCardProps> = ({ size = "md", sx, children, ...rest }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const borderRadius = Number(theme.shape.borderRadius) * RADIUS_MULTIPLIER[size];

  return (
    <Box
      sx={{
        borderRadius: `${borderRadius}px`,
        bgcolor: isDark ? COLORS.BACKGROUND.ELEVATED_DARK : COLORS.WHITE,
        boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.5)" : "0 4px 16px rgba(17,24,39,0.08)",
        p: 2,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default SectionCard;
