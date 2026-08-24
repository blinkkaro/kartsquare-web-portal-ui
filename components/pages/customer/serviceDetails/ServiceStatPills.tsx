"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import {
  AccountBalanceWallet,
  GpsFixed,
  AccessTime,
  Room,
} from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";

interface StatPill {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
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
  const isDark = theme.palette.mode === "dark";
  const currencySymbol = currency === "INR" ? "₹" : currency;

  const locationLabel =
    serviceAtLocation === "at_customer" ? "At Customer" : "At Shop";

  const pills: StatPill[] = [
    {
      icon: <AccountBalanceWallet sx={{ fontSize: 18 }} />,
      label: "Visiting Charge",
      value:
        visitingCharge != null && visitingCharge > 0
          ? `${currencySymbol}${visitingCharge}`
          : "Free",
      accent: COLORS.PRIMARY_PURPLE,
    },
    {
      icon: <GpsFixed sx={{ fontSize: 18 }} />,
      label: "Service Radius",
      value: serviceRadius ? `${serviceRadius} km` : "—",
      accent: "#b8860b",
    },
    {
      icon: <AccessTime sx={{ fontSize: 18 }} />,
      label: "Avg. Duration",
      value:
        hasServiceDuration && serviceDuration
          ? formatDuration(serviceDuration)
          : "Varies",
      accent: COLORS.SUCCESS_GREEN,
    },
    {
      icon: <Room sx={{ fontSize: 18 }} />,
      label: "Location",
      value: locationLabel,
      accent: COLORS.PRIMARY_BLUE,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(4, 1fr)",
        },
        gap: 1.5,
      }}
    >
      {pills.map((pill) => (
        <Box
          key={pill.label}
          sx={{
            bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "white",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}`,
            borderRadius: "16px",
            boxShadow: isDark ? "none" : "0 1px 3px rgba(30, 20, 60, 0.05), 0 8px 24px rgba(30, 20, 60, 0.04)",
            p: 1.75,
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
              bgcolor: `${pill.accent}1a`,
              color: pill.accent,
            }}
          >
            {pill.icon}
          </Box>
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 600,
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
            }}
          >
            {pill.label}
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 800,
              color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
              lineHeight: 1.1,
            }}
          >
            {pill.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ServiceStatPills;
