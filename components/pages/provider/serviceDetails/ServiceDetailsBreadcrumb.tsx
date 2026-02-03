"use client";
import React from "react";
import { Breadcrumbs, Link, Typography, useTheme } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { COLORS } from "../../../../constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface ServiceDetailsBreadcrumbProps {
    serviceName: string;
}

const ServiceDetailsBreadcrumb = ({ serviceName }: ServiceDetailsBreadcrumbProps) => {
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";
    const router = useRouter();

    return (
        <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            sx={{
                mb: { xs: 2, sm: 3 },
                overflowX: "auto",
                "& .MuiBreadcrumbs-ol": {
                    flexWrap: { xs: "nowrap", sm: "wrap" },
                },
                "& .MuiBreadcrumbs-separator": {
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                },
            }}
        >
            <Link
                component="button"
                onClick={() => window.location.href = "/"}
                sx={{
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    textDecoration: "none",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                    "&:hover": {
                        textDecoration: "underline",
                        color: COLORS.PRIMARY_PURPLE,
                    },
                }}
            >
                {t("home")}
            </Link>
            <Link
                component="button"
                onClick={() => window.location.href = "/spr/servicesList"}
                sx={{
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    textDecoration: "none",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                    "&:hover": {
                        textDecoration: "underline",
                        color: COLORS.PRIMARY_PURPLE,
                    },
                }}
            >
                {t("my_services")}
            </Link>
            <Typography
                sx={{
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: { xs: "150px", sm: "none" },
                }}
            >
                {serviceName || t("service_description")}
            </Typography>
        </Breadcrumbs>
    );
};

export default ServiceDetailsBreadcrumb;
