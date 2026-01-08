'use client'
import React from "react";
import { Box, Typography } from "@mui/material";

function Title({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 700, color: "text.primary" }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default Title;
