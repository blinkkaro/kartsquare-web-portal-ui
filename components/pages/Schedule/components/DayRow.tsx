"use client";
import React from "react";
import { Box, Typography, Switch, styled, Stack } from "@mui/material";
import { COLORS } from "@/constants/colors";

const TimeInput = styled("input")({
  border: "1px solid transparent", // Add transparent border to maintain box model
  outline: "none",
  fontSize: "14px",
  color: COLORS.PRIMARY_PURPLE,
  fontWeight: 500,
  fontFamily: "inherit",
  width: "110px", // Increased width
  padding: "4px", // Added padding
  borderRadius: "4px",
  background: "transparent",
  cursor: "text",
  "&:hover": {
    border: `1px solid ${COLORS.BORDER.DEFAULT}`, // Visual feedback
  },
  "&:focus": {
    border: `1px solid ${COLORS.PRIMARY_PURPLE}`,
  },
  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
  "&::-webkit-calendar-picker-indicator": {
    cursor: "pointer",
  },
});

interface DayRowProps {
  day: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
  onToggle: () => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  disabled?: boolean;
}

import { IOSSwitch } from "./IOSSwitch";

const DayRow: React.FC<DayRowProps> = ({
  day,
  isActive,
  startTime,
  endTime,
  onToggle,
  onStartTimeChange,
  onEndTimeChange,
  disabled,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        py: 2,
        borderBottom: `1px solid ${COLORS.BORDER.DEFAULT}`,
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: COLORS.TEXT_GRAY,
          width: "100px",
        }}
      >
        {day}
      </Typography>

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        {isActive ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <TimeInput
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              disabled={disabled}
            />
            <Typography variant="body2" sx={{ color: COLORS.TEXT_GRAY }}>
              -
            </Typography>
            <TimeInput
              type="time"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              disabled={disabled}
            />
          </Stack>
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: COLORS.TEXT_GRAY,
              fontWeight: 500,
            }}
          >
            Closed
          </Typography>
        )}
      </Box>

      <IOSSwitch
        checked={isActive}
        onChange={onToggle}
        disabled={disabled}
        inputProps={{ "aria-label": "controlled" }}
      />
    </Box>
  );
};

export default DayRow;
