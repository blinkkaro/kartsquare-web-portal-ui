"use client";
import React from "react";
import { alpha, Box, Typography } from "@mui/material";
import { COLORS } from "@/constants/colors";

interface EmptyPanelProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

/** The empty or no-results state for a list page: a violet disc, a plain sentence, one action at most. */
const EmptyPanel = ({ icon, title, description, action }: EmptyPanelProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: 1.5,
      py: { xs: 6, md: 8 },
      px: 2,
      borderRadius: "24px",
      border: `1px dashed ${COLORS.NEW_UI.CARD_BORDER_HOVER_LIGHT}`,
      background: `linear-gradient(135deg, ${COLORS.PURPLE_ALPHA_04} 0%, ${alpha(COLORS.SECONDARY_ORANGE, 0.06)} 100%)`,
    }}
  >
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        color: COLORS.WHITE,
        background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_DEEP})`,
        boxShadow: `0 8px 20px ${alpha(COLORS.PRIMARY_PURPLE, 0.3)}`,
      }}
    >
      {icon}
    </Box>
    <Typography variant="h5" component="h2">
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, maxWidth: 460 }}>
      {description}
    </Typography>
    {action}
  </Box>
);

export default EmptyPanel;
