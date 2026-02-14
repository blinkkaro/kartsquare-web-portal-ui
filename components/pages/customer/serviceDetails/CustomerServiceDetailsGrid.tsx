"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface CustomerServiceDetailsGridProps {
  serviceDuration: number;
  haveSlots?: boolean;
}

const CustomerServiceDetailsGrid = ({
  serviceDuration,
  haveSlots,
}: CustomerServiceDetailsGridProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const formatDuration = (totalMinutes: number) => {
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.length > 0 ? parts.join(" ") : "0m";
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        mb: 3,
      }}
    >
      {/* Duration Box */}
      <Box
        sx={{
          bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "white",
          p: 2,
          borderRadius: "16px",
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.06)"}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            display: "block",
            mb: 0.5,
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          {english.duration.toUpperCase()}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {formatDuration(serviceDuration)}
        </Typography>
      </Box>

      {/* Slots Box - Only if haveSlots is true or explicitly show it's disabled */}
      <Box
        sx={{
          bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "white",
          p: 2,
          borderRadius: "16px",
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.06)"}`,
          opacity: haveSlots ? 1 : 0.6,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            display: "block",
            mb: 0.5,
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          {english.time_slots_enabled.toUpperCase()}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            /* color: haveSlots ? COLORS.PRIMARY_PURPLE : "text.secondary", */
            color: haveSlots
              ? isDark
                ? COLORS.ACCENT_BLUE_DARK
                : COLORS.PRIMARY_PURPLE
              : "text.secondary",
          }}
        >
          {haveSlots
            ? english.time_slots_available
            : english.instant_booking}
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomerServiceDetailsGrid;
