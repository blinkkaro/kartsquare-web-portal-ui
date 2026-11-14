"use client";

import React from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { GroupRounded, LockRounded, PublicRounded } from "@mui/icons-material";
import { motion, useReducedMotion } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { Visibility } from "@/services/post/postInterfaces";

interface VisibilityChoiceProps {
  value: Visibility;
  onChange: (value: Visibility) => void;
}

/** Three radio cards with a highlight that slides to the choice. One decision, no dropdown. */
const VisibilityChoice: React.FC<VisibilityChoiceProps> = ({ value, onChange }) => {
  const { t } = useTranslate();
  const reduceMotion = useReducedMotion();
  const options = [
    {
      value: Visibility.PUBLIC,
      label: t("public"),
      desc: t("cp_vis_public_desc"),
      icon: <PublicRounded />,
    },
    {
      value: Visibility.FRIENDS,
      label: t("friends"),
      desc: t("cp_vis_friends_desc"),
      icon: <GroupRounded />,
    },
    {
      value: Visibility.PRIVATE,
      label: t("private"),
      desc: t("cp_vis_private_desc"),
      icon: <LockRounded />,
    },
  ];

  return (
    <Box
      role="radiogroup"
      aria-label={t("cp_step_audience")}
      sx={{
        display: "grid",
        gap: 1.5,
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
      }}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <ButtonBase
            key={o.value}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              alignItems: { xs: "center", sm: "flex-start" },
              justifyContent: "flex-start",
              gap: 1,
              minHeight: 44,
              p: 2,
              textAlign: "left",
              borderRadius: "16px",
              bgcolor: COLORS.WHITE,
              border: `1px solid ${selected ? "transparent" : COLORS.NEW_UI.CARD_BORDER_LIGHT}`,
              color: selected ? COLORS.PRIMARY_PURPLE : COLORS.TEXT.PRIMARY_LIGHT,
              transition: "color 200ms ease-out, border-color 200ms ease-out",
              "&:hover": { borderColor: COLORS.NEW_UI.CARD_BORDER_HOVER_LIGHT },
              "&.Mui-focusVisible": {
                outline: `3px solid ${COLORS.PRIMARY_PURPLE}`,
                outlineOffset: 2,
              },
            }}
          >
            {selected && (
              <Box
                component={motion.span}
                layoutId="visibility-highlight"
                transition={
                  reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }
                }
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "16px",
                  bgcolor: COLORS.PURPLE_ALPHA_10,
                  border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
                }}
              />
            )}
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "inherit",
                alignItems: "inherit",
                gap: 1,
              }}
            >
              {o.icon}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {o.label}
                </Typography>
                <Typography variant="caption" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
                  {o.desc}
                </Typography>
              </Box>
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default VisibilityChoice;
