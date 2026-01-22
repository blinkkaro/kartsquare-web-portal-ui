"use client";
import React from "react";
import { Box, Typography, Button, Chip, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface ServiceDetailsInfoProps {
    serviceName: string;
    serviceDesc: string;
    status: string;
    onContinueReading: () => void;
    showContinueReading: boolean;
}

const ServiceDetailsInfo = ({
    serviceName,
    serviceDesc,
    status,
    onContinueReading,
    showContinueReading
}: ServiceDetailsInfoProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <>
            {/* Service Title */}
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                }}
            >
                {serviceName}
            </Typography>

            {/* Description */}
            <Typography
                variant="body1"
                sx={{
                    mb: 1,
                    lineHeight: 1.6,
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {serviceDesc || "No description available"}
            </Typography>

            {/* Continue Reading Link */}
            {showContinueReading && (
                <Button
                    onClick={onContinueReading}
                    sx={{
                        textTransform: "none",
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        p: 0,
                        mb: 3,
                        fontWeight: 700,
                        textDecoration: "underline",
                        "&:hover": {
                            bgcolor: "transparent",
                            textDecoration: "underline",
                        },
                    }}
                >
                    {english.continueReading || "Continue Reading"}
                </Button>
            )}

        </>
    );
};

export default ServiceDetailsInfo;
