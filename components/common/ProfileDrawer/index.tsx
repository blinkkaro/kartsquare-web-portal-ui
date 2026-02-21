import { RootState } from "@/store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "@/features/ui/profileDrawerSlice";
import {
  useProviderProfile,
  useProviderPosts,
  useSupplierProfile,
} from "@/hooks/useProviderProfile";
import ProfileCard from "./components/ProfileCard";
import ProfileTabs from "./components/ProfileTabs";
import ProfilePosts from "./components/ProfilePosts";
import ProfileServices from "./components/ProfileServices";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import ProfileDrawerWrapper from "./components/ProfileDrawerWrapper";
import { useTranslate } from "@/hooks/useTranslate";
import { AppUserType } from "@/services/auth/auth.interface";
import ProfileProducts from "./components/ProfileProducts";

function ProfileDrawer() {
  const dispatch = useDispatch();
  const { isOpen, userId, role, username } = useSelector(
    (state: RootState) => state.profileDrawer,
  );
  const { t } = useTranslate();

  const isSupplier = role === AppUserType.SUPPLIER;

  const {
    data: providerProfile,
    isLoading: providerLoading,
    error: providerError,
  } = useProviderProfile(!isSupplier ? userId : "");
  const { data: postsData, isLoading: postsLoading } = useProviderPosts(
    !isSupplier ? userId : "",
  );

  const {
    data: supplierProfileData,
    isLoading: supplierLoading,
    error: supplierError,
  } = useSupplierProfile(isSupplier ? username || "" : "");

  const profile = isSupplier ? supplierProfileData?.profile : providerProfile;
  const isLoading = isSupplier ? supplierLoading : providerLoading;
  const error = isSupplier ? supplierError : providerError;

  const [activeTab, setActiveTab] = useState(isSupplier ? "Products" : "Posts");

  const allPosts = postsData?.pages.flatMap((page) => page.posts) || [];
  const allProducts = supplierProfileData?.products || [];

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(isSupplier ? "Products" : "Posts");
    }
  }, [isOpen, isSupplier]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <ProfileDrawerWrapper
      open={isOpen}
      profile={profile || undefined}
      onClose={() => dispatch(closeDrawer())}
      // onChatClick={() => {}}
      onLocationClick={() => {}}
      onBookmarkClick={() => {}}
      width={700}
    >
      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <ProfileCard
              profile={profile}
              onClose={() => dispatch(closeDrawer())}
            />
            <ProfileTabs onTabChange={handleTabChange} role={role} />

            {/* Content Area Placeholder */}
            {/* Content Area */}
            <Box sx={{ mt: 2 }}>
              {activeTab === "Posts" && (
                <ProfilePosts posts={allPosts} isLoading={postsLoading} />
              )}
              {activeTab === "Products" && (
                <ProfileProducts
                  products={allProducts}
                  isLoading={supplierLoading}
                />
              )}
              {activeTab === "Services" && (
                <ProfileServices userId={userId || ""} />
              )}
            </Box>
          </Box>
        )}
      </Box>
    </ProfileDrawerWrapper>
  );
}

export default ProfileDrawer;
