"use client";
import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { Assignment, WhatsApp } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";

interface ProductDetailsActionsProps {
  onGetQuote: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onWhatsApp: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isAnimatingInquiry?: boolean;
  isAnimatingWhatsApp?: boolean;
}

const ProductDetailsActions = ({
  onGetQuote,
  onWhatsApp,
  isAnimatingInquiry = false,
  isAnimatingWhatsApp = false,
}: ProductDetailsActionsProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 1, py: 1 }}>
      <Button
        variant="contained"
        fullWidth
        onClick={onGetQuote}
        disabled={isAnimatingInquiry}
        startIcon={<Assignment sx={{ fontSize: "1.2rem !important" }} />}
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
        Get Best Quote
      </Button>
      <Button
        variant="outlined"
        fullWidth
        onClick={onWhatsApp}
        disabled={isAnimatingWhatsApp}
        startIcon={<WhatsApp sx={{ fontSize: "1.2rem !important" }} />}
        sx={{
          flex: 1,
          borderColor: "#25D366",
          color: "#25D366",
          borderRadius: "30px",
          px: 3,
          py: 1.2,
          textTransform: "none",
          fontWeight: 700,
          letterSpacing: "0.02em",
          "&:hover": {
            borderColor: "#1ebe57",
            bgcolor: "rgba(37, 211, 102, 0.05)",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        WhatsApp
      </Button>
    </Box>
  );
};

export default ProductDetailsActions;
