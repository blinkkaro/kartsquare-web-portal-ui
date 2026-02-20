import React from "react";
import { Box, Tabs, Tab, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface OrderTabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onTabChange(newValue)}
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 700,
            fontSize: "16px",
            minWidth: "120px",
            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
            "&.Mui-selected": {
              color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
            height: "3px",
            borderRadius: "3px 3px 0 0",
          },
        }}
      >
        <Tab label={t("pending")} />
        <Tab label={t("completed")} />
      </Tabs>
    </Box>
  );
};

export default OrderTabs;
