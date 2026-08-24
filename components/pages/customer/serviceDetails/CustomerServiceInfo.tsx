"use client";
import React from "react";
import { Box, Typography, Button, Chip, useTheme } from "@mui/material";
import { Bolt, Verified } from "@mui/icons-material";
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
  const isDark = theme.palette.mode === "dark";

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
        <Chip
          icon={<Verified sx={{ fontSize: "15px !important" }} />}
          label={english.verified_service}
          size="small"
          sx={{
            bgcolor: isDark ? "rgba(29, 78, 216, 0.16)" : "#EFF6FF",
            color: "#1D4ED8",
            fontWeight: 800,
            fontSize: "0.7rem",
          }}
        />
        <Chip
          icon={<Bolt sx={{ fontSize: "14px !important" }} />}
          label={english.high_success_rate}
          size="small"
          sx={{
            bgcolor: isDark ? "rgba(16, 185, 129, 0.16)" : "#ECFDF5",
            color: "#059669",
            fontWeight: 800,
            fontSize: "0.7rem",
          }}
        />
      </Box>

      <Typography
        variant="body1"
        sx={{
          mb: showContinueReading ? 0.5 : 0,
          lineHeight: 1.65,
          color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
          display: "-webkit-box",
          WebkitLineClamp: 10,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {serviceDesc || english.no_description_available}
      </Typography>

      {showContinueReading && (
        <Button
          onClick={onContinueReading}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
            p: 0,
            "&:hover": {
              bgcolor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          {english.continue_reading}
        </Button>
      )}
    </>
  );
};

export default CustomerServiceInfo;
