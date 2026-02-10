"use client";
import React from "react";
import { Box, Typography, Chip, IconButton, useTheme } from "@mui/material";
import { Bookmark, Share } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";

interface CustomerServiceHeaderProps {
  price: number;
  currency: string;
  categoryName: string;
  onBookmark?: () => void;
  onShare?: () => void;
}

const CustomerServiceHeader = ({
  price,
  currency,
  categoryName,
  onBookmark,
  onShare,
}: CustomerServiceHeaderProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = isDark
    ? COLORS.ACCENT_BLUE_DARK
    : COLORS.TEXT.PRIMARY_LIGHT;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
        <Typography
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            fontWeight: 300,
            fontSize: "1.1rem",
          }}
        >
          {currency}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
          }}
        >
          {price?.toFixed(2) || "0.00"}
        </Typography>
      </Box>
      <Chip
        label={categoryName}
        size="small"
        sx={{
          bgcolor: isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(255, 255, 255, 0.9)",
          color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
          fontWeight: 600,
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
        }}
      />
    </Box>
  );
};

export default CustomerServiceHeader;
