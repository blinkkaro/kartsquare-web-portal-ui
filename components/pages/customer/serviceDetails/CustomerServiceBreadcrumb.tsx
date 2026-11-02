"use client";
import React from "react";
import Link from "next/link";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface CustomerServiceBreadcrumbProps {
  serviceName: string;
}

const CustomerServiceBreadcrumb = ({
  serviceName,
}: CustomerServiceBreadcrumbProps) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const crumbs: Array<{ label: string; href?: string }> = [
    { label: english.home, href: "/" },
    { label: english.services, href: "/cus/servicesList" },
    { label: serviceName || english.service_details },
  ];

  return (
    <Box
      component="nav"
      aria-label="Breadcrumb"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        fontSize: "0.82rem",
        color: "text.secondary",
        flexWrap: "wrap",
        minWidth: 0,
      }}
    >
      {crumbs.map((crumb, idx) => {
        const isLast = idx === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.label + idx}>
            {idx > 0 && (
              <Typography
                component="span"
                aria-hidden
                sx={{
                  color: dark
                    ? COLORS.NEW_UI.CRUMB_SEPARATOR_DARK
                    : COLORS.NEW_UI.CRUMB_SEPARATOR_LIGHT,
                  mx: 0.5,
                  fontSize: "0.85rem",
                }}
              >
                /
              </Typography>
            )}
            {crumb.href && !isLast ? (
              <Box
                component={Link}
                href={crumb.href}
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": { color: COLORS.PRIMARY_PURPLE },
                }}
              >
                {crumb.label}
              </Box>
            ) : (
              <Typography
                component="span"
                aria-current="page"
                sx={{
                  fontSize: "inherit",
                  fontWeight: 700,
                  color: "text.primary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: { xs: 200, sm: 360, md: 520 },
                }}
              >
                {crumb.label}
              </Typography>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default CustomerServiceBreadcrumb;
