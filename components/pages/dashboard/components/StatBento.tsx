"use client";

import React from "react";
import { alpha, Box, Typography } from "@mui/material";
import {
  CallRounded,
  EventAvailableRounded,
  GroupRounded,
  RemoveRedEyeRounded,
  StorefrontRounded,
} from "@mui/icons-material";
import { motion, useReducedMotion } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import type { stats as ProviderStats } from "@/services/providerDashboard/providerDashboard.interface";
import AnimatedNumber from "./AnimatedNumber";

interface StatBentoProps {
  stats: ProviderStats;
}

interface TileProps {
  label: string;
  value: number;
  hint?: string;
  icon: React.ReactNode;
  index: number;
}

/** A small tile: tinted icon, big number, one-line label. Real zeros stay zeros. */
const Tile: React.FC<TileProps> = ({ label, value, hint, icon, index }) => {
  const reduceMotion = useReducedMotion();
  return (
    <Box
      component={motion.div}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : 0.04 * index, duration: 0.25, ease: "easeOut" }}
      sx={{
        borderRadius: "16px",
        p: 2,
        minWidth: 0,
        bgcolor: COLORS.WHITE,
        border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
        boxShadow: COLORS.NEW_UI.CARD_SHADOW_LIGHT,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        transition: "box-shadow 200ms ease-out, border-color 200ms ease-out",
        "&:hover": {
          boxShadow: COLORS.NEW_UI.CARD_SHADOW_HOVER_LIGHT,
          borderColor: COLORS.NEW_UI.CARD_BORDER_HOVER_LIGHT,
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "12px",
          display: "grid",
          placeItems: "center",
          bgcolor: COLORS.PURPLE_ALPHA_10,
          color: COLORS.PRIMARY_PURPLE,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h4" component="p" sx={{ fontVariantNumeric: "tabular-nums" }}>
          <AnimatedNumber value={value} />
        </Typography>
        <Typography variant="body2" noWrap sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
          {label}
        </Typography>
        {hint && (
          <Typography
            variant="caption"
            noWrap
            sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, display: "block" }}
          >
            {hint}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const StatBento: React.FC<StatBentoProps> = ({ stats }) => {
  const { t } = useTranslate();
  const reduceMotion = useReducedMotion();

  return (
    <Box
      component="section"
      aria-label={t("dashboard")}
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
      }}
    >
      {/* Featured tile: the one number a provider cares about most, with its breakdown. */}
      <Box
        component={motion.div}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        sx={{
          gridColumn: "span 2",
          gridRow: { md: "span 2" },
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          p: 3,
          color: COLORS.WHITE,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 2,
          background: `linear-gradient(135deg, ${COLORS.PURPLE_DEEP} 0%, ${COLORS.PRIMARY_PURPLE} 100%)`,
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            right: -32,
            bottom: -48,
            width: 160,
            height: 160,
            borderRadius: "50%",
            bgcolor: alpha(COLORS.SECONDARY_ORANGE, 0.4),
            filter: "blur(36px)",
          }}
        />
        <Box
          sx={{
            position: "relative",
            width: 40,
            height: 40,
            borderRadius: "12px",
            display: "grid",
            placeItems: "center",
            bgcolor: alpha(COLORS.WHITE, 0.18),
          }}
        >
          <EventAvailableRounded />
        </Box>
        <Box sx={{ position: "relative" }}>
          <Typography variant="h2" component="p" sx={{ fontVariantNumeric: "tabular-nums" }}>
            <AnimatedNumber value={stats.total_bookings ?? 0} />
          </Typography>
          <Typography sx={{ fontWeight: 600, opacity: 0.9 }}>{t("pd_stat_bookings")}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
            {t("pd_stat_breakdown", {
              pending: stats.total_pending_bookings ?? 0,
              completed: stats.total_completed_bookings ?? 0,
            })}
          </Typography>
        </Box>
      </Box>

      <Tile
        index={1}
        label={t("pd_stat_followers")}
        value={stats.followers ?? 0}
        icon={<GroupRounded />}
      />
      <Tile
        index={2}
        label={t("pd_stat_views")}
        value={stats.total_profile_views ?? 0}
        icon={<RemoveRedEyeRounded />}
      />
      <Tile
        index={3}
        label={t("pd_stat_services")}
        value={stats.total_active_services ?? 0}
        hint={t("pd_stat_services_of", { total: stats.total_services ?? 0 })}
        icon={<StorefrontRounded />}
      />
      <Tile
        index={4}
        label={t("pd_stat_calls")}
        value={stats.total_phone_number_views ?? 0}
        icon={<CallRounded />}
      />
    </Box>
  );
};

export default StatBento;
