import { RootState } from "@/store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "@/features/ui/profileDrawerSlice";
import { useProviderProfile } from "@/hooks/useProviderProfile";
import ProfileCard from "./components/ProfileCard";
import ProfileTabs from "./components/ProfileTabs";
import ProfilePosts from "./components/ProfilePosts";
import ProfileServices from "./components/ProfileServices";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import ProfileDrawerWrapper from "./components/ProfileDrawerWrapper";
import { useTranslate } from "@/hooks/useTranslate";

function ProfileDrawer() {
  const dispatch = useDispatch();
  const { isOpen, userId } = useSelector(
    (state: RootState) => state.profileDrawer,
  );
  const { t } = useTranslate();

  // Always call the hook, but handle the enabled state or null userId gracefully
  // The hook implementation `enabled: !!userId` handles the skipping query.
  const { data: profile, isLoading, error } = useProviderProfile(userId || "");
  const [activeTab, setActiveTab] = useState("Posts");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Logic to switch content below can be added here
  };

  return (
    <ProfileDrawerWrapper
      open={isOpen}
      onClose={() => dispatch(closeDrawer())}
      onChatClick={() => {}}
      onLocationClick={() => {}}
      onBookmarkClick={() => {}}
      width={700}
    >
      <Box sx={{height: "100%", overflowY: "auto" }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress sx={{ color: COLORS.PRIMARY_PURPLE }} />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography color="error">{t("failedToLoadProfile")}</Typography>
          </Box>
        )}

        {profile && (
          <>
            <ProfileCard profile={profile} />
            <ProfileTabs onTabChange={handleTabChange} />

            {/* Content Area Placeholder */}
            {/* Content Area */}
            <Box sx={{ mt: 2 }}>
              {activeTab === "Posts" && <ProfilePosts userId={userId || ""} />}
              {activeTab === "Services" && (
                <ProfileServices userId={userId || ""} />
              )}
            </Box>
          </>
        )}
      </Box>
    </ProfileDrawerWrapper>
  );
}

export default ProfileDrawer;
