import React, { useState } from "react";
import { Box, Tabs, Tab, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface ProfileTabsProps {
  onTabChange: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ onTabChange }) => {
  const [value, setValue] = useState(0);
  const { t } = useTranslate();
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const tabs = ["Posts", "Services", "Stores"];
    onTabChange(tabs[newValue]);
  };

  return (
    <Box
      sx={{
        width: "100%",
        pt: 2,
        p: 2,
        pb: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            color: theme.palette.text.secondary,
            fontSize: "1rem",
            "&.Mui-selected": {
              color: theme.palette.primary.main,
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main,
            height: "3px",
            borderRadius: "3px 3px 0 0",
          },
        }}
      >
        <Tab label={t("posts")} />
        <Tab label={t("services")} />
        {/* <Tab label="Stores" /> */}
      </Tabs>
    </Box>
  );
};

export default ProfileTabs;
