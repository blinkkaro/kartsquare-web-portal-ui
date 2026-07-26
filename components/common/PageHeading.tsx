"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

interface PageHeadingProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Semantic heading tag override, e.g. "h1" for the page's primary heading. */
  component?: React.ElementType;
  sx?: object;
}

/**
 * Canonical page-title heading: same fontSize scale and weight everywhere
 * it's used, so page titles read as one consistent system.
 */
const PageHeading: React.FC<PageHeadingProps> = ({ title, subtitle, component, sx }) => {
  return (
    <Box sx={{ mb: 1, ...sx }}>
      <Typography
        variant="h4"
        {...(component ? { component } : {})}
        color="text.primary"
        sx={{
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
          fontWeight: 900,
          lineHeight: 1.2,
          letterSpacing: "-0.03em",
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0.5,
            fontSize: { xs: "0.75rem", sm: "0.85rem" },
            fontWeight: 500,
            opacity: 0.8,
            letterSpacing: "0.01em",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeading;
