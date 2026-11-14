"use client";

import React from "react";
import Link from "next/link";
import { alpha, Box, ButtonBase, Typography } from "@mui/material";
import {
  CheckCircleRounded,
  ChevronRightRounded,
  EventAvailableRounded,
  NotificationsActiveRounded,
  PersonAddAltRounded,
} from "@mui/icons-material";
import { motion, useReducedMotion } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import type { DashboardAttention } from "@/services/providerDashboard/providerDashboard.interface";
import AnimatedNumber from "./AnimatedNumber";

interface NeedsAttentionProps {
  attention: DashboardAttention;
}

interface Row {
  key: string;
  label: string;
  count: number;
  icon: React.ReactNode;
  href?: string;
}

const NeedsAttention: React.FC<NeedsAttentionProps> = ({ attention }) => {
  const { t } = useTranslate();
  const reduceMotion = useReducedMotion();

  const rows: Row[] = [
    {
      key: "bookings",
      label: t("pd_attention_bookings"),
      count: attention.pending_bookings,
      icon: <EventAvailableRounded />,
      href: "/spr/bookings",
    },
    {
      key: "leads",
      label: t("pd_attention_leads"),
      count: attention.new_leads_7d,
      icon: <PersonAddAltRounded />,
      href: "#leads",
    },
    {
      key: "notifications",
      label: t("pd_attention_notifications"),
      count: attention.unread_notifications,
      icon: <NotificationsActiveRounded />,
    },
  ];
  const active = rows.filter((r) => r.count > 0);

  if (active.length === 0) {
    return (
      <Box
        component={motion.section}
        aria-label={t("pd_attention_title")}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.5,
          borderRadius: "16px",
          bgcolor: alpha(COLORS.SUCCESS_GREEN, 0.1),
          border: `1px solid ${alpha(COLORS.SUCCESS_GREEN, 0.35)}`,
          color: COLORS.TEXT.PRIMARY_LIGHT,
        }}
      >
        <CheckCircleRounded sx={{ color: COLORS.SUCCESS_GREEN }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {t("pd_attention_clear")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="section" aria-labelledby="needs-attention-title" sx={{ height: "100%" }}>
      <Typography id="needs-attention-title" variant="h5" component="h2" sx={{ mb: 2 }}>
        {t("pd_attention_title")}
      </Typography>

      {active.length === 0 ? (
        <Box
          component={motion.div}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            color: COLORS.TEXT.SECONDARY_LIGHT,
            py: 1,
          }}
        >
          <CheckCircleRounded sx={{ color: COLORS.SUCCESS_GREEN, fontSize: 32 }} />
          <Typography sx={{ fontWeight: 600 }}>{t("pd_attention_clear")}</Typography>
        </Box>
      ) : (
        <Box
          component="ul"
          sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          {active.map((row, i) => {
            const content = (
              <>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: alpha(COLORS.SECONDARY_ORANGE, 0.14),
                    color: COLORS.SECONDARY_ORANGE,
                    flexShrink: 0,
                  }}
                >
                  {row.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <Typography
                    variant="h4"
                    component="p"
                    sx={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    <AnimatedNumber value={row.count} />
                  </Typography>
                  <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
                    {row.label}
                  </Typography>
                </Box>
                {row.href && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: COLORS.PRIMARY_PURPLE,
                      fontWeight: 600,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, display: { xs: "none", sm: "block" } }}
                    >
                      {t("pd_attention_review")}
                    </Typography>
                    <ChevronRightRounded />
                  </Box>
                )}
              </>
            );
            const baseSx = {
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 2,
              minHeight: 72,
              p: 1.5,
              borderRadius: "12px",
              border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
              transition:
                "transform 200ms ease-out, border-color 200ms ease-out, background-color 200ms ease-out",
            } as const;
            return (
              <Box
                key={row.key}
                component={motion.li}
                initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.04 * i, duration: 0.25, ease: "easeOut" }}
              >
                {row.href ? (
                  <ButtonBase
                    component={Link}
                    href={row.href}
                    sx={{
                      ...baseSx,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        borderColor: COLORS.NEW_UI.CARD_BORDER_HOVER_LIGHT,
                        bgcolor: COLORS.NEW_UI.SURFACE_SOFT_LIGHT,
                      },
                      "&.Mui-focusVisible": {
                        outline: `3px solid ${COLORS.PRIMARY_PURPLE}`,
                        outlineOffset: 2,
                      },
                    }}
                  >
                    {content}
                  </ButtonBase>
                ) : (
                  <Box sx={baseSx}>{content}</Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default NeedsAttention;
