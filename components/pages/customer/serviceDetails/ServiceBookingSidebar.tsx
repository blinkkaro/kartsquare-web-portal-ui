"use client";
import React from "react";
import { Box, Typography, Button, Divider, useTheme } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { COLORS } from "../../../../constants/colors";

interface ServiceBookingSidebarProps {
  isPriceRequired: boolean;
  price: number;
  currency: string;
  onBookNow: () => void;
  onWhatsApp: () => void;
  showWhatsApp: boolean;
  onCall?: () => void;
  showCall: boolean;
  onGetQuote: () => void;
}

const ServiceBookingSidebar = ({
  isPriceRequired,
  price,
  currency,
  onBookNow,
  onWhatsApp,
  showWhatsApp,
  onCall,
  showCall,
  onGetQuote,
}: ServiceBookingSidebarProps) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const currencySymbol = currency === "INR" ? "₹" : currency;
  const hasPrice = isPriceRequired && price > 0;

  const outlinedSx = {
    borderColor: dark ? COLORS.NEW_UI.OUTLINE_DARK : COLORS.NEW_UI.OUTLINE_LIGHT,
    color: "text.primary",
    fontWeight: 700,
    fontSize: "0.85rem",
    borderRadius: "10px",
    py: 1,
    textTransform: "none" as const,
    "&:hover": {
      borderColor: COLORS.PRIMARY_PURPLE,
      color: COLORS.PRIMARY_PURPLE,
      bgcolor: "transparent",
    },
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT,
        borderRadius: "16px",
        boxShadow: dark ? COLORS.NEW_UI.CARD_SHADOW_DARK : COLORS.NEW_UI.CARD_SHADOW_HOVER_LIGHT,
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
      }}
    >
      <Box sx={{ mb: 0.5 }}>
        <Typography sx={{ fontSize: "0.76rem", color: "text.secondary", fontWeight: 500 }}>
          {hasPrice ? "Starting from" : "Pricing"}
        </Typography>
        <Typography
          sx={{
            fontSize: hasPrice ? "1.6rem" : "1.1rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "text.primary",
          }}
        >
          {hasPrice ? `${currencySymbol}${price.toFixed(0)}` : "Contact for price"}
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={onBookNow}
        startIcon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />}
        sx={{
          bgcolor: COLORS.PRIMARY_PURPLE,
          color: COLORS.WHITE,
          fontWeight: 700,
          fontSize: "0.9rem",
          borderRadius: "10px",
          py: 1.25,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            bgcolor: COLORS.PURPLE_HOVER,
            boxShadow: COLORS.NEW_UI.BUTTON_SHADOW_HOVER,
          },
          "&:active": { transform: "scale(0.98)" },
        }}
      >
        Request Service
      </Button>

      {(showWhatsApp || showCall) && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: showWhatsApp && showCall ? "1fr 1fr" : "1fr",
            gap: 1.25,
          }}
        >
          {showWhatsApp && (
            <Button
              variant="contained"
              onClick={onWhatsApp}
              startIcon={<WhatsAppIcon sx={{ fontSize: 18 }} />}
              sx={{
                bgcolor: COLORS.NEW_UI.WHATSAPP,
                color: COLORS.WHITE,
                fontWeight: 700,
                fontSize: "0.85rem",
                borderRadius: "10px",
                py: 1,
                boxShadow: "none",
                textTransform: "none",
                "&:hover": { bgcolor: COLORS.NEW_UI.WHATSAPP_HOVER, boxShadow: "none" },
              }}
            >
              WhatsApp
            </Button>
          )}
          {showCall && (
            <Button
              variant="outlined"
              onClick={onCall}
              startIcon={<CallRoundedIcon sx={{ fontSize: 18 }} />}
              sx={outlinedSx}
            >
              Call
            </Button>
          )}
        </Box>
      )}

      <Button
        variant="outlined"
        fullWidth
        onClick={onGetQuote}
        startIcon={<DescriptionRoundedIcon sx={{ fontSize: 18 }} />}
        sx={outlinedSx}
      >
        Get a quote
      </Button>

      <Divider
        sx={{
          my: 0.75,
          borderColor: dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT,
        }}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {[
          {
            icon: <StorefrontRoundedIcon sx={{ fontSize: 17 }} />,
            label: "Listed on Kartsquare",
          },
          { icon: <BoltRoundedIcon sx={{ fontSize: 17 }} />, label: "Contact the provider directly" },
          { icon: <SupportAgentRoundedIcon sx={{ fontSize: 17 }} />, label: "Dedicated customer support" },
        ].map((item) => (
          <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE,
                display: "flex",
              }}
            >
              {item.icon}
            </Box>
            <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ServiceBookingSidebar;
