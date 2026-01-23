"use client";
import React from "react";
import { Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { getUserRole, UserRole } from "../../../../utils/auth";
import { english } from "../../../../features/i18n/en";

const ProviderServicesHeader = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const userRole = getUserRole();

    const pageTitle = userRole === UserRole.SERVICE_PROVIDER
        ? english.my_services
        : english.services_for_you;

    return (
        <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                lineHeight: { xs: 1.3, sm: 1.4 },
            }}
        >
            {pageTitle}
        </Typography>
    );
};

export default ProviderServicesHeader;
