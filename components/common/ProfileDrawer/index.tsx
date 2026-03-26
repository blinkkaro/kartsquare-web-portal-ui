import { RootState } from "@/store/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDrawer } from "@/features/ui/profileDrawerSlice";
import {
  useProviderProfile,
  useProviderPosts,
  useProviderReels,
  useSupplierProfile,
} from "@/hooks/useProviderProfile";
import ProfileCard from "./components/ProfileCard";
import ProfileTabs from "./components/ProfileTabs";
import ProfilePosts from "./components/ProfilePosts";
import ProfileServices from "./components/ProfileServices";
import { Box, Typography, useTheme } from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { COLORS } from "@/constants/colors";
import ProfileDrawerWrapper from "./components/ProfileDrawerWrapper";
import { useTranslate } from "@/hooks/useTranslate";
import { AppUserType } from "@/services/auth/auth.interface";
import ProfileProducts from "./components/ProfileProducts";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import axios from "axios";
import toast from "react-hot-toast";
import ReelFeedGrid from "../../pages/myAccount/components/post/ReelFeedGrid";
import ReelViewModal from "../../pages/myAccount/components/post/ReelViewModal";
import { Posts } from "@/services/post/postInterfaces";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function ProfileDrawer() {
  const dispatch = useDispatch();
  const { isOpen, userId, role, username } = useSelector(
    (state: RootState) => state.profileDrawer,
  );
  const { t } = useTranslate();
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);

  console.log(userId, "userId");
  console.log(role, "role");

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
    data: reelsData,
    isLoading: reelsLoading,
    fetchNextPage: fetchNextReels,
    hasNextPage: hasNextReels,
    isFetchingNextPage: isFetchingNextReels,
  } = useProviderReels(!isSupplier ? userId : "");

  const {
    data: supplierProfileData,
    isLoading: supplierLoading,
    error: supplierError,
  } = useSupplierProfile(isSupplier ? username || "" : "");

  const profile = isSupplier ? supplierProfileData?.profile : providerProfile;
  const isLoading = isSupplier ? supplierLoading : providerLoading;
  const error = isSupplier ? supplierError : providerError;

  const [activeTab, setActiveTab] = useState(isSupplier ? "Products" : "Posts");
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [selectedReelIndex, setSelectedReelIndex] = useState(0);

  const allPosts = postsData?.pages.flatMap((page) => page.posts) || [];
  const allReels = reelsData?.pages.flatMap((page) => page.posts) || [];
  const allProducts = supplierProfileData?.products || [];

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(isSupplier ? "Products" : "Posts");
    }
  }, [isOpen, isSupplier]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleChatClick = async () => {
    if (!token) {
      toast.error("Please login to start a chat.");
      return;
    }

    // Attempt to get the target person ID
    const targetUserId = isSupplier
      ? (profile as any)?.user_id || profile?.id
      : userId;

    if (!targetUserId) {
      toast.error("User ID not found for chatting.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/chat/conversations`,
        {
          participant2_id: targetUserId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.status === "success") {
        dispatch(closeDrawer());
        router.push(`/chat?conversationId=${res.data.data.id}`);
      }
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
      onChatClick={handleChatClick}
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
