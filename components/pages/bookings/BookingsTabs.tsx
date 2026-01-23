import React from "react";
import { Box, Tabs, Tab, useTheme } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";

interface BookingsTabsProps {
    activeTab: number;
    onTabChange: (newValue: number) => void;
}

const BookingsTabs: React.FC<BookingsTabsProps> = ({ activeTab, onTabChange }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const tabs = [
        english.upcoming,
        english.in_progress,
        english.completed,
        english.cancelled
    ];

    return (
        <Box sx={{ mb: 4 }}>
            <Tabs
                value={activeTab}
                onChange={(e, newValue) => onTabChange(newValue)}
                sx={{
                    "& .MuiTabs-indicator": {
                        backgroundColor: COLORS.PRIMARY_PURPLE,
                        height: "3px",
                        borderRadius: "3px 3px 0 0"
                    },
                    "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#6B7280",
                        mr: 2,
                        "&.Mui-selected": {
                            color: isDark ? "white" : "#111827",
                        },
                    },
                }}
            >
                {tabs.map((tab) => (
                    <Tab key={tab} label={tab} disableRipple />
                ))}
            </Tabs>
            {/* Thin divider line under tabs */}
            <Box sx={{ height: "1px", bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : "#E5E7EB", mt: -0.2 }} />
        </Box>
    );
};

export default BookingsTabs;
