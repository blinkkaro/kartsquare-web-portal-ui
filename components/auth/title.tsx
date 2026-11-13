"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

/** `as` sets the HTML heading level without changing how it looks (pages that need an H1 pass "h1"). */
function Title({ title, subtitle, as }: { title: string; subtitle?: string; as?: React.ElementType }) {
  return (
    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
      <Typography 
        variant="h2"
        {...(as ? { component: as } : {})}
        sx={{
          fontWeight: 700,
          color: "text.primary",
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 2,
            fontSize: { xs: "0.8rem", lg: "0.875rem", xl: "1.1rem" },
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default Title;
