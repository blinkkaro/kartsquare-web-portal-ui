"use client";
import React from "react";
import { Box, Typography, Switch, styled, Stack } from "@mui/material";
import { COLORS } from "@/constants/colors";

const TimeInput = styled("input")(({ theme }) => ({
  border: "1px solid transparent",
  outline: "none",
  fontSize: "13px",
  color: COLORS.PRIMARY_PURPLE,
  fontWeight: 500,
  fontFamily: "inherit",
  width: "90px",
  padding: "4px",
  borderRadius: "4px",
  background: "transparent",
  cursor: "text",
  textAlign: "center",
  "&:hover": {
    border: `1px solid ${theme.palette.divider}`,
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
    filter: "invert(0.5)",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
    width: "75px",
    padding: "2px",
  },
}));

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
        py: { xs: 1.5, md: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
        gap: { xs: 1, md: 2 },
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: "text.secondary",
          width: { xs: "70px", md: "100px" },
          fontSize: { xs: "13px", md: "16px" },
          flexShrink: 0,
        }}
      >
        {day}
      </Typography>

      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        {isActive ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.5, md: 1 }}
          >
            <TimeInput
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              disabled={disabled}
            />
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                px: { xs: 0.5, md: 1 },
                fontSize: { xs: "12px", md: "14px" },
              }}
            >
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
              color: "text.secondary",
              fontWeight: 500,
              fontSize: { xs: "13px", md: "16px" },
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
