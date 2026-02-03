import React from "react";
import { Box, Tabs, Tab, useTheme } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";

interface BookingsTabsProps {
    activeTab: number;
    onTabChange: (newValue: number) => void;
    counts?: number[];
}

const BookingsTabs: React.FC<BookingsTabsProps> = ({ activeTab, onTabChange, counts }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const tabs = [
        english.pending,
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
                        minWidth: 'auto',
                        px: 1,
                        "&.Mui-selected": {
                            color: isDark ? "white" : "#111827",
                        },
                    },
                }}
            >
                {tabs.map((tab, index) => (
                    <Tab
                        key={tab}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {tab}
                                {counts && counts[index] !== undefined && (
                                    <Box
                                        sx={{
                                            bgcolor: activeTab === index
                                                ? COLORS.PRIMARY_PURPLE
                                                : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                                            color: activeTab === index ? 'white' : 'inherit',
                                            borderRadius: '6px',
                                            px: 0.8,
                                            py: 0.2,
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            minWidth: '20px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {counts[index]}
                                    </Box>
                                )}
                            </Box>
                        }
                        disableRipple
                    />
                ))}
            </Tabs>
            {/* Thin divider line under tabs */}
            <Box sx={{ height: "1px", bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : "#E5E7EB", mt: -0.2 }} />
        </Box>
    );
};

export default BookingsTabs;
