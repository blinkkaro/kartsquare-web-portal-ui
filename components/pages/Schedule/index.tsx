"use client";
import React, { useState } from "react";
import { Box, Typography, Container, Stack, styled } from "@mui/material";
import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import ErrorMessage from "@/components/common/ErrorMessage";
import { workingHoursService } from "@/services/auth/schedule.service";
import { IWorkingHour } from "@/services/auth/auth.interface";
import { COLORS } from "@/constants/colors";
import DayRow from "./components/DayRow";
import { IOSSwitch } from "./components/IOSSwitch";
import AuthWrapper from "@/components/auth/authWrapper";
import { useRouter } from "next/navigation";
import { handleRegistrationStepNavigation } from "@/helper/registrationNavigation";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { useAppDispatch } from "@/store/hooks";
import { useTranslate } from "@/hooks/useTranslate";
import Title from "@/components/auth/title";
import { secureStorage } from "@/helper/SecureStorage";
import { logout } from "@/features/ui/authSlice";

const DAYS = [
  { name: "Sunday", value: 0 },
  { name: "Monday", value: 1 },
  { name: "Tuesday", value: 2 },
  { name: "Wednesday", value: 3 },
  { name: "Thursday", value: 4 },
  { name: "Friday", value: 5 },
  { name: "Saturday", value: 6 },
];

const ScheduleView = () => {
  const [schedule, setSchedule] = useState<IWorkingHour[]>(
    DAYS.map((day) => ({
      weekday: day.value,
      start_time: "09:00",
      end_time: "17:00",
      is_active: false,
    })),
  );
  const [is24By7, setIs24By7] = useState(false);
  const [isSameTime, setIsSameTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslate();

  const handleToggle24By7 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIs24By7(checked);
    if (checked) {
      setIsSameTime(false);
      setSchedule((prev) =>
        prev.map((item) => ({
          ...item,
          is_active: true,
          start_time: "00:00",
          end_time: "23:59",
        })),
      );
    }
  };

  const handleToggleSameTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsSameTime(checked);
    if (checked) {
      setIs24By7(false);
      const source = schedule[0];
      setSchedule((prev) =>
        prev.map((item) => ({
          ...item,
          start_time: source.start_time,
          end_time: source.end_time,
          is_active: true,
        })),
      );
    }
  };

  const handleDayToggle = (index: number) => {
    if (is24By7) return; // Locked
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[index] = {
        ...newSchedule[index],
        is_active: !newSchedule[index].is_active,
      };

      if (isSameTime && newSchedule[index].is_active) {
        const commonTime = prev.find((p) => p.is_active) || prev[0];
        newSchedule[index].start_time = commonTime.start_time;
        newSchedule[index].end_time = commonTime.end_time;
      }
      return newSchedule;
    });
  };

  const handleTimeChange = (
    index: number,
    field: "start_time" | "end_time",
    value: string,
  ) => {
    if (is24By7) return;

    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[index] = { ...newSchedule[index], [field]: value };

      if (isSameTime) {
        // Propagate to all
        return newSchedule.map((item) => ({
          ...item,
          [field]: value,
        }));
      }
      return newSchedule;
    });
  };

  const onSave = async () => {
    setLoading(true);
    setError("");

    // Validation: End time must be after start time for all active days
    const invalidDays: string[] = [];
    schedule.forEach((item, index) => {
      if (item.is_active) {
        const start = item.start_time.split(":").map(Number);
        const end = item.end_time.split(":").map(Number);
        const startMinutes = start[0] * 60 + start[1];
        const endMinutes = end[0] * 60 + end[1];

        if (endMinutes <= startMinutes) {
          invalidDays.push(DAYS[index].name);
        }
      }
    });

    if (invalidDays.length > 0) {
      setError(`End time must be after start time for: ${invalidDays.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      await workingHoursService.addBulkWorkingHours(schedule);
      handleRegistrationStepNavigation(
        dispatch,
        router,
        UserRegisterSteps.SCHEDULE_ADDED,
      );
    } catch (err: any) {
      setError(err.message || "Failed to save schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // const role = secureStorage.getItem("role");
    secureStorage.removeItem("token");
    secureStorage.removeItem("refreshToken");
    secureStorage.removeItem("register_step");
    secureStorage.removeItem("role");
    secureStorage.removeItem("user_details");


    dispatch(logout());
    router.push(`/business-listing`);
  };

  return (
    <AuthWrapper>
      {/* Header & Title Inline */}
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, mb: 0.5 }}>
        <BackButton onClick={() => handleBack()} />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: {
              xs: "1.75rem",
              sm: "2rem",
              md: "2.25rem",
              lg: "2.5rem",
              xl: "3.5rem",
            },
            lineHeight: 1.2,
          }}
        >
          {t("setYourSchedule")}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: { xs: 2, md: 4 },
          ml: { xs: 5.5, sm: 6.5 }, // Visual offset to align perfectly under the title text
          fontSize: { xs: "0.8rem", lg: "0.875rem", xl: "1.1rem" },
        }}
      >
        {t("defineYourAvailability")}
      </Typography>

      <ErrorMessage isVisible={!!error} error={error} />

      {/* Global Settings */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 2,
          mb: 2,
          boxShadow: COLORS.SHADOW.LIGHT,
        }}
      >
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" fontWeight={600} color="text.primary">
              {t("available24By7")}
            </Typography>
            <IOSSwitch checked={is24By7} onChange={handleToggle24By7} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" fontWeight={600} color="text.primary">
              {t("sameTimeForAllDays")}
            </Typography>
            <IOSSwitch checked={isSameTime} onChange={handleToggleSameTime} />
          </Box>
        </Stack>
      </Box>

      {/* Days List */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          px: { xs: 1.5, md: 2 },
          pt: 1,
          pb: 1,
          mb: { xs: 12, md: 10 },
          boxShadow: "0px 4px 20px " + COLORS.SHADOW.DEFAULT,
        }}
      >
        {DAYS.map((day, index) => (
          <DayRow
            key={day.value}
            day={day.name}
            isActive={schedule[index].is_active}
            startTime={schedule[index].start_time}
            endTime={schedule[index].end_time}
            onToggle={() => handleDayToggle(index)}
            onStartTimeChange={(val) =>
              handleTimeChange(index, "start_time", val)
            }
            onEndTimeChange={(val) => handleTimeChange(index, "end_time", val)}
            disabled={is24By7}
          />
        ))}
      </Box>

      {/* Footer Button */}
      <Button fullWidth onClick={onSave} isLoading={loading}>
        {t("saveAndContinue")}
      </Button>
    </AuthWrapper>
  );
};

export default ScheduleView;
