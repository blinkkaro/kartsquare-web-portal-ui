import React from "react";
import { Box, Tabs, Tab, useTheme } from "@mui/material";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";

interface BookingsTabsProps {
  activeTab: number;
  onTabChange: (newValue: number) => void;
  counts?: number[];
}

const BookingsTabs: React.FC<BookingsTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const tabs = [
    english.pending,
    english.upcoming,
    english.in_progress,
    english.completed,
    english.cancelled,
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => onTabChange(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          minHeight: "48px",
          "& .MuiTabs-indicator": {
            backgroundColor: COLORS.PRIMARY_PURPLE,
            height: "3px",
            borderRadius: "3px 3px 0 0",
          },
          "& .MuiTabs-flexContainer": {
            gap: { xs: 1, sm: 2 },
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 700,
            fontSize: { xs: "0.875rem", sm: "0.95rem" },
            color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#64748B",
            minWidth: "max-content",
            px: { xs: 1.5, sm: 2.5 },
            py: 1.5,
            transition: "all 0.2s ease",
            borderRadius: "12px 12px 0 0",
            "&:hover": {
              color: COLORS.PRIMARY_PURPLE,
              bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
            },
            "&.Mui-selected": {
              color: COLORS.PRIMARY_PURPLE,
            },
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={tab}
            label={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  whiteSpace: "nowrap",
                }}
              >
                {tab}
                {counts && counts[index] !== undefined && (
                  <Box
                    sx={{
                      bgcolor:
                        activeTab === index
                          ? `${COLORS.PRIMARY_PURPLE}20`
                          : isDark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.05)",
                      color: activeTab === index ? COLORS.PRIMARY_PURPLE : "inherit",
                      borderRadius: "6px",
                      px: 0.8,
                      py: 0.2,
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      minWidth: "22px",
                      border: activeTab === index ? `1px solid ${COLORS.PRIMARY_PURPLE}40` : "none",
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
      <Box
        sx={{
          height: "1px",
          bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : "#E5E7EB",
          mt: -0.2,
        }}
      />
    </Box>
  );
};

export default BookingsTabs;
