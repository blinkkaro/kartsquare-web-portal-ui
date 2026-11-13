"use client";

import React from "react";
import { Box, Typography, Link, Divider, useTheme } from "@mui/material";
import TimeInputField from "./TimeInputField";
import BreakTimeRow from "./BreakTimeRow";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { TranslationKey } from "@/features/i18n/TranslationContext";
import { COLORS } from "@/constants/colors";

interface DayScheduleCardProps {
  dayKey: TranslationKey;
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  hasBreak: boolean;
  breakStart?: string;
  breakEnd?: string;
  onBreakStartChange?: (value: string) => void;
  onBreakEndChange?: (value: string) => void;
  onBreakToggle: () => void;
}

const DayScheduleCard: React.FC<DayScheduleCardProps> = ({
  dayKey,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  hasBreak,
  breakStart = "",
  breakEnd = "",
  onBreakStartChange,
  onBreakEndChange,
  onBreakToggle,
}) => {
  const { t } = useTranslationContext();
  const theme = useTheme();

  const handleBreakClick = () => {
    console.log("break press");
    onBreakToggle();
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Day Header with Divider */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Divider sx={{ flexGrow: 1 }} />
        <Typography
          variant="caption"
          sx={{
            px: 2,
            color: "text.secondary",
            fontWeight: 500,
            fontSize: "0.7rem",
            letterSpacing: "0.5px",
          }}
        >
          {t(dayKey)}
        </Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

      {/* Schedule Card */}
      <Box
        sx={{
          bgcolor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PRIMARY_LIGHT,
          borderRadius: "12px",
          p: 2,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Time Inputs Row */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <TimeInputField
            label={t("starting")}
            value={startTime}
            onChange={onStartTimeChange}
          />
          <TimeInputField
            label={t("ending")}
            value={endTime}
            onChange={onEndTimeChange}
          />

          {/* Break Time Inputs */}
          {hasBreak && onBreakStartChange && onBreakEndChange && (
            <BreakTimeRow
              breakStart={breakStart}
              breakEnd={breakEnd}
              onBreakStartChange={onBreakStartChange}
              onBreakEndChange={onBreakEndChange}
            />
          )}
        </Box>

        {/* Add/Remove Break Link */}
        <Link
          component="button"
          onClick={handleBreakClick}
          sx={{
            mt: 1.5,
            fontSize: "0.75rem",
            fontWeight: 500,
            color: hasBreak ? "error.main" : COLORS.PRIMARY_PURPLE,
            textDecoration: "underline",
            cursor: "pointer",
            display: "block",
            border: "none",
            background: "transparent",
            padding: 0,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          {hasBreak ? t("removeBreak") : t("addBreak")}
        </Link>
      </Box>
    </Box>
  );
};

export default DayScheduleCard;
