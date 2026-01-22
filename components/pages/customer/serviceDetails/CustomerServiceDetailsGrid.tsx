"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface CustomerServiceDetailsGridProps {
    serviceDuration: number;
}

const CustomerServiceDetailsGrid = ({ serviceDuration }: CustomerServiceDetailsGridProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr", // Single column now
                gap: 2,
                mb: 3,
            }}
        >
            {/* Duration Box */}
            <Box
                sx={{
                    bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "white",
                    p: 2,
                    borderRadius: "16px",
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.06)"}`,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        display: "block",
                        mb: 0.5,
                    }}
                >
                    {english.duration}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 700,
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                >
                    {serviceDuration ? `${Math.floor(serviceDuration / 60)}h ${serviceDuration % 60}m` : "2h 30m"}
                </Typography>
            </Box>
        </Box>
    );
};

export default CustomerServiceDetailsGrid;
