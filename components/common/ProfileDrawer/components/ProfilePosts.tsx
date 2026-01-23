import React, { useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import {
  useTheme,
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { Posts } from "@/services/post/postInterfaces";
import { useProviderPosts } from "@/hooks/useProviderProfile";
import PostFeedGrid from "@/components/pages/myAccount/components/post/PostFeedGrid";
import PostFeedList from "@/components/pages/myAccount/components/post/PostFeedList";

interface ProfilePostsProps {
  userId: string;
}

export default function ProfilePosts({ userId }: ProfilePostsProps) {
  const { t } = useTranslate();
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPostIndex, setSelectedPostIndex] = useState(0);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useProviderPosts(userId);

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

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
        <CircularProgress sx={{ color: COLORS.PRIMARY_PURPLE }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">
          {t("failedToLoadPosts")}
        </Typography>
      </Box>
    );
  }

  if (!isLoading && allPosts.length === 0) {
    return (
      <Box
        sx={{ textAlign: "center", mt: 4, color: COLORS.TEXT.SECONDARY_LIGHT }}
      >
        <Typography>{t("noPostsFound")}</Typography>
      </Box>
    );
  }

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
    </Box>
  );
}
