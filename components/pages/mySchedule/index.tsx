"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  useTheme,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import Button from "@/components/common/Button";
import { useSchedule } from "@/hooks/useSchedule";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { TranslationKey } from "@/features/i18n/TranslationContext";
import { COLORS } from "@/constants/colors";
import { formatTo12Hour, convert12To24 } from "@/helper/helper";
import DayScheduleCard from "./components/DayScheduleCard";
import ErrorMessage from "@/components/common/ErrorMessage";
import SuccessModel from "@/components/common/SuccessModel";

interface DaySchedule {
  id?: string;
  startTime: string;
  endTime: string;
  hasBreak: boolean;
  breakStart: string;
  breakEnd: string;
}

const DAYS: TranslationKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DEFAULT_SCHEDULE: DaySchedule = {
  startTime: "09:00",
  endTime: "18:00",
  hasBreak: false,
  breakStart: "13:00",
  breakEnd: "14:00",
};

function MyScheduleView() {
  const theme = useTheme();
  const { t } = useTranslationContext();
  const { workingHours, isLoading, updateSlot, addSlot } = useSchedule();

  const [sameForAllDays, setSameForAllDays] = useState(true);
  const [error, setError] = useState<string | "">("");
  const [successModel, setSuccessModel] = useState<boolean>(false);

  // Initialize with default schedules for all 7 days
  const getDefaultSchedules = (): Record<number, DaySchedule> => {
    const defaults: Record<number, DaySchedule> = {};
    for (let i = 0; i < 7; i++) {
      defaults[i] = { ...DEFAULT_SCHEDULE };
    }
    return defaults;
  };

  const [schedules, setSchedules] =
    useState<Record<number, DaySchedule>>(getDefaultSchedules);
  const [isUpdating, setIsUpdating] = useState(false);
  const isInitialized = React.useRef(false);

  // Initialize schedules from working hours data
  useEffect(() => {
    if (workingHours && !isLoading && !isInitialized.current) {
      isInitialized.current = true;
      const newSchedules: Record<number, DaySchedule> = {};

      for (let i = 0; i < 7; i++) {
        const dayHours = workingHours[i];
        if (dayHours && dayHours.length > 0) {
          const mainSlot = dayHours[0];
          newSchedules[i] = {
            id: mainSlot.sp_work_hrs_id,
            startTime: mainSlot.start_time.slice(0, 5),
            endTime: mainSlot.end_time.slice(0, 5),
            hasBreak: dayHours.length > 1,
            breakStart:
              dayHours.length > 1
                ? dayHours[1]?.start_time?.slice(0, 5) || "13:00"
                : "13:00",
            breakEnd:
              dayHours.length > 1
                ? dayHours[1]?.end_time?.slice(0, 5) || "14:00"
                : "14:00",
          };
        } else {
          newSchedules[i] = { ...DEFAULT_SCHEDULE };
        }
      }

      setSchedules(newSchedules);
    }
  }, [workingHours, isLoading]);

  const handleScheduleChange = (
    dayIndex: number,
    field: keyof DaySchedule,
    value: string | boolean
  ) => {
    setSchedules((prev) => {
      if (sameForAllDays && field !== "hasBreak") {
        // Apply to all days when "same for all days" is checked
        const newSchedules: Record<number, DaySchedule> = {};
        for (let i = 0; i < 7; i++) {
          newSchedules[i] = {
            ...(prev[i] || DEFAULT_SCHEDULE),
            [field]: value,
          };
        }
        return newSchedules;
      }

      return {
        ...prev,
        [dayIndex]: {
          ...(prev[dayIndex] || DEFAULT_SCHEDULE),
          [field]: value,
        },
      };
    });
  };

  const handleBreakToggle = (dayIndex: number) => {
    setSchedules((prev) => ({
      ...prev,
      [dayIndex]: {
        ...(prev[dayIndex] || DEFAULT_SCHEDULE),
        hasBreak: !(prev[dayIndex]?.hasBreak ?? false),
      },
    }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      setError("");
      // Collect all schedules into a single array for bulk update
      const allSchedules = [];
      for (let i = 0; i < 7; i++) {
        const schedule = schedules[i];
        if (schedule) {
          allSchedules.push({
            weekday: i,
            start_time: schedule.startTime,
            end_time: schedule.endTime,
            is_active: true,
          });
        }
      }

      // Send all schedules in a single bulk update
      if (allSchedules.length > 0) {
        updateSlot(allSchedules);
      }
      setSuccessModel(true);
    } catch (error: any) {
      setError(error.response.data.message || error.message);
      console.error("Failed to update schedule:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <ProfileWrapper showBackButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </ProfileWrapper>
    );
  }

  return (
    <ProfileWrapper showBackButton>
      <Box sx={{ maxWidth: 600, mx: "auto", px: 2, pb: 4 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {t("mySchedule")}
          </Typography>

          <Button
            variant="contained"
            onClick={handleUpdate}
            isLoading={isUpdating}
            sx={{
              minWidth: 100,
            }}
          >
            {t("update")}
          </Button>
        </Box>

        {/* Same for all days checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={sameForAllDays}
              onChange={(e) => setSameForAllDays(e.target.checked)}
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={
                <CheckCircleIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />
              }
              sx={{
                "&.Mui-checked": {
                  color: COLORS.PRIMARY_PURPLE,
                },
              }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              {t("sameTimeForAllDays")}
            </Typography>
          }
          sx={{ mb: 3 }}
        />
        
        <ErrorMessage isVisible={!!error} error={error} />

        {/* Day Schedule Cards */}
        {DAYS.map((dayKey, index) => {
          const schedule = schedules[index] || DEFAULT_SCHEDULE;
          return (
            <DayScheduleCard
              key={dayKey}
              dayKey={dayKey}
              startTime={schedule.startTime}
              endTime={schedule.endTime}
              onStartTimeChange={(value) =>
                handleScheduleChange(index, "startTime", value)
              }
              onEndTimeChange={(value) =>
                handleScheduleChange(index, "endTime", value)
              }
              hasBreak={schedule.hasBreak}
              breakStart={schedule.breakStart}
              breakEnd={schedule.breakEnd}
              onBreakStartChange={(value) =>
                handleScheduleChange(index, "breakStart", value)
              }
              onBreakEndChange={(value) =>
                handleScheduleChange(index, "breakEnd", value)
              }
              onBreakToggle={() => handleBreakToggle(index)}
            />
          );
        })}

      </Box>
        <SuccessModel
          open={successModel}
          onClose={() => setSuccessModel(false)}
          title={t("scheduleUpdatedSuccessfully")}
          actionLabel={t("ok")}
          onAction={() => setSuccessModel(false)}
        />
    </ProfileWrapper>
  );
}

export default MyScheduleView;
