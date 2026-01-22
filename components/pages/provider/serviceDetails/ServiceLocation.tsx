"use client";
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface ServiceLocationProps {
    address: string;
}

const ServiceLocation = ({ address }: ServiceLocationProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="subtitle2"
                sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                }}
            >
                {english.my_address || "My Address"}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontWeight: 700,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    mb: 2,
                }}
            >
                {address || "123 Main Street, Al Satwa Dubai, United Arab Emirates"}
            </Typography>

            <Box
                sx={{
                    display: "inline-block",
                    px: 2,
                    py: 0.8,
                    borderRadius: "20px",
                    border: `1px solid ${COLORS.PRIMARY_PURPLE}`,
                    bgcolor: isDark ? "rgba(94, 24, 233, 0.08)" : "rgba(94, 24, 233, 0.04)",
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: COLORS.PRIMARY_PURPLE,
                        fontWeight: 600,
                    }}
                >
                    {english.provider_service_at_customer_location || "I provide this service at customer location"}
                </Typography>
            </Box>
        </Box>
    );
};

export default ServiceLocation;
