"use client";
import React from "react";
import { Typography, Button, useTheme } from "@mui/material";
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

  return (
    <>
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
