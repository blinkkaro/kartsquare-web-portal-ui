import React, { useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import {
  useTheme,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { ArrowBack } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { Posts } from "@/services/post/postInterfaces";
import PostFeedGrid from "@/components/pages/myAccount/components/post/PostFeedGrid";
import PostFeedList from "@/components/pages/myAccount/components/post/PostFeedList";

interface ProfilePostsProps {
  posts: Posts[];
  isLoading?: boolean;
}

export default function ProfilePosts({
  posts,
  isLoading = false,
}: ProfilePostsProps) {
  const { t } = useTranslate();
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);

  const handlePostClick = (post: Posts, index: number) => {
    setSelectedPostIndex(index);
    setViewMode("list");
  };

  const handleBackToGrid = () => {
    setViewMode("grid");
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <LogoLoader />
      </Box>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <Box
        sx={{ textAlign: "center", mt: 4, color: COLORS.TEXT.SECONDARY_LIGHT }}
      >
        <Typography>{t("noPostsFound")}</Typography>
      </Box>
    );
  }

  // Dummy pagination functions since posts are already loaded from parent
  const fetchNextPage = () => {};
  const hasNextPage = false;
  const isFetchingNextPage = false;

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
      {/* Content */}
      {viewMode === "grid" ? (
        <PostFeedGrid
          posts={posts}
          isLoading={isLoading}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onPostClick={handlePostClick}
        />
      ) : (
        <PostFeedList
          posts={posts}
          initialIndex={selectedPostIndex}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </Box>
  );
}
