"use client";

import React from "react";
import { Typography, TypographyProps } from "@mui/material";

interface PageTitleProps extends Omit<TypographyProps, "variant"> {
  subtitle?: React.ReactNode;
  subtitleProps?: TypographyProps;
}

/**
 * Top-level page heading (e.g. "Delete Account", "My Bookings").
 * Sizing comes from theme.typography.h4 (utils/theme.ts) — do not
 * override fontSize via sx here; that's how the app ended up with
 * a different heading size on every page.
 */
function PageTitle({
  children,
  subtitle,
  subtitleProps,
  component = "h1",
  sx,
  ...rest
}: PageTitleProps) {
  return (
    <>
      <Typography variant="h4" component={component} sx={sx} {...rest}>
        {children}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1 }}
          {...subtitleProps}
        >
          {subtitle}
        </Typography>
      )}
    </>
  );
}

export default PageTitle;
