"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";

export interface EmptyStateProps {
  /**
   * Translation key for the title/heading
   */
  titleKey: string;
  /**
   * Translation key for the description/subtitle
   */
  descriptionKey?: string;
  /**
   * Custom title (overrides titleKey if provided)
   */
  title?: string;
  /**
   * Custom description (overrides descriptionKey if provided)
   */
  description?: string;
  /**
   * Icon component to display
   */
  icon?: React.ReactNode;
  /**
   * Custom icon size
   */
  iconSize?: number;
  /**
   * Minimum height of the container
   */
  minHeight?: number | string;
  /**
   * Additional action/button to display
   */
  action?: React.ReactNode;
  /**
   * Custom styles for the container
   */
  sx?: SxProps<Theme>;
  /**
   * Variant: 'empty' or 'notFound'
   */
  variant?: "empty" | "notFound";
}

const EmptyState: React.FC<EmptyStateProps> = ({
  titleKey,
  descriptionKey,
  title,
  description,
  icon,
  iconSize = 64,
  minHeight = 300,
  action,
  sx,
  variant = "empty",
}) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const displayTitle = title || t(titleKey as any);
  const displayDescription = description || (descriptionKey ? t(descriptionKey as any) : undefined);

  // Default icons based on variant
  const defaultIcon = icon || (
    <Box
      sx={{
        width: iconSize,
        height: iconSize,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: isDark
          ? COLORS.BACKGROUND.SECONDARY_DARK
          : COLORS.PURPLE_ALPHA_10,
        mb: 3,
      }}
    >
      <Box
        component="span"
        sx={{
          fontSize: iconSize * 0.5,
          color: COLORS.PRIMARY_PURPLE,
          opacity: 0.6,
        }}
      >
        {variant === "notFound" ? "🔍" : "📭"}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight,
        textAlign: "center",
        px: 3,
        py: 4,
        ...sx,
      }}
    >
      {defaultIcon}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: isDark
            ? COLORS.TEXT.PRIMARY_DARK
            : COLORS.TEXT.PRIMARY_LIGHT,
          mb: description || descriptionKey ? 1 : 0,
        }}
      >
        {displayTitle}
      </Typography>
      {(displayDescription || descriptionKey) && (
        <Typography
          variant="body2"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            maxWidth: "500px",
            mb: action ? 3 : 0,
          }}
        >
          {displayDescription}
        </Typography>
      )}
      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default EmptyState;
