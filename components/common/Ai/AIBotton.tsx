"use client";
import React, { useState, useEffect, useRef } from "react";
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

  // Speech-bubble hints: a few short, timed nudges (Hinglish), then it stays quiet.
  const HINTS = ["Ask Kart AI", "AC thanda nahi kar raha?", "Plumber chahiye?", "Salon at home?"];
  const [hint, setHint] = useState<string | null>(null);
  const hintDone = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let shown = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cycle = () => {
      if (hintDone.current || shown >= 5) return;
      setHint(HINTS[shown % HINTS.length]);
      shown += 1;
      timers.push(setTimeout(() => setHint(null), 3200));
      timers.push(setTimeout(cycle, 9000));
    };
    timers.push(setTimeout(cycle, 4000));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      className="ks-ai"
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
      {/* timed speech bubble; never blocks taps */}
      {hint && (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            right: "calc(100% + 10px)",
            top: "50%",
            mt: "-17px",
            px: 1.5,
            py: 0.8,
            borderRadius: "14px 14px 4px 14px",
            bgcolor: "#2a0d73",
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: 600,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 6px 18px rgba(42,13,115,0.35)",
            animation: "ks-ai-bubble 350ms cubic-bezier(0.22, 1, 0.36, 1) both",
          }}
        >
          {hint}
        </Box>
      )}

      <ButtonBase
        onClick={() => {
          hintDone.current = true;
          setHint(null);
          setOpen(true);
        }}
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
          transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:active": { transform: "scale(0.92)" },
        }}
      >
        {/* spinning gradient ring */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: "-4px",
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, #d9c8ff, #6927da, #2a0d73, #a77bff, #d9c8ff)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2.5px))",
            animation: "ks-ai-spin 3.5s linear infinite",
          }}
        />
        {/* orbiting spark */}
        <Box aria-hidden sx={{ position: "absolute", inset: "-10px", animation: "ks-ai-spin 6s linear infinite reverse", pointerEvents: "none" }}>
          <Box sx={{ position: "absolute", top: 0, left: "50%", width: 6, height: 6, ml: "-3px", borderRadius: "50%", bgcolor: "#c9b2ff", boxShadow: "0 0 8px 2px rgba(201,178,255,0.9)" }} />
        </Box>
        {/* core */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at 30% 25%, #9a63ff 0%, #5b21d9 55%, #2a0d73 100%)",
            boxShadow: `0 8px 24px ${COLORS.PRIMARY_PURPLE}66, inset 0 1px 2px rgba(255,255,255,0.4)`,
            border: `2px solid ${theme.palette.mode === "dark" ? "rgba(23,20,34,0.9)" : "#ffffff"}`,
          }}
        >
          <AutoAwesomeRoundedIcon
            sx={{ fontSize: 24, color: "#fff", animation: "ks-ai-twinkle 2.4s ease-in-out infinite" }}
          />
        </Box>
      </ButtonBase>
    </Box>
  );

  return (
    <>
      {mobileButton}
      <Box
        className="ks-ai"
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
            overflow: "hidden",
            // light sweep that glides across the pill every few seconds
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: "35%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
              animation: "ks-ai-sweep 4.5s ease-in-out infinite",
              pointerEvents: "none",
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
