"use client";
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
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
