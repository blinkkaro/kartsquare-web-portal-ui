"use client";
import React from "react";
import { Box, Typography, useTheme, Switch, useMediaQuery } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface ServiceDetailsGridProps {
    serviceDuration: number;
    bookings?: number;
    homeFee?: number;
    serviceStatus?: boolean;
}

const ServiceDetailsGrid = ({
    serviceDuration,
    bookings = 80,
    homeFee = 10.00,
    serviceStatus = true
}: ServiceDetailsGridProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box
            sx={{
                bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.9)",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                borderRadius: { xs: "8px", sm: "12px" },
                p: { xs: 1.5, sm: 2 },
                mb: { xs: 2, sm: 3 },
            }}
        >
            {/* Combined Row: Duration and Service Status */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 2, sm: 0 },
                }}
            >
                {/* Duration */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                            whiteSpace: "nowrap",
                            fontSize: { xs: "0.7rem", sm: "0.75rem" },
                        }}
                    >
                        {english.duration}:
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 600,
                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                            whiteSpace: "nowrap",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                        }}
                    >
                        {serviceDuration ? `${Math.floor(serviceDuration / 60)}h ${serviceDuration % 60}${english.min}` : "2h 30min"}
                    </Typography>
                </Box>

                {/* Service status */}
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                            fontWeight: 500,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                    >
                        {english.service_status}
                    </Typography>
                    <Switch
                        checked={serviceStatus}
                        size={isMobile ? "small" : "medium"}
                        sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                                color: COLORS.PRIMARY_PURPLE,
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: COLORS.PRIMARY_PURPLE,
                            },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default ServiceDetailsGrid;
