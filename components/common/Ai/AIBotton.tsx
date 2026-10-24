"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Box, ButtonBase, Typography, useTheme } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { secureStorage } from "@/helper/SecureStorage";
import { AppUserType } from "@/services/auth/auth.interface";
import { shouldShowAIBot } from "@/constants/aiBot";
import { useAppAIServiceConfig } from "@/hooks/useAppConfig";
import Image from "next/image";

function AIBotton({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const { t } = useTranslate();
  const pathname = usePathname();
  const role: AppUserType = secureStorage.getItem("role");
  const { data: appAIServiceConfig } = useAppAIServiceConfig();
  const theme = useTheme();
  const services = [
    t("plumber"),
    t("electrician"),
    t("carpenter"),
    t("cleaner"),
    t("painter"),
    t("gardener"),
  ];

  // This useEffect must be called before any conditional returns
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentServiceIndex((prev) => (prev + 1) % services.length);
        setFadeIn(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Check visibility AFTER all hooks have been called
  if (!shouldShowAIBot(pathname, role, appAIServiceConfig)) {
    return null;
  }

  // Both variants are rendered and switched with CSS (display), never with a JS media query:
  // useMediaQuery makes the server and first client render disagree, which caused a hydration error.
  // Pinned to the screen's right edge — independent of the nav dock's own
  // width (the dock sizes to fit its tabs, so tying this to a shared "dock
  // width" constant drifted out of sync and clipped/overlapped the dock).
  const AI_SIZE = { xs: "48px", sm: "56px" };
  const mobileButton = (
    <Box
      sx={{
        display: { xs: "block", lg: "none" },
        position: "fixed",
        // Sits just above the bottom nav (60px bar + 12px tablet float gap + breathing room)
        bottom:
          "calc(var(--mobile-nav-h, 60px) + 12px + 16px + env(safe-area-inset-bottom, 0px))",
        transition: "bottom 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        right: "16px",
        width: AI_SIZE,
        height: AI_SIZE,
        zIndex: 1000,
      }}
    >
      <ButtonBase
        onClick={() => setOpen(true)}
        aria-label="Ask Kart AI"
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: `linear-gradient(135deg, ${COLORS.ICON_GRADIENT.Light.START} 0%, ${COLORS.ICON_GRADIENT.Light.END} 100%)`,
          boxShadow: `0 8px 24px ${COLORS.PRIMARY_PURPLE}55, 0 2px 8px rgba(0,0,0,0.15)`,
          border: `2px solid ${
            theme.palette.mode === "dark" ? "rgba(23,20,34,0.9)" : "#ffffff"
          }`,
          transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          animation: "aiFloat 3s ease-in-out infinite",
          "@keyframes aiFloat": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-6px)" },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "-5px",
            borderRadius: "50%",
            border: `1.5px solid ${COLORS.PRIMARY_PURPLE}66`,
            animation: "aiRing 2.2s ease-out infinite",
          },
          "@keyframes aiRing": {
            "0%": { transform: "scale(0.85)", opacity: 0.9 },
            "100%": { transform: "scale(1.25)", opacity: 0 },
          },
          "&:active": {
            transform: "scale(0.94)",
          },
        }}
      >
        <AutoAwesomeRoundedIcon
          sx={{ fontSize: 26, color: "#fff", position: "relative", zIndex: 1 }}
        />
      </ButtonBase>
    </Box>
  );

  return (
    <>
      {mobileButton}
      <Box
        sx={{
          display: { xs: "none", lg: "block" },
          position: "fixed",
          bottom: { xs: 90, md: 30 },
          right: 20,
          zIndex: 1000,
        }}
      >
        <ButtonBase
          onClick={() => setOpen(true)}
          aria-label="Ask Kart AI"
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1,
            // py: 1.5,
            borderRadius: "50px",
            background: COLORS.PURPLECYAN,
            color: COLORS.DARK,
            fontWeight: 600,
            fontSize: { xs: "0.85rem", md: "0.95rem" },
            cursor: "pointer",
            // boxShadow: `0 8px 24px ${COLORS.PRIMARY_PURPLE}30`,
            transition: "all 0.3s ease",
            animation: "float 3s ease-in-out infinite",
            // minWidth: { xs: "200px", md: "240px" },
            "@keyframes float": {
              "0%, 100%": {
                transform: "translateY(0px)",
              },
              "50%": {
                transform: "translateY(-8px)",
              },
            },
            "&:hover": {
              transform: "scale(1.05) translateY(-4px)",
              boxShadow: `0 12px 32px ${COLORS.PRIMARY_PURPLE}50`,
            },
            "&:active": {
              transform: "scale(0.98) translateY(-2px)",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "50px",
              opacity: 0.4,
              filter: "blur(20px)",
              zIndex: -1,
              animation: "pulse 2s ease-in-out infinite",
            },
            "@keyframes pulse": {
              "0%, 100%": {
                opacity: 0.4,
                transform: "scale(1)",
              },
              "50%": {
                opacity: 0.6,
                transform: "scale(1.1)",
              },
            },
          }}
        >
          <Image src="/Chatbot.svg" alt="Chatbot" width={40} height={50} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.7rem",
                fontWeight: 500,
                opacity: 0.9,
                lineHeight: 1,
              }}
            >
              {t("discoverServices")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.85rem", md: "0.95rem" },
                fontWeight: 700,
                lineHeight: 1,
                opacity: fadeIn ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
              }}
            >
              {services[currentServiceIndex]}
            </Typography>
          </Box>
        </ButtonBase>
      </Box>
    </>
  );
}

export default AIBotton;
