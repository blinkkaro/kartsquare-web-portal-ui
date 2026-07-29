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
import { useMediaQuery } from "@mui/material";

interface AuthWrapperProps {
  children: React.ReactNode;
  align?: "center" | "top";
}

function AuthWrapper({ children, align = "center" }: AuthWrapperProps) {
  const { t, locale, changeLanguage } = useTranslate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));

  useEffect(() => {
    if (
      isAuthenticated &&
      user?.register_step === UserRegisterSteps.COMPLETED
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, user, router]);

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor:
          theme.palette.mode === "light"
            ? COLORS.BACKGROUND.PRIMARY_LIGHT
            : COLORS.BACKGROUND.PRIMARY_DARK,
      }}
    >
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
          // p: 1,
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
          <Image
            src="/logo.svg"
            alt="auth"
            width={isLargeScreen ? 200 : 150}
            height={isLargeScreen ? 200 : 150}
            priority
          />
          <Typography
            sx={{
              fontWeight: "bold",
              color:
                theme.palette.mode === "light" ? "text.primary" : "#ffffff",
              letterSpacing: "-0.02em",
              fontSize: isLargeScreen ? "4rem" : "3rem",
            }}
          >
            kartsquare
          </Typography>
        </Box>
      </Grid>

      {/* Right Side (Form) */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <Box
          sx={{
            background: {
              xs:
                theme.palette.mode === "light"
                  ? COLORS.PURPLECYAN
                  : COLORS.DARK_GRADIENT,
              lg:
                theme.palette.mode === "light"
                  ? COLORS.BACKGROUND.PRIMARY_LIGHT
                  : COLORS.BACKGROUND.PRIMARY_DARK,
            },
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            justifyContent: align === "top" ? "flex-start" : "center",
            alignItems: "center",
            minHeight: "100vh",
            px: { xs: 1.5, lg: 10 },
            py: { xs: 3, lg: 2 },
            pt: align === "top" ? { xs: 6, lg: 8 } : { xs: 3, lg: 2 },
            transition: "background 0.3s ease-in-out",
          }}
        >
          {/* Card wrapper — matches reference design on mobile/tablet; desktop keeps the plain panel */}
          <Box
            sx={{
              width: "100%",
              maxWidth: { xs: 480, lg: "none" },
              bgcolor: {
                xs:
                  theme.palette.mode === "light"
                    ? COLORS.BACKGROUND.PRIMARY_LIGHT
                    : COLORS.BACKGROUND.SECONDARY_DARK,
                lg: "transparent",
              },
              borderRadius: { xs: "24px", lg: 0 },
              boxShadow: {
                xs:
                  theme.palette.mode === "light"
                    ? "0 20px 60px rgba(94, 24, 233, 0.12)"
                    : "0 20px 60px rgba(0, 0, 0, 0.4)",
                lg: "none",
              },
              overflow: "hidden",
              position: "relative",
              px: { xs: 3.5, sm: 4.5, lg: 0 },
              py: { xs: 3.5, sm: 4.5, lg: 0 },
            }}
          >
            {/* Decorative blob — mobile card only */}
            <Box
              sx={{
                display: { xs: "block", lg: "none" },
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: COLORS.PURPLECYAN,
                opacity: theme.palette.mode === "light" ? 0.5 : 0.15,
                pointerEvents: "none",
              }}
            />
            <Box sx={{ position: "relative" }}>{children}</Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default AuthWrapper;
