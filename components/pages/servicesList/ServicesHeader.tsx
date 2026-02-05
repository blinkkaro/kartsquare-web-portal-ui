"use client";

import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { Handyman } from "@mui/icons-material";

interface ServicesHeaderProps {
    title?: string;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ title }) => {
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";
    const textPrimary = isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT;
    const textSecondary = isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT;

    return (
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <Box
                sx={{
                    width: { xs: 44, sm: 52 },
                    height: { xs: 44, sm: 52 },
                    borderRadius: 2,
                    bgcolor: COLORS.PURPLE_ALPHA_10,
                    border: `1px solid ${isDark ? COLORS.PURPLE_ALPHA_20 : COLORS.PURPLE_ALPHA_04}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <Handyman sx={{ fontSize: { xs: 26, sm: 30 }, color: COLORS.PRIMARY_PURPLE }} />
            </Box>
            <Box>
                <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{
                        color: textPrimary,
                        fontSize: { xs: "1.35rem", sm: "1.6rem", md: "1.85rem" },
                        lineHeight: 1.25,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {title ?? t("services_for_you")}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: textSecondary,
                        mt: 0.5,
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        fontWeight: 500,
                    }}
                >
                    {t("services_for_you_subtitle")}
                </Typography>
            </Box>
        </Box>
    );
};

export default ServicesHeader;
