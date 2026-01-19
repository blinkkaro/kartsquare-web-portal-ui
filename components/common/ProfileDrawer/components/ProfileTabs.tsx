import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { COLORS } from "@/constants/colors";

interface ProfileTabsProps {
  onTabChange: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ onTabChange }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const tabs = ["Posts", "Services", "Stores"];
    onTabChange(tabs[newValue]);
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
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
            color: COLORS.TEXT.SECONDARY_LIGHT,
            fontSize: "1rem",
            "&.Mui-selected": {
              color: COLORS.PRIMARY_PURPLE,
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: COLORS.PRIMARY_PURPLE,
            height: "3px",
            borderRadius: "3px 3px 0 0",
          },
        }}
      >
        <Tab label="Posts" />
        <Tab label="Services" />
        <Tab label="Stores" />
      </Tabs>
    </Box>
  );
};

export default ProfileTabs;
