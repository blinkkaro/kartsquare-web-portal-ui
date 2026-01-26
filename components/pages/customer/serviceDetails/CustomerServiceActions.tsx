"use client";
import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { ShoppingCart, CalendarMonth } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface CustomerServiceActionsProps {
    onAddToCart: () => void;
    onBookNow: () => void;
}

const CustomerServiceActions = ({ onAddToCart, onBookNow }: CustomerServiceActionsProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ display: "flex", gap: 2, mb: 1, py: 1 }}>
            {/* <Button
                variant="contained"
                onClick={onAddToCart}
                startIcon={<ShoppingCart sx={{ fontSize: '1.2rem !important' }} />}
                sx={{
                    flex: 1,
                    bgcolor: isDark ? "rgba(255, 255, 255, 0.1)" : "#1A1A1A",
                    color: "white",
                    borderRadius: "30px",
                    px: 3,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    "&:hover": {
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.15)" : "#000000",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    },
                    transition: "all 0.2s ease-in-out"
                }}
            >
                {english.add_to_cart || "Add to Cart"}
            </Button> */}
            <Button
                variant="contained"
                fullWidth
                onClick={onBookNow}
                startIcon={<CalendarMonth sx={{ fontSize: '1.2rem !important' }} />}
                sx={{
                    flex: 1,
                    bgcolor: COLORS.PRIMARY_PURPLE,
                    color: "white",
                    borderRadius: "30px",
                    px: 3,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    "&:hover": {
                        bgcolor: COLORS.PURPLE_HOVER,
                        transform: "translateY(-1px)",
                        boxShadow: `0 4px 12px ${COLORS.PRIMARY_PURPLE}40`
                    },
                    transition: "all 0.2s ease-in-out"
                }}
            >
                {english.book_now || "Book Now"}
            </Button>
        </Box>
    );
};

export default CustomerServiceActions;
