"use client";
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";

interface CustomerServiceInfoProps {
  serviceName: string;
  serviceDesc: string;
  onContinueReading: () => void;
  showContinueReading: boolean;
}

const CustomerServiceInfo = ({
  serviceDesc,
  onContinueReading,
  showContinueReading,
}: CustomerServiceInfoProps) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const chipSx = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    px: 1.25,
    py: 0.4,
    borderRadius: "999px",
    fontSize: "0.76rem",
    fontWeight: 700,
    bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10,
    color: dark ? COLORS.NEW_UI.CHIP_TEXT_DARK : COLORS.PRIMARY_PURPLE,
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
        <Box component="span" sx={chipSx}>
          <CheckCircleRoundedIcon sx={{ fontSize: 14, color: COLORS.NEW_UI.VERIFIED_GREEN }} />
          {english.verified_service}
        </Box>
        <Box component="span" sx={chipSx}>
          <BoltRoundedIcon sx={{ fontSize: 14 }} />
          {english.high_success_rate}
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: "0.9rem",
          lineHeight: 1.6,
          color: "text.secondary",
          mb: showContinueReading ? 0.75 : 0,
          display: "-webkit-box",
          WebkitLineClamp: 10,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "pre-line",
        }}
      >
        {serviceDesc || english.no_description_available}
      </Typography>

      {showContinueReading && (
        <Button
          onClick={onContinueReading}
          sx={{
            fontSize: "0.84rem",
            fontWeight: 700,
            color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE,
            textTransform: "none",
            p: 0,
            minWidth: 0,
            "&:hover": { textDecoration: "underline", bgcolor: "transparent" },
          }}
        >
          {english.continue_reading}
        </Button>
      )}
    </>
  );
};

export default CustomerServiceInfo;
