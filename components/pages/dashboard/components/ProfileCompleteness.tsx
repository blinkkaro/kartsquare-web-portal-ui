"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { CheckRounded } from "@mui/icons-material";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { COMPLETENESS_ROUTES } from "@/lib/providerDashboard";
import type { ProfileCompleteness as ProfileCompletenessData } from "@/services/providerDashboard/providerDashboard.interface";
import AnimatedNumber from "./AnimatedNumber";

interface ProfileCompletenessProps {
  completeness: ProfileCompletenessData;
}

const RING_SIZE = 112;
const RING_STROKE = 10;
const RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({ completeness }) => {
  const { t } = useTranslate();
  const reduceMotion = useReducedMotion();

  // Nothing left to do: the checklist retires itself.
  if (completeness.percent >= 100 || !completeness.next_step) return null;

  const offset = CIRCUMFERENCE * (1 - completeness.percent / 100);
  const nextLabel = t(`pd_step_${completeness.next_step}`);

  return (
    <Box
      component="section"
      aria-labelledby="profile-completeness-title"
      sx={{
        borderRadius: "16px",
        p: 3,
        bgcolor: "background.paper",
        border: `1px solid ${COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
        boxShadow: COLORS.NEW_UI.CARD_SHADOW_LIGHT,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
        <Box sx={{ position: "relative", width: RING_SIZE, height: RING_SIZE, flexShrink: 0 }}>
          <svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
            aria-hidden="true"
          >
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={COLORS.PURPLE_ALPHA_10}
              strokeWidth={RING_STROKE}
            />
            <motion.circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={COLORS.PRIMARY_PURPLE}
              strokeWidth={RING_STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: reduceMotion ? offset : CIRCUMFERENCE }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
              transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          </svg>
          <Typography
            variant="h5"
            component="p"
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span>
              <AnimatedNumber value={completeness.percent} />%
            </span>
          </Typography>
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography id="profile-completeness-title" variant="h6" component="h2">
            {t("pd_profile_title", { percent: completeness.percent })}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, mt: 0.5 }}>
            {t("pd_profile_sub")}
          </Typography>
        </Box>
      </Box>

      <Box
        component="ul"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          mb: 3,
        }}
      >
        {completeness.steps.map((step, i) => (
          <Box
            key={step.key}
            component={motion.li}
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.06 * i, duration: 0.25 }}
            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                bgcolor: step.done ? COLORS.SUCCESS_GREEN : "transparent",
                border: step.done ? "none" : `2px solid ${COLORS.BORDER.DEFAULT_LIGHT}`,
                color: COLORS.WHITE,
              }}
            >
              {step.done && <CheckRounded sx={{ fontSize: 16 }} />}
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: step.done ? 500 : 600,
                color: step.done ? COLORS.TEXT.SECONDARY_LIGHT : COLORS.TEXT.PRIMARY_LIGHT,
                textDecoration: step.done ? "line-through" : "none",
              }}
            >
              {t(`pd_step_${step.key}`)}
              {step.done && (
                <Box component="span" sx={visuallyHidden}>
                  {" "}
                  {t("pd_step_done")}
                </Box>
              )}
            </Typography>
          </Box>
        ))}
      </Box>

      <Button
        component={Link}
        href={COMPLETENESS_ROUTES[completeness.next_step]}
        variant="contained"
        fullWidth
        sx={{
          minHeight: 48,
          borderRadius: "12px",
          fontWeight: 700,
          textTransform: "none",
          bgcolor: COLORS.PRIMARY_PURPLE,
          "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
        }}
      >
        {t("pd_profile_next", { step: nextLabel })}
      </Button>
    </Box>
  );
};

export default ProfileCompleteness;
