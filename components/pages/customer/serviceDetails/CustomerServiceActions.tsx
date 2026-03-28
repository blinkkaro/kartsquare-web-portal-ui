"use client";
import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { ShoppingCart, CalendarMonth, WhatsApp } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface CustomerServiceActionsProps {
  onAddToCart?: () => void;
  onBookNow: () => void;
  onWhatsApp?: () => void;
  showWhatsApp?: boolean;
}

const CustomerServiceActions = ({
  onAddToCart,
  onBookNow,
  onWhatsApp,
  showWhatsApp,
}: CustomerServiceActionsProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 1, py: 1 }}>
      {showWhatsApp && (
        <Button
          variant="outlined"
          fullWidth
          onClick={onWhatsApp}
          startIcon={<WhatsApp sx={{ fontSize: "1.2rem !important" }} />}
          sx={{
            flex: 1,
            color: "#25D366",
            borderColor: "#25D366",
            borderRadius: "30px",
            px: 3,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
            letterSpacing: "0.02em",
            "&:hover": {
              borderColor: "#1EBE5D",
              bgcolor: "rgba(37, 211, 102, 0.08)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          WhatsApp
        </Button>
      )}
      <Button
        variant="contained"
        fullWidth
        onClick={onBookNow}
        startIcon={<CalendarMonth sx={{ fontSize: "1.2rem !important" }} />}
        sx={{
          flex: 1,
          bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
          color: "white",
          borderRadius: "30px",
          px: 3,
          py: 1.2,
          textTransform: "none",
          fontWeight: 700,
          letterSpacing: "0.02em",
          "&:hover": {
            bgcolor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
            transform: "translateY(-1px)",
            boxShadow: `0 4px 12px ${
              isDark
                ? `${COLORS.ACCENT_BLUE_BG_DARK}40`
                : `${COLORS.PRIMARY_PURPLE}40`
            }`,
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        {english.book_now || "Book Now"}
      </Button>
    </Box>
  );
};

export default CustomerServiceActions;
