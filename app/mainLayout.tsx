"use client";
import React from "react";
import Nav from "@/components/common/Nav";
import { Box, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        // Responsive padding
        px: { xs: 0, sm: 1.5, md: 3, lg: 4, xl: 5 },
        pt: { xs: 0, md: 0 },
        pb: { xs: 4, md: 6 },
        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PAPER_DARK
            : COLORS.BACKGROUND.PAPER_LIGHT,
        // more breathing room at bottom on mobile
      }}
    >
      <Nav />

      {/* Main content wrapper - grows to fill available space */}
      <Box
        component="main"
        sx={{
          flex: 1,
          maxWidth: { lg: "1400px", xl: "1600px" },
          mx: "auto",
          width: "100%",
          px: { xs: 2, sm: 3 },
          mt: { xs: 9, sm: 7, md: 5, lg: 7 },
          backgroundColor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PAPER_LIGHT,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
