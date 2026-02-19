"use client";
import React from "react";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";

interface ProductDetailsHeaderProps {
    price: string;
    category: string;
    gst?: string;
}

const ProductDetailsHeader = ({
    price,
    category,
    gst = "18%",
}: ProductDetailsHeaderProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
                }}
            >
                {price}
            </Typography>
            <Chip
                label={category}
                size="small"
                sx={{
                    bgcolor: isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(255, 255, 255, 0.9)",
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    fontWeight: 600,
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                }}
            />
        </Box>
    );
};

export default ProductDetailsHeader;
