"use client";
import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
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
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
                variant="contained"
                onClick={onAddToCart}
                sx={{
                    bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "#2D2D2D",
                    color: "white",
                    borderRadius: "24px",
                    px: 4,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                        bgcolor: isDark ? "rgba(255, 255, 255, 0.12)" : "#3D3D3D",
                    },
                }}
            >
                {english.add_to_cart}
            </Button>
            <Button
                variant="contained"
                onClick={onBookNow}
                sx={{
                    bgcolor: "#4F46E5", // Vibrant purple-blue from screenshot
                    color: "white",
                    borderRadius: "24px",
                    px: 4,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                        bgcolor: "#4338CA",
                    },
                }}
            >
                {english.book_now}
            </Button>
        </Box>
    );
};

export default CustomerServiceActions;
