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
import { Add, ArrowBack } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import RightDrawer from "@/components/common/RightDrawer";
import { Posts } from "@/services/post/postInterfaces";
import { usePosts } from "@/hooks/useProfile";
import PostFeedGrid from "./PostFeedGrid";
import PostFeedList from "./PostFeedList";
import AddPostDrawer from "./AddPostDrawer";

export default function PostModel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslate();
  const theme = useTheme();
  const [isAddPostDrawerOpen, setIsAddPostDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts(true);
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  const handlePostClick = (post: Posts, index: number) => {
    setSelectedPostIndex(index);
    setViewMode("list");
  };

  const handleBackToGrid = () => {
    setViewMode("grid");
  };

  const handleCloseAddPostDrawer = () => {
    setIsAddPostDrawerOpen(false);
  };

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
            {t("myPosts") || "My Posts"}
          </Typography>
        </Box>
      )}

      {/* Content */}
      {viewMode === "grid" ? (
        <PostFeedGrid
          posts={allPosts}
          isLoading={isLoading}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onPostClick={handlePostClick}
        />
      ) : (
        <PostFeedList
          posts={allPosts}
          initialIndex={selectedPostIndex}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}

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
