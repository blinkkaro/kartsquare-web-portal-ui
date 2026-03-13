"use client";
import React from "react";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface ServiceDetailsHeaderProps {
  price: number;
  currency: string;
  categoryName: string;
  subCategoryName?: string;
  isPriceRequired: boolean;
}

const ServiceDetailsHeader = ({
  price,
  currency,
  categoryName,
  subCategoryName,
  isPriceRequired,
}: ServiceDetailsHeaderProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();

  return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
          {isPriceRequired ? (
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
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {price?.toFixed(2) || "0.00"}
              </Typography>
            </>
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
            subCategoryName
              ? `${categoryName} • ${subCategoryName}`
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

export default ServiceDetailsHeader;
