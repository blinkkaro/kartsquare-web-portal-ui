"use client";

import React from "react";
import { alpha, Box, Typography } from "@mui/material";
import {
  CallRounded,
  EventAvailableRounded,
  GroupRounded,
  PersonAddAltRounded,
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
  /** Undefined while loading or if the request failed, so no false zero is shown. */
  totalLeads?: number;
  newLeads7d?: number;
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

interface FeaturedTileProps {
  label: string;
  value?: number;
  detail?: string;
  icon: React.ReactNode;
  index: number;
  background: string;
  href?: string;
}

/** A compact coloured tile for a headline number. Links to its section when given an href. */
const FeaturedTile: React.FC<FeaturedTileProps> = ({
  label,
  value,
  detail,
  icon,
  index,
  background,
  href,
}) => {
  const reduceMotion = useReducedMotion();
  return (
    <Box
      component={motion.div}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : 0.04 * index, duration: 0.25, ease: "easeOut" }}
      sx={{ display: "grid", minWidth: 0 }}
    >
      <Box
        component={href ? "a" : "div"}
        href={href}
        sx={{
          borderRadius: "16px",
          p: { xs: 1.5, md: 2 },
          color: COLORS.WHITE,
          textDecoration: "none",
          background,
          "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            aria-hidden
            sx={{
              width: 36,
              height: 36,
              flexShrink: 0,
              borderRadius: "10px",
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(COLORS.WHITE, 0.18),
            }}
          >
            {icon}
          </Box>
          <Typography variant="h4" component="p" sx={{ fontVariantNumeric: "tabular-nums" }}>
            {value === undefined ? "\u2013" : <AnimatedNumber value={value} />}
          </Typography>
        </Box>
        <Typography sx={{ fontWeight: 600, mt: 1 }}>{label}</Typography>
        {detail && (
          <Typography variant="caption" sx={{ display: "block" }}>
            {detail}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const StatBento: React.FC<StatBentoProps> = ({ stats, totalLeads, newLeads7d }) => {
  const { t } = useTranslate();

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
      {/* Headline numbers: leads and bookings share one row at every width. */}
      <Box
        sx={{
          gridColumn: "1 / -1",
          display: "grid",
          gap: { xs: 1.5, md: 2 },
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        }}
      >
        <FeaturedTile
          index={0}
          label={t("pd_stat_leads")}
          value={totalLeads}
          detail={
            newLeads7d === undefined ? undefined : t("pd_stat_leads_week", { count: newLeads7d })
          }
          icon={<PersonAddAltRounded />}
          href="#leads"
          background={`linear-gradient(135deg, ${COLORS.PURPLE_DEEP} 0%, ${COLORS.PRIMARY_PURPLE} 100%)`}
        />
        <FeaturedTile
          index={1}
          label={t("pd_stat_bookings")}
          value={stats.total_bookings ?? 0}
          detail={t("pd_stat_breakdown", {
            pending: stats.total_pending_bookings ?? 0,
            completed: stats.total_completed_bookings ?? 0,
          })}
          icon={<EventAvailableRounded />}
          background={`linear-gradient(135deg, ${COLORS.TEAL_DEEP} 0%, ${COLORS.TEAL} 100%)`}
        />
      </Box>

      <Tile
        index={2}
        label={t("pd_stat_followers")}
        value={stats.followers ?? 0}
        icon={<GroupRounded />}
      />
      <Tile
        index={3}
        label={t("pd_stat_views")}
        value={stats.total_profile_views ?? 0}
        icon={<RemoveRedEyeRounded />}
      />
      <Tile
        index={4}
        label={t("pd_stat_services")}
        value={stats.total_active_services ?? 0}
        hint={t("pd_stat_services_of", { total: stats.total_services ?? 0 })}
        icon={<StorefrontRounded />}
      />
      <Tile
        index={5}
        label={t("pd_stat_calls")}
        value={stats.total_phone_number_views ?? 0}
        icon={<CallRounded />}
      />
    </Box>
  );
};

export default StatBento;
