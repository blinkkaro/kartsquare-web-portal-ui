"use client";
import React from "react";
import { Breadcrumbs, Link, Typography, useTheme } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface ServiceDetailsBreadcrumbProps {
    serviceName: string;
}

const ServiceDetailsBreadcrumb = ({ serviceName }: ServiceDetailsBreadcrumbProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const router = useRouter();

    return (
        <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{
                mb: 3,
                "& .MuiBreadcrumbs-separator": {
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                },
            }}
        >
            <Link
                component="button"
                onClick={() => router.push("/")}
                sx={{
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": {
                        textDecoration: "underline",
                        color: COLORS.PRIMARY_PURPLE,
                    },
                }}
            >
                {english.home}
            </Link>
            <Link
                component="button"
                onClick={() => router.push("/spr/servicesList")}
                sx={{
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    "&:hover": {
                        textDecoration: "underline",
                        color: COLORS.PRIMARY_PURPLE,
                    },
                }}
            >
                {english.my_services}
            </Link>
            <Typography
                sx={{
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                }}
            >
                {serviceName || english.service_description}
            </Typography>
        </Breadcrumbs>
    );
};

export default ServiceDetailsBreadcrumb;
