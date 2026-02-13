"use client";
import React from "react";
import { Breadcrumbs, Link, Typography, useTheme } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface CustomerServiceBreadcrumbProps {
  serviceName: string;
}

const CustomerServiceBreadcrumb = ({
  serviceName,
}: CustomerServiceBreadcrumbProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const router = useRouter();

  return (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      sx={{
        mb: 3,
        "& .MuiBreadcrumbs-separator": {
          color: isDark
            ? COLORS.TEXT.SECONDARY_DARK
            : COLORS.TEXT.SECONDARY_LIGHT,
        },
      }}
    >
      <Link
        component="button"
        onClick={() => router.push("/")}
        sx={{
          color: isDark
            ? COLORS.TEXT.SECONDARY_DARK
            : COLORS.TEXT.SECONDARY_LIGHT,
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
        onClick={() => router.push("/cus/servicesList")}
        sx={{
          color: isDark
            ? COLORS.TEXT.SECONDARY_DARK
            : COLORS.TEXT.SECONDARY_LIGHT,
          textDecoration: "none",
          fontSize: "0.875rem",
          "&:hover": {
            textDecoration: "underline",
            color: COLORS.PRIMARY_PURPLE,
          },
        }}
      >
        {english.services}
      </Link>
      <Typography
        sx={{
          color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      >
        {serviceName || english.service_details}
      </Typography>
    </Breadcrumbs>
  );
};

export default CustomerServiceBreadcrumb;
