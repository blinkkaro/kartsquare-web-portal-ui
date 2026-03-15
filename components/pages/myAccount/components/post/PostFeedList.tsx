"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { Posts } from "@/services/post/postInterfaces";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import PostCard from "@/components/pages/home/components/PostCard";

interface PostFeedListProps {
  posts: Posts[];
  initialIndex: number;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const PostFeedList: React.FC<PostFeedListProps> = ({
  posts,
  initialIndex,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const { t } = useTranslate();
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Infinite scroll observer
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

  // Scroll to initial index on mount
  useEffect(() => {
    if (initialIndex >= 0 && itemRefs.current[initialIndex]) {
      itemRefs.current[initialIndex]?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  }, [initialIndex]);

  return (
    <Box
      ref={listRef}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {posts.map((post, index) => {
        const isLastPost = index === posts.length - 1;
        return (
          <Box
            key={post.id}
            ref={(el: HTMLDivElement | null) => {
              itemRefs.current[index] = el;
              if (isLastPost && el) {
                lastPostElementRef(el);
              }
            }}
          >
            <PostCard post={post} />
          </Box>
        );
      })}

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
            mb: 3,
          }}
        >
          <LogoLoader
            size={32}
          />
        </Box>
      )}

      {/* End of List Message
      {!hasNextPage && posts.length > 0 && (
        <Typography
          variant="body2"
          sx={{ textAlign: "center", mt: 2, mb: 2, color: "text.secondary" }}
        >
          {t("noPosts") || "No more posts"}
        </Typography>
      )} */}
    </Box>
  );
};

export default PostFeedList;
