"use client";
import React from "react";
import { Box, Typography, Button, Divider, useTheme } from "@mui/material";
import { CalendarMonth, WhatsApp, Call, Description, VerifiedUser, Bolt, SupportAgent } from "@mui/icons-material";
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
  const isDark = theme.palette.mode === "dark";
  const currencySymbol = currency === "INR" ? "₹" : currency;

  return (
    <Box
      sx={{
        bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "white",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}`,
        borderRadius: "20px",
        boxShadow: isDark ? "none" : "0 1px 3px rgba(30, 20, 60, 0.05), 0 12px 32px rgba(30, 20, 60, 0.06)",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        overflow: "hidden",
      }}
    >
      {isPriceRequired && price > 0 && (
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mb: 0.5 }}>
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
            }}
          >
            Starting from
          </Typography>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
            }}
          >
            {currencySymbol}
            {price.toFixed(0)}
          </Typography>
        </Box>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={onBookNow}
        startIcon={<CalendarMonth />}
        sx={{
          bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
          color: "white",
          borderRadius: "30px",
          py: 1.4,
          textTransform: "none",
          fontWeight: 700,
          fontSize: "0.95rem",
          "&:hover": {
            bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PURPLE_HOVER,
          },
        }}
      >
        Book a Service
      </Button>

      {showWhatsApp && (
        <Button
          variant="outlined"
          fullWidth
          onClick={onWhatsApp}
          startIcon={<WhatsApp />}
          sx={{
            color: "#25D366",
            borderColor: "#25D366",
            borderRadius: "30px",
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
            "&:hover": {
              borderColor: "#1EBE5D",
              bgcolor: "rgba(37, 211, 102, 0.08)",
            },
          }}
        >
          WhatsApp
        </Button>
      )}

      <Box sx={{ display: "flex", gap: 1.5 }}>
        {showCall && (
          <Button
            variant="outlined"
            fullWidth
            onClick={onCall}
            startIcon={<Call sx={{ fontSize: "1.1rem !important" }} />}
            sx={{
              borderColor: isDark ? "rgba(255,255,255,0.16)" : COLORS.BORDER.DEFAULT_LIGHT,
              color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
              borderRadius: "30px",
              py: 1.1,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Call
          </Button>
        )}
        <Button
          variant="outlined"
          fullWidth
          onClick={onGetQuote}
          startIcon={<Description sx={{ fontSize: "1.1rem !important" }} />}
          sx={{
            borderColor: isDark ? "rgba(255,255,255,0.16)" : COLORS.BORDER.DEFAULT_LIGHT,
            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
            borderRadius: "30px",
            py: 1.1,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Get a Quote
        </Button>
      </Box>

      <Divider sx={{ my: 0.5, borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.1 }}>
        {[
          { icon: <VerifiedUser sx={{ fontSize: 17 }} />, label: "Verified professional" },
          { icon: <Bolt sx={{ fontSize: 17 }} />, label: "Instant booking confirmation" },
          { icon: <SupportAgent sx={{ fontSize: 17 }} />, label: "Dedicated customer support" },
        ].map((item) => (
          <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
                display: "flex",
              }}
            >
              {item.icon}
            </Box>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ServiceBookingSidebar;
