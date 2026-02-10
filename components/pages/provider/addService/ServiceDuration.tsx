"use client";
import React from "react";
import { Box, Typography, TextField, Checkbox, FormControlLabel } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { english } from "@/features/i18n/en";

interface ServiceDurationProps {
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
    days,
    onDaysChange,
    hours,
    onHoursChange,
    minutes,
    onMinutesChange,
    haveSlots,
    onHaveSlotsChange,
}: ServiceDurationProps) => {
    return (
        <>
            {/* <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {english.service_duration}
            </Typography> */}
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
                            const val = e.target.value.replace(/\D/g, '');
                            if (val === '' || parseInt(val) <= 365) {
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
                            const val = e.target.value.replace(/\D/g, '');
                            if (val === '' || parseInt(val) <= 24) {
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
                            const val = e.target.value.replace(/\D/g, '');
                            if (val === '' || parseInt(val) <= 60) {
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
    );
};

export default ServiceDuration;
