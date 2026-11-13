"use client";
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
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
  const dark = theme.palette.mode === "dark";
  const currencySymbol = currency === "INR" ? "₹" : currency;
  const hasPrice = isPriceRequired && price > 0;

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
        px: 2,
        py: 1.5,
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT,
        boxShadow: COLORS.NEW_UI.BOTTOM_BAR_SHADOW,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>
          {hasPrice ? "Starting from" : "Pricing"}
        </Typography>
        <Typography
          sx={{
            fontSize: hasPrice ? "1.2rem" : "0.95rem",
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          {hasPrice ? `${currencySymbol}${price.toFixed(0)}` : "Contact for price"}
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={onBookNow}
        startIcon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          bgcolor: COLORS.PRIMARY_PURPLE,
          color: COLORS.WHITE,
          fontWeight: 700,
          fontSize: "0.9rem",
          borderRadius: "10px",
          px: 3,
          py: 1.1,
          textTransform: "none",
          boxShadow: "none",
          whiteSpace: "nowrap",
          "&:hover": { bgcolor: COLORS.PURPLE_HOVER, boxShadow: "none" },
          "&:active": { transform: "scale(0.97)" },
        }}
      >
        Enquire now
      </Button>
    </Box>
  );
};

export default ServiceMobileStickyBar;
