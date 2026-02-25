"use client";
import React from "react";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { english } from "@/features/i18n/en";
import { useTranslate } from "@/hooks/useTranslate";

interface ServiceDurationProps {
  hasServiceDuration: boolean;
  onHasServiceDurationChange: (value: boolean) => void;
  days: string;
  onDaysChange: (value: string) => void;
  hours: string;
  onHoursChange: (value: string) => void;
  minutes: string;
  onMinutesChange: (value: string) => void;
  haveSlots: boolean;
  onHaveSlotsChange: (value: boolean) => void;
}

const ServiceDuration = ({
  hasServiceDuration,
  onHasServiceDurationChange,
  days,
  onDaysChange,
  hours,
  onHoursChange,
  minutes,
  onMinutesChange,
  haveSlots,
  onHaveSlotsChange,
}: ServiceDurationProps) => {
    const {t} = useTranslate();
  return (
    <>
      <Box sx={{ mb: hasServiceDuration ? 2 : 0 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hasServiceDuration}
              onChange={(e) => {
                onHasServiceDurationChange(e.target.checked);
                if (!e.target.checked) {
                  onHaveSlotsChange(false);
                }
              }}
              sx={{
                color: COLORS.PRIMARY_PURPLE,
                "&.Mui-checked": {
                  color: COLORS.PRIMARY_PURPLE,
                },
              }}
            />
          }
          label={
            <Typography variant="body2" fontWeight={500}>
                {t("this_service_have_a_specific_duration")}
            </Typography>
          }
        />
      </Box>

      {hasServiceDuration && (
        <>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                {english.days}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={days}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val === "" || parseInt(val) <= 365) {
                    onDaysChange(val || "0");
                  }
                }}
                placeholder="00"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                {english.hours}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={hours}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val === "" || parseInt(val) <= 24) {
                    onHoursChange(val || "0");
                  }
                }}
                placeholder="00"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                {english.minutes}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={minutes}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val === "" || parseInt(val) <= 60) {
                    onMinutesChange(val || "0");
                  }
                }}
                placeholder="00"
              />
            </Box>
          </Box>

          {/* Slots Option */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={haveSlots}
                  onChange={(e) => onHaveSlotsChange(e.target.checked)}
                  sx={{
                    color: COLORS.PRIMARY_PURPLE,
                    "&.Mui-checked": {
                      color: COLORS.PRIMARY_PURPLE,
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  {english.enable_time_slots}
                </Typography>
              }
            />
          </Box>
        </>
      )}
    </>
  );
};

export default ServiceDuration;
function useTranslation(): { t: any; } {
    throw new Error("Function not implemented.");
}

