import { RootState } from "@/store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RightDrawer from "../RightDrawer";
import { closeDrawer } from "@/features/ui/profileDrawerSlice";
import { useProviderProfile } from "@/hooks/useProviderProfile";
import ProfileCard from "./components/ProfileCard";
import ProfileTabs from "./components/ProfileTabs";
import { Box, CircularProgress, Typography } from "@mui/material";
import { COLORS } from "@/constants/colors";

function ProfileDrawer() {
  const dispatch = useDispatch();
  const { isOpen, userId } = useSelector(
    (state: RootState) => state.profileDrawer,
  );

  // Always call the hook, but handle the enabled state or null userId gracefully
  // The hook implementation `enabled: !!userId` handles the skipping query.
  const { data: profile, isLoading, error } = useProviderProfile(userId || "");
  const [activeTab, setActiveTab] = useState("Posts");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Logic to switch content below can be added here
  };

  return (
    <RightDrawer
      open={isOpen}
      onClose={() => dispatch(closeDrawer())}
      title="Profile"
    >
      <Box sx={{ p: 2, height: "100%", overflowY: "auto" }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: COLORS.PRIMARY_PURPLE }} />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography color="error">Failed to load profile.</Typography>
          </Box>
        )}

        {profile && (
          <>
            <ProfileCard profile={profile} />
            <ProfileTabs onTabChange={handleTabChange} />

            {/* Content Area Placeholder */}
            <Box
              sx={{
                mt: 3,
                textAlign: "center",
                color: COLORS.TEXT.SECONDARY_LIGHT,
              }}
            >
              <Typography>{activeTab} Content Coming Soon</Typography>
            </Box>
          </>
        )}
      </Box>
    </RightDrawer>
  );
}

export default ProfileDrawer;
