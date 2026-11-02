"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface CustomerServiceDetailsGridProps {
  serviceDuration: number;
  haveSlots?: boolean;
}

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

const CustomerServiceDetailsGrid = ({
  serviceDuration,
  haveSlots,
}: CustomerServiceDetailsGridProps) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const cardSx = {
    bgcolor: "background.paper",
    p: 2,
    borderRadius: "16px",
    border: "1px solid",
    borderColor: dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT,
    boxShadow: dark ? COLORS.NEW_UI.CARD_SHADOW_DARK : COLORS.NEW_UI.CARD_SHADOW_LIGHT,
  };

  const labelSx = {
    fontSize: "0.72rem",
    fontWeight: 800,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    color: "text.secondary",
    mb: 0.5,
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
      <Box sx={cardSx}>
        <Typography sx={labelSx}>{english.duration}</Typography>
        <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: "text.primary" }}>
          {formatDuration(serviceDuration)}
        </Typography>
      </Box>

      <Box sx={cardSx}>
        <Typography sx={labelSx}>{english.time_slots_enabled}</Typography>
        <Typography
          sx={{
            fontSize: "0.95rem",
            fontWeight: 800,
            color: haveSlots
              ? dark
                ? COLORS.NEW_UI.ACCENT_TEXT_DARK
                : COLORS.PRIMARY_PURPLE
              : "text.primary",
          }}
        >
          {haveSlots ? english.time_slots_available : english.instant_booking}
        </Typography>
      </Box>
    </Box>
  );
};

export default CustomerServiceDetailsGrid;
