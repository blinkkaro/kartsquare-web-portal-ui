"use client";
import React from "react";
import { Box, Typography, Button, Chip, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface ServiceDetailsInfoProps {
    serviceName: string;
    serviceDesc: string;
    status: string;
    createdAt?: string;
    onContinueReading: () => void;
    showContinueReading: boolean;
}

const ServiceDetailsInfo = ({
    serviceName,
    serviceDesc,
    status,
    createdAt,
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
                    mb: 0.5,
                    color: COLORS.PRIMARY_PURPLE,
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                    lineHeight: { xs: 1.3, sm: 1.4 },
                }}
            >
                {serviceName}
            </Typography>

            {createdAt && (
                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        mb: { xs: 1.5, sm: 2 },
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        fontSize: "0.75rem",
                        fontWeight: 500
                    }}
                >
                    {english.created_at || "Created At"}: {new Date(createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Typography>
            )}

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
                    fontSize: { xs: "0.875rem", sm: "1rem" },
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
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        p: 0,
                        mb: { xs: 2, sm: 3 },
                        fontWeight: 700,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
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
