"use client";

import React from "react";
import { Typography, TypographyProps } from "@mui/material";

interface SectionTitleProps extends Omit<TypographyProps, "variant"> {
  subtitle?: React.ReactNode;
  subtitleProps?: TypographyProps;
}

/**
 * Heading for a section/card block within a page (e.g. "Deletion Request Form",
 * a dashboard card header). Sizing comes from theme.typography.h5 — do not
 * override fontSize via sx.
 */
function SectionTitle({
  children,
  subtitle,
  subtitleProps,
  component = "h2",
  sx,
  ...rest
}: SectionTitleProps) {
  return (
    <>
      <Typography variant="h5" component={component} sx={sx} {...rest}>
        {children}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
          {...subtitleProps}
        >
          {subtitle}
        </Typography>
      )}
    </>
  );
}

export default SectionTitle;
