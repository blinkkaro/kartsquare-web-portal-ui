"use client";

import { useTranslate } from "@/hooks/useTranslate";
import React, { useState } from "react";
import {
  useTheme,
  Fab,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { Add, ArrowBack, GridOn, MovieFilter } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import RightDrawer from "@/components/common/RightDrawer";
import { Posts } from "@/services/post/postInterfaces";
import { usePosts, useReels } from "@/hooks/useProfile";
import PostFeedGrid from "./PostFeedGrid";
import PostFeedList from "./PostFeedList";
import AddPostDrawer from "./AddPostDrawer";
import { Tabs, Tab } from "@mui/material";
import ReelFeedGrid from "./ReelFeedGrid";
import ReelViewModal from "./ReelViewModal";

export default function PostModel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslate();
  const theme = useTheme();
  const [isAddPostDrawerOpen, setIsAddPostDrawerOpen] = useState(false);
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);
  const [selectedReelIndex, setSelectedReelIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const {
    data: postData,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
    isLoading: isPostsLoading,
  } = usePosts(activeTab === 0);

  const {
    data: reelData,
    fetchNextPage: fetchNextReels,
    hasNextPage: hasNextReels,
    isFetchingNextPage: isFetchingNextReels,
    isLoading: isReelsLoading,
  } = useReels(activeTab === 1);

  const allPosts = postData?.pages.flatMap((page) => page.posts) || [];
  const allReels = reelData?.pages.flatMap((page) => page.posts) || [];

  const handlePostClick = (post: Posts, index: number) => {
    setSelectedPostIndex(index);
    setViewMode("list");
  };

  const handleReelClick = (reel: Posts, index: number) => {
    setSelectedReelIndex(index);
    setIsReelModalOpen(true);
  };

  const handleBackToGrid = () => {
    setViewMode("grid");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setViewMode("grid");
  };

  const handleCloseAddPostDrawer = () => {
    setIsAddPostDrawerOpen(false);
  };

  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "400px",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {/* Back Button for List View */}
      {viewMode === "list" && (
        <Box
          sx={{
            p: 2,
            pb: 0,
            display: "flex",
            alignItems: "center",
            gap: 1,
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <IconButton onClick={handleBackToGrid} size="small">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
            {activeTab === 0 ? t("myPosts") : (t as any)("myReels")}
          </Typography>
        </Box>
      )}

      {/* Tabs UI */}
      {viewMode === "grid" && (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              "& .MuiTab-root": {
                minHeight: 48,
                color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                "&.Mui-selected": {
                  color: COLORS.PRIMARY_PURPLE,
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: COLORS.PRIMARY_PURPLE,
              },
            }}
          >
            <Tab icon={<GridOn />} iconPosition="start" label={t("posts")} />
            <Tab
              icon={<MovieFilter />}
              iconPosition="start"
              label={(t as any)("reels")}
            />
          </Tabs>
        </Box>
      )}

      {/* Content */}
      {viewMode === "grid" ? (
        activeTab === 0 ? (
          <PostFeedGrid
            posts={allPosts}
            isLoading={isPostsLoading}
            fetchNextPage={fetchNextPosts}
            hasNextPage={hasNextPosts}
            isFetchingNextPage={isFetchingNextPosts}
            onPostClick={handlePostClick}
          />
        ) : (
          <ReelFeedGrid
            reels={allReels}
            isLoading={isReelsLoading}
            fetchNextPage={fetchNextReels}
            hasNextPage={hasNextReels}
            isFetchingNextPage={isFetchingNextReels}
            onReelClick={handleReelClick}
          />
        )
      ) : (
        <PostFeedList
          posts={activeTab === 0 ? allPosts : allReels}
          initialIndex={selectedPostIndex}
          fetchNextPage={activeTab === 0 ? fetchNextPosts : fetchNextReels}
          hasNextPage={activeTab === 0 ? hasNextPosts : hasNextReels}
          isFetchingNextPage={
            activeTab === 0 ? isFetchingNextPosts : isFetchingNextReels
          }
        />
      )}

      {/* Reel View Modal */}
      <ReelViewModal
        open={isReelModalOpen}
        onClose={() => setIsReelModalOpen(false)}
        reels={allReels}
        initialIndex={selectedReelIndex}
      />

      {/* Floating Action Button - Only show in Grid or if desired in both */}
      {viewMode === "grid" && (
        <Fab
          color="primary"
          aria-label="add post"
          onClick={() => setIsAddPostDrawerOpen(true)}
          sx={{
            position: "fixed",
            bottom: { xs: 80, md: 32 },
            right: { xs: 16, md: 32 },
            backgroundColor: COLORS.PRIMARY_PURPLE,
            color: COLORS.WHITE,
            "&:hover": {
              backgroundColor: COLORS.PURPLE_HOVER,
            },
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      )}

      {/* Add Post Drawer */}
      <RightDrawer
        open={isAddPostDrawerOpen}
        onClose={handleCloseAddPostDrawer}
        title={t("addPost")}
        width={600}
      >
        <AddPostDrawer onClose={handleCloseAddPostDrawer} />
      </RightDrawer>
    </Box>
  );
}
