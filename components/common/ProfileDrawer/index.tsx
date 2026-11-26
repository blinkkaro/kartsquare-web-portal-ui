"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { CHAT_ENABLED } from "@/lib/featureFlags";
import { type RootState } from "@/store/store";
import { closeDrawer } from "@/features/ui/profileDrawerSlice";
import {
  useProviderProfile,
  useProviderPosts,
  useProviderReels,
  useSupplierProfile,
} from "@/hooks/useProviderProfile";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { useTranslate } from "@/hooks/useTranslate";
import { AppUserType } from "@/services/auth/auth.interface";
import { useAppSelector } from "@/store/hooks";
import { type Posts } from "@/services/post/postInterfaces";
import { startConversation } from "@/services/chat/chatService";
import ReelFeedGrid from "../../pages/myAccount/components/post/ReelFeedGrid";
import ProfileCard from "./components/ProfileCard";
import ProfileTabs from "./components/ProfileTabs";
import ProfilePosts from "./components/ProfilePosts";
import ProfileServices from "./components/ProfileServices";
import ProfileDrawerWrapper from "./components/ProfileDrawerWrapper";
import ProfileProducts from "./components/ProfileProducts";

// Opened on demand: loaded after the page instead of in its first bundle.
const ReelViewModal = dynamic(() => import("../../pages/myAccount/components/post/ReelViewModal"), {
  ssr: false,
});

export function ProfileDrawer() {
  const dispatch = useDispatch();
  const { isOpen, userId, role, username } = useSelector((state: RootState) => state.profileDrawer);
  const { t } = useTranslate();
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);

  const isSupplier = role === AppUserType.SUPPLIER;

  const {
    data: providerProfile,
    isLoading: providerLoading,
    error: providerError,
  } = useProviderProfile(!isSupplier ? userId : "");
  const {
    data: supplierProfileData,
    isLoading: supplierLoading,
    error: supplierError,
  } = useSupplierProfile(isSupplier ? username || "" : "");

  const profile = isSupplier ? supplierProfileData?.profile : providerProfile;
  // A supplier's posts and chats belong to their user account, not the store profile id.
  const supplierUserId = supplierProfileData?.profile?.user_id;
  const isLoading = isSupplier ? supplierLoading : providerLoading;
  const error = isSupplier ? supplierError : providerError;

  const effectiveUserId = isSupplier ? supplierUserId || profile?.id || userId : userId;

  const { data: postsData, isLoading: postsLoading } = useProviderPosts(effectiveUserId);
  const {
    data: reelsData,
    isLoading: reelsLoading,
    fetchNextPage: fetchNextReels,
    hasNextPage: hasNextReels,
    isFetchingNextPage: isFetchingNextReels,
  } = useProviderReels(effectiveUserId);

  const [activeTab, setActiveTab] = useState("Posts");
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [selectedReelIndex, setSelectedReelIndex] = useState(0);

  const allPosts = postsData?.pages.flatMap((page) => page.posts) || [];
  const allReels = reelsData?.pages.flatMap((page) => page.posts) || [];
  const allProducts = supplierProfileData?.products || [];

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab("Posts");
    }
  }, [isOpen]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleChatClick = async () => {
    if (!token) {
      toast.error("Please login to start a chat.");
      return;
    }

    // Attempt to get the target person ID
    const targetUserId = isSupplier ? supplierUserId || profile?.id : userId;

    if (!targetUserId) {
      toast.error("User ID not found for chatting.");
      return;
    }

    try {
      const conversationId = await startConversation(targetUserId);
      dispatch(closeDrawer());
      router.push(`/chat?conversationId=${conversationId}`);
    } catch (err) {
      console.error("Failed to initialize chat", err);
      toast.error("Could not start chat.");
    }
  };

  const handleReelClick = (reel: Posts, index: number) => {
    setSelectedReelIndex(index);
    setIsReelModalOpen(true);
  };

  return (
    <ProfileDrawerWrapper
      open={isOpen}
      profile={profile || undefined}
      onClose={() => dispatch(closeDrawer())}
      onChatClick={CHAT_ENABLED ? handleChatClick : undefined}
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
            <LogoLoader />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography color="error">{t("failedToLoadProfile")}</Typography>
          </Box>
        )}

        {profile && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <ProfileCard profile={profile} onClose={() => dispatch(closeDrawer())} />
            <ProfileTabs onTabChange={handleTabChange} role={role} />

            {/* Content Area Placeholder */}
            {/* Content Area */}
            <Box sx={{ mt: 2 }}>
              {activeTab === "Posts" && <ProfilePosts posts={allPosts} isLoading={postsLoading} />}
              {activeTab === "Products" && (
                <ProfileProducts products={allProducts} isLoading={supplierLoading} />
              )}
              {activeTab === "Services" && <ProfileServices userId={userId || ""} />}
              {activeTab === "Reels" && (
                <ReelFeedGrid
                  reels={allReels}
                  isLoading={reelsLoading}
                  fetchNextPage={fetchNextReels}
                  hasNextPage={hasNextReels ?? false}
                  isFetchingNextPage={isFetchingNextReels}
                  onReelClick={handleReelClick}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Reel View Modal */}
      <ReelViewModal
        open={isReelModalOpen}
        onClose={() => setIsReelModalOpen(false)}
        reels={allReels}
        initialIndex={selectedReelIndex}
        fetchNextPage={fetchNextReels}
        hasNextPage={hasNextReels}
        isFetchingNextPage={isFetchingNextReels}
      />
    </ProfileDrawerWrapper>
  );
}

export default ProfileDrawer;
