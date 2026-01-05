"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import {
  Grid,
  Box,
  Typography,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { t, locale, changeLanguage } = useTranslate();
  const handleLanguageChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      changeLanguage(event.target.value as any);
    },
    []
  );
  return (
    <Grid container sx={{ minHeight: "100vh", width: "100%" }}>
      {/* Left Side (Image & Branding) */}
      <Grid
        size={{ xs: 12, lg: 6 }}
        sx={{
          background: COLORS.PURPLECYAN,
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Image src="/logo.svg" alt="auth" width={200} height={200} priority />
          <Typography
            variant="h2"
            sx={{ fontWeight: "bold", color: COLORS.TEXT_DARK }} // gray-800 equivalent
          >
            KartSquare
          </Typography>
        </Box>
      </Grid>

      {/* Right Side (Form) */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Box sx={{ position: "absolute", top: 24, right: 24 }}>
          <Select
            value={locale}
            onChange={handleLanguageChange}
            size="small"
            variant="standard"
            disableUnderline
            sx={{ fontWeight: "bold" }}
          >
            <MenuItem value="en">🇺🇸 EN</MenuItem>
            <MenuItem value="es">🇪🇸 ES</MenuItem>
            <MenuItem value="hi">🇮🇳 HI</MenuItem>
          </Select>
        </Box>
        <Box
          sx={{
            background: {
              xs: COLORS.PURPLECYAN,
              lg: "none",
            },
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            justifyContent: "center",
            minHeight: "100vh",
            px: { xs: 4, lg: "10rem" },
            py: { xs: 4, lg: 2 },
          }}
        >
          {children}
        </Box>
      </Grid>
    </Grid>
  );
}

export default AuthWrapper;
