"use client";

import React from "react";
import { Box } from "@mui/material";
import TimeInputField from "./TimeInputField";
import { useTranslationContext } from "@/features/i18n/TranslationContext";

interface BreakTimeRowProps {
  breakStart: string;
  breakEnd: string;
  onBreakStartChange: (value: string) => void;
  onBreakEndChange: (value: string) => void;
}

const BreakTimeRow: React.FC<BreakTimeRowProps> = ({
  breakStart,
  breakEnd,
  onBreakStartChange,
  onBreakEndChange,
}) => {
  const { t } = useTranslationContext();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <TimeInputField
        label={t("breakStarting")}
        value={breakStart}
        onChange={onBreakStartChange}
      />
      <TimeInputField
        label={t("breakEnding")}
        value={breakEnd}
        onChange={onBreakEndChange}
      />
    </Box>
  );
};

export default BreakTimeRow;
