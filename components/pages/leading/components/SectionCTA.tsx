"use client";

import React from "react";
import { Button, useTheme } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import { LEAD_SECTION_ID } from "./sectionIds";

const PURPLE = COLORS.PRIMARY_PURPLE;
const PURPLE_HOVER = COLORS.PURPLE_HOVER;

interface SectionCTAProps {
  /** Optional i18n key for button label. Defaults to getStartedNow */
  labelKey?: "getStartedNow" | "startNow" | "getStartedFree" | "listYourBusiness";
  variant?: "contained" | "outlined";
  size?: "medium" | "large";
  fullWidth?: boolean;
  sx?: object;
}

export default function SectionCTA({
  labelKey = "getStartedNow",
  variant = "contained",
  size = "large",
  fullWidth,
  sx,
}: SectionCTAProps) {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const scrollToLead = () => {
    const el = document.getElementById(LEAD_SECTION_ID);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Button
      onClick={scrollToLead}
      variant={variant}
      endIcon={<ArrowForwardIcon sx={{ fontSize: size === "large" ? 22 : 20 }} />}
      fullWidth={fullWidth}
      sx={{
        textTransform: "none",
        fontWeight: 700,
        fontFamily: "var(--font-heading)",
        fontSize: size === "large" ? "1rem" : "0.9375rem",
        py: size === "large" ? 1.5 : 1.25,
        px: size === "large" ? 3 : 2.5,
        borderRadius: 2,
        ...(variant === "contained"
          ? {
              background: `linear-gradient(135deg, ${PURPLE} 0%, ${PURPLE_HOVER} 100%)`,
              color: "#fff",
              boxShadow: `0 4px 20px ${PURPLE}40`,
              "&:hover": {
                background: `linear-gradient(135deg, ${PURPLE_HOVER} 0%, #3a0e8f 100%)`,
                boxShadow: `0 8px 28px ${PURPLE}50`,
              },
            }
          : {
              borderColor: PURPLE,
              color: PURPLE,
              "&:hover": {
                borderColor: PURPLE_HOVER,
                bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : COLORS.PURPLE_ALPHA_04,
              },
            }),
        ...sx,
      }}
    >
      {t(labelKey)}
    </Button>
  );
}
