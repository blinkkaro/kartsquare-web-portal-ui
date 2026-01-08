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
    }))
  );
  const [is24By7, setIs24By7] = useState(false);
  const [isSameTime, setIsSameTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        }))
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
        }))
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
    value: string
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
    try {
      await workingHoursService.addBulkWorkingHours(schedule);
    } catch (err: any) {
      setError(err.message || "Failed to save schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <BackButton />
      </Box>

      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: COLORS.TEXT_DARK, mb: 1 }}
      >
        Set Your Schedule
      </Typography>
      <Typography variant="body1" sx={{ color: COLORS.TEXT_GRAY, mb: 4 }}>
        Define your availability for customers.
      </Typography>

      <ErrorMessage isVisible={!!error} error={error} />

      {/* Global Settings */}
      <Box
        sx={{
          bgcolor: COLORS.WHITE,
          borderRadius: 2,
          p: 2,
          mb: 2,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
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
            <Typography
              variant="body1"
              fontWeight={600}
              color={COLORS.TEXT_DARK}
            >
              Available 24/7
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
            <Typography
              variant="body1"
              fontWeight={600}
              color={COLORS.TEXT_DARK}
            >
              Same time for all days
            </Typography>
            <IOSSwitch checked={isSameTime} onChange={handleToggleSameTime} />
          </Box>
        </Stack>
      </Box>

      {/* Days List */}
      <Box
        sx={{
          bgcolor: COLORS.WHITE,
          borderRadius: 2,
          px: 2,
          pt: 1,
          pb: 1,
          mb: 10,
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
        Save and Continue
      </Button>
    </AuthWrapper>
  );
};

export default ScheduleView;
