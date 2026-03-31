"use client";
import React from "react";
import { Box, Typography, Chip, IconButton, useTheme } from "@mui/material";
import { Bookmark, Share } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface CustomerServiceHeaderProps {
  price: number;
  currency: string;
  categoryName: string[];
  onBookmark?: () => void;
  onShare?: () => void;
  isPriceRequired: boolean;
}

const CustomerServiceHeader = ({
  price,
  isPriceRequired,
  currency,
  categoryName,
  onBookmark,
  onShare,
}: CustomerServiceHeaderProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();
  const accentColor = isDark
    ? COLORS.ACCENT_BLUE_DARK
    : COLORS.TEXT.PRIMARY_LIGHT;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, flexWrap: "wrap" }}>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
        {isPriceRequired ? (
          price > 0 ? (
            <>
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
                {price.toFixed(2)}
              </Typography>
            </>
          ) : null
        ) : (
          <Typography
            sx={{
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
              fontWeight: 800,
              fontSize: "1.1rem",
            }}
          >
            {t("getQuote")}
          </Typography>
        )}
      </Box>
      <Chip
        label={
          categoryName
            ? `${categoryName.join(", ")}`
            : categoryName
        }
        size="small"
        sx={{
          bgcolor: isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(255, 255, 255, 0.9)",
          color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
          fontWeight: 600,
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
          maxWidth: "100%",
          height: "auto",
          minHeight: "24px",
          py: 0.5,
          "& .MuiChip-label": {
            whiteSpace: "normal",
            display: "block",
            lineHeight: 1.4,
          }
        }}
      />
    </Box>
  );
};

export default CustomerServiceHeader;
