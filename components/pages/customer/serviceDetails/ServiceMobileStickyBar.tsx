"use client";
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";

interface ServiceMobileStickyBarProps {
  isPriceRequired: boolean;
  price: number;
  currency: string;
  onBookNow: () => void;
}

const ServiceMobileStickyBar = ({
  isPriceRequired,
  price,
  currency,
  onBookNow,
}: ServiceMobileStickyBarProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const currencySymbol = currency === "INR" ? "₹" : currency;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: { xs: "flex", md: "none" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        px: 2.5,
        py: 1.75,
        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
        borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
      }}
    >
      {isPriceRequired && price > 0 ? (
        <Box>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
            }}
          >
            Starting from
          </Typography>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
              lineHeight: 1.1,
            }}
          >
            {currencySymbol}
            {price.toFixed(0)}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ flex: 1 }} />
      )}
      <Button
        variant="contained"
        onClick={onBookNow}
        startIcon={<CalendarMonth />}
        sx={{
          bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
          color: "white",
          borderRadius: "30px",
          px: 3.5,
          py: 1.2,
          textTransform: "none",
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        Book Now
      </Button>
    </Box>
  );
};

export default ServiceMobileStickyBar;
