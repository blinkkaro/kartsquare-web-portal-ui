"use client";
import React from "react";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";

interface ServiceDetailsHeaderProps {
    price: number;
    currency: string;
    categoryName: string;
}

const ServiceDetailsHeader = ({
    price,
    currency,
    categoryName,
}: ServiceDetailsHeaderProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                <Typography
                    sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        fontWeight: 300,
                        fontSize: "0.875rem",
                    }}
                >
                    {currency}
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                >
                    {price?.toFixed(2) || "0.00"}
                </Typography>
            </Box>
            <Chip
                label={categoryName}
                size="small"
                sx={{
                    bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.9)",
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    fontWeight: 600,
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                }}
            />
        </Box>
    );
};

export default ServiceDetailsHeader;
