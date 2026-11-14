"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { alpha, Avatar, Box, ButtonBase, Chip, Typography } from "@mui/material";
import { OpenInNewRounded, PlaceRounded } from "@mui/icons-material";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { greetingPart, publicProfilePath } from "@/lib/providerDashboard";
import type { DashboardProfile } from "@/services/providerDashboard/providerDashboard.interface";
import { DASHBOARD_BUTTON_SX } from "./buttonSx";

interface ProviderGreetingHeroProps {
  profile: DashboardProfile;
  onToggleAvailability: (accepting: boolean) => void;
  isTogglingAvailability: boolean;
}

const ProviderGreetingHero: React.FC<ProviderGreetingHeroProps> = ({
  profile,
  onToggleAvailability,
  isTogglingAvailability,
}) => {
  const { t } = useTranslate();
  const reduceMotion = useReducedMotion();
  // The greeting depends on the visitor's clock: null while rendering on the server, so there is no hydration mismatch.
  const part = useSyncExternalStore(
    () => () => undefined,
    () => greetingPart(new Date().getHours()),
    () => null,
  );

  const name = profile.first_name?.trim() || profile.business_name?.trim() || "";
  const publicPath = publicProfilePath(profile.username);
  const open = profile.is_accepting_bookings;
  // One-time entrance for the decorative shapes only: the content itself never waits on motion.
  const blobMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.7 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, ease: "easeOut" as const },
      };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px",
        p: { xs: 2, md: 4 },
        mb: { xs: 2, md: 3 },
        color: COLORS.WHITE,
        background: `linear-gradient(135deg, ${COLORS.PURPLE_DEEP} 0%, ${COLORS.PRIMARY_PURPLE} 62%, ${COLORS.PURPLE_HOVER} 100%)`,
      }}
    >
      {/* Decorative blobs: purely visual, hidden from assistive tech */}
      <Box
        aria-hidden
        component={motion.div}
        {...blobMotion}
        sx={{
          position: "absolute",
          top: -80,
          right: -40,
          width: 280,
          height: 280,
          borderRadius: "50%",
          bgcolor: alpha(COLORS.SECONDARY_ORANGE, 0.45),
          filter: "blur(48px)",
        }}
      />
      <Box
        aria-hidden
        component={motion.div}
        {...blobMotion}
        sx={{
          position: "absolute",
          bottom: -96,
          left: "28%",
          width: 240,
          height: 240,
          borderRadius: "50%",
          bgcolor: alpha(COLORS.PRIMARY_BLUE, 0.4),
          filter: "blur(56px)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, md: 3 }, minWidth: 0 }}>
          <Box
            component={motion.div}
            whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: -3 }}
            sx={{
              p: "4px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.SECONDARY_ORANGE}, ${COLORS.WHITE})`,
              flexShrink: 0,
            }}
          >
            <Avatar
              src={profile.profile_pic ?? undefined}
              alt={name}
              sx={{
                width: { xs: 56, md: 88 },
                height: { xs: 56, md: 88 },
                border: `3px solid ${COLORS.PURPLE_DEEP}`,
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: alpha(COLORS.WHITE, 0.8), minHeight: "1.5rem" }}
            >
              {part ? t(`pd_greeting_${part}`) : ""}
            </Typography>
            <Typography
              variant="h1"
              component="h1"
              sx={{ letterSpacing: "-0.01em", overflowWrap: "anywhere" }}
            >
              {t("pd_hi", { name })}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mt: 1 }}>
              <Chip
                label={t("pd_role_provider")}
                size="small"
                sx={{ bgcolor: alpha(COLORS.WHITE, 0.18), color: COLORS.WHITE, fontWeight: 600 }}
              />
              {profile.business_name && (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {profile.business_name}
                </Typography>
              )}
              {profile.city && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.85 }}>
                  <PlaceRounded sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{profile.city}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
          <ButtonBase
            role="switch"
            aria-checked={open}
            aria-label={t("pd_availability_label")}
            disabled={isTogglingAvailability}
            onClick={() => onToggleAvailability(!open)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minHeight: 44,
              px: 2.5,
              borderRadius: "30px",
              bgcolor: alpha(COLORS.WHITE, open ? 0.22 : 0.1),
              border: `1px solid ${alpha(COLORS.WHITE, 0.35)}`,
              backdropFilter: "blur(8px)",
              transition: "background-color 200ms ease-out",
              "&:hover": { bgcolor: alpha(COLORS.WHITE, 0.3) },
              "&.Mui-focusVisible": { outline: `3px solid ${COLORS.WHITE}`, outlineOffset: 2 },
              "&.Mui-disabled": { opacity: 0.7 },
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: open ? COLORS.SUCCESS_GREEN : alpha(COLORS.WHITE, 0.5),
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
              {open ? t("pd_open") : t("pd_away")}
            </Typography>
          </ButtonBase>

          {publicPath && (
            <Button
              component={Link}
              href={publicPath}
              variant="outlined"
              endIcon={<OpenInNewRounded />}
              sx={{
                ...DASHBOARD_BUTTON_SX,
                color: COLORS.WHITE,
                borderColor: alpha(COLORS.WHITE, 0.35),
                "&:hover": {
                  bgcolor: alpha(COLORS.WHITE, 0.15),
                  borderColor: alpha(COLORS.WHITE, 0.6),
                },
              }}
            >
              {t("pd_my_page")}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProviderGreetingHero;
