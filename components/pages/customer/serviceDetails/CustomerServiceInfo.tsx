"use client";
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Bolt, Verified } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface CustomerServiceInfoProps {
    serviceName: string;
    serviceDesc: string;
    onContinueReading: () => void;
    showContinueReading: boolean;
}

const CustomerServiceInfo = ({
    serviceName,
    serviceDesc,
    onContinueReading,
    showContinueReading
}: CustomerServiceInfoProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <>
            {/* Service Title */}
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        mb: 1.5,
                        color: COLORS.PRIMARY_PURPLE,
                        fontSize: { xs: "1.75rem", sm: "2.25rem" },
                        lineHeight: 1.2
                    }}
                >
                    {serviceName}
                </Typography>

                {/* Service Quality Badges */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 1 }}>
                    {/* Verified Service Badge */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: "#1D4ED8",
                        fontWeight: 800,
                        cursor: 'default'
                    }}>
                        <Verified sx={{ fontSize: '16px' }} />
                        <Typography sx={{
                            fontWeight: 900,
                            fontSize: "0.75rem",
                            fontStyle: 'italic',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em'
                        }}>
                            Verified Service
                        </Typography>
                    </Box>

                    {/* High Success Rate Badge */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        bgcolor: "#ECFDF5", // Light Green
                        color: "#059669", // Success Green
                        px: 1,
                        py: 0.4,
                        borderRadius: "6px",
                        border: "1px solid #10B98130"
                    }}>
                        <Bolt sx={{ fontSize: '14px' }} />
                        <Typography sx={{
                            fontWeight: 800,
                            fontSize: "0.65rem",
                            letterSpacing: '0.04em'
                        }}>
                            HIGH SUCCESS RATE
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Description */}
            <Typography
                variant="body1"
                sx={{
                    mb: 1,
                    lineHeight: 1.6,
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    display: "-webkit-box",
                    WebkitLineClamp: 10,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {serviceDesc || english.no_description_available}
            </Typography>

            {/* Continue Reading Link */}
            {showContinueReading && (
                <Button
                    onClick={onContinueReading}
                    sx={{
                        textTransform: "none",
                        color: COLORS.PRIMARY_PURPLE,
                        p: 0,
                        mb: 3,
                        "&:hover": {
                            bgcolor: "transparent",
                            textDecoration: "underline",
                        },
                    }}
                >
                    {english.continue_reading}
                </Button>
            )}
        </>
    );
};

export default CustomerServiceInfo;
