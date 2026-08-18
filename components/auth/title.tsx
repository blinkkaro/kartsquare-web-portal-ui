"use client";
import React from "react";
import { Box, Typography } from "@mui/material";

function Title({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
      <Typography 
        variant="h2"
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
