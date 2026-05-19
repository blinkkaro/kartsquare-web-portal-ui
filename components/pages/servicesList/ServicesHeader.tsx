"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { Handyman } from "@mui/icons-material";

interface ServicesHeaderProps {
  title?: string;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ title }) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const textPrimary = isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT;
  const textSecondary = isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT;

  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant="h4"
        sx={{
          color: textPrimary,
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
          fontWeight: 900,
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
          background: isDark ? "none" : `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})`,
          WebkitBackgroundClip: isDark ? "none" : "text",
          WebkitTextFillColor: isDark ? "inherit" : "transparent",
        }}
      >
        {title ?? t("services_for_you")}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: textSecondary,
          mt: 0.5,
          fontSize: { xs: "0.75rem", sm: "0.85rem" },
          fontWeight: 500,
          opacity: 0.8,
          letterSpacing: "0.01em"
        }}
      >
        {t("services_for_you_subtitle")}
      </Typography>
    </Box>
  );
};

export default ServicesHeader;
