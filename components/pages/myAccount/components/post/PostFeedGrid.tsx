"use client";

import React, { useRef, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Skeleton,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import { useTheme } from "@mui/material";
import { Posts } from "@/services/post/postInterfaces";
import { Favorite, ChatBubble } from "@mui/icons-material";
import Image from "next/image";

interface PostFeedGridProps {
  posts: Posts[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onPostClick: (post: Posts, index: number) => void;
}

const PostFeedGrid: React.FC<PostFeedGridProps> = ({
  posts,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onPostClick,
}) => {
  const { t } = useTranslate();
  const theme = useTheme();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current?.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  );

  const isDark = theme.palette.mode === "dark";

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 3,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Grid container spacing={1}>
          {[...Array(9)].map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Skeleton
                variant="rectangular"
                sx={{
                  width: "100%",
                  paddingTop: "100%",
                  borderRadius: 2,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!posts.length) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          p: 3,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Image
          src={isDark ? "/icons/darkThemeChat.svg" : "/icons/chat.svg"}
          alt="No posts"
          width={80}
          height={80}
          style={{ opacity: 0.5, marginBottom: 16 }}
        />
        <Typography
          variant="h6"
          sx={{
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
            fontWeight: 600,
            mb: 1,
          }}
        >
          {t("noPosts")}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            textAlign: "center",
          }}
        >
          {t("noPostsDescription")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1, md: 3 },
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <Grid container spacing={1}>
        {posts.map((post, index) => {
          const isLastPost = index === posts.length - 1;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
              <Box
                ref={isLastPost ? lastPostElementRef : null}
                onClick={() => onPostClick(post, index)}
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: isDark
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.BACKGROUND.SECONDARY_LIGHT,
                  "&:hover .overlay": {
                    opacity: 1,
                  },
                }}
              >
                {/* Post Image */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${post.media_urls})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                {/* Hover Overlay */}
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 3,
                    opacity: 0,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: COLORS.WHITE,
                    }}
                  >
                    <Favorite sx={{ fontSize: 24 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {post.likes_count}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: COLORS.WHITE,
                    }}
                  >
                    <ChatBubble sx={{ fontSize: 24 }} />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {post.comments_count}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <LogoLoader
            size={32}
          />
        </Box>
      )}
    </Box>
  );
};

export default PostFeedGrid;
