"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { COLORS } from "../../../../constants/colors";

interface StatPill {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface ServiceStatPillsProps {
  currency?: string;
  visitingCharge?: number | null;
  serviceRadius?: number;
  serviceDuration?: number | null;
  hasServiceDuration?: boolean;
  serviceAtLocation?: string;
}

const formatDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

const ServiceStatPills = ({
  currency = "INR",
  visitingCharge,
  serviceRadius,
  serviceDuration,
  hasServiceDuration,
  serviceAtLocation,
}: ServiceStatPillsProps) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const currencySymbol = currency === "INR" ? "₹" : currency;

  const locationLabel =
    serviceAtLocation === "at_customer"
      ? "At your place"
      : serviceAtLocation === "virtual_call"
      ? "Online"
      : "At shop";

  const pills: StatPill[] = [
    {
      icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize: 18 }} />,
      label: "Visiting charge",
      value:
        visitingCharge != null && visitingCharge > 0
          ? `${currencySymbol}${visitingCharge}`
          : "Free",
    },
    {
      icon: <GpsFixedRoundedIcon sx={{ fontSize: 18 }} />,
      label: "Service radius",
      value: serviceRadius ? `${serviceRadius} km` : "—",
    },
    {
      icon: <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />,
      label: "Avg. duration",
      value:
        hasServiceDuration && serviceDuration
          ? formatDuration(serviceDuration)
          : "Varies",
    },
    {
      icon: <PlaceRoundedIcon sx={{ fontSize: 18 }} />,
      label: "Service at",
      value: locationLabel,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
        gap: 1.5,
      }}
    >
      {pills.map((pill) => (
        <Box
          key={pill.label}
          sx={{
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT,
            borderRadius: "16px",
            boxShadow: dark ? COLORS.NEW_UI.CARD_SHADOW_DARK : COLORS.NEW_UI.CARD_SHADOW_LIGHT,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10,
              color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE,
            }}
          >
            {pill.icon}
          </Box>
          <Typography sx={{ fontSize: "0.76rem", fontWeight: 500, color: "text.secondary" }}>
            {pill.label}
          </Typography>
          <Typography
            sx={{ fontSize: "1rem", fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}
          >
            {pill.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ServiceStatPills;
