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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { useEffect, useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { useTheme } from "@mui/material/styles";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { t, locale, changeLanguage } = useTranslate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (
      isAuthenticated &&
      user?.register_step === UserRegisterSteps.COMPLETED
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, user, router]);

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
          background:
            theme.palette.mode === "light"
              ? COLORS.PURPLECYAN
              : COLORS.DARK_GRADIENT,
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 4,
          position: "relative",
          transition: "background 0.3s ease-in-out",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Image src="/logo.svg" alt="auth" width={200} height={200} priority />
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bold",
              color:
                theme.palette.mode === "light" ? "text.primary" : "#ffffff",
              letterSpacing: "-0.02em",
            }}
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
              xs:
                theme.palette.mode === "light"
                  ? COLORS.PURPLECYAN
                  : COLORS.DARK_GRADIENT,
              lg: "none",
            },
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            justifyContent: "center",
            minHeight: "100vh",
            px: { xs: 4, lg: "10rem" },
            py: { xs: 4, lg: 2 },
            transition: "background 0.3s ease-in-out",
          }}
        >
          {children}
        </Box>
      </Grid>
    </Grid>
  );
}

export default AuthWrapper;
