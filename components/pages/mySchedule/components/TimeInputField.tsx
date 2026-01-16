"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";

interface TimeInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const TimeInputField: React.FC<TimeInputFieldProps> = ({
  label,
  value,
  onChange,
  disabled = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Colors for clock icon visibility
  const iconColor = COLORS.PRIMARY_PURPLE;
  const iconFilter = isDark
    ? "invert(45%) sepia(80%) saturate(2000%) hue-rotate(240deg) brightness(100%)"
    : "invert(30%) sepia(80%) saturate(2000%) hue-rotate(240deg) brightness(90%)";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        minWidth: 120,
        maxWidth: 140,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontSize: "0.7rem",
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#F5F5F7",
          borderRadius: "8px",
          px: 1.5,
          py: 1,
          cursor: "text",
          "& input[type='time']::-webkit-calendar-picker-indicator": {
            filter: iconFilter,
            cursor: "pointer",
            opacity: 1,
          },
          "& input[type='time']::-webkit-datetime-edit": {
            color: theme.palette.text.primary,
          },
          "& input[type='time']::-webkit-datetime-edit-fields-wrapper": {
            color: theme.palette.text.primary,
          },
        }}
      >
        <input
          type="time"
          value={value || "09:00"}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: theme.palette.text.primary,
            outline: "none",
            width: "100%",
            fontFamily: "inherit",
            cursor: "text",
          }}
        />
      </Box>
    </Box>
  );
};

export default TimeInputField;
