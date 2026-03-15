"use client";

import React, { useRef, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Skeleton,
  useTheme,
} from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import { Posts } from "@/services/post/postInterfaces";
import { PlayArrow } from "@mui/icons-material";
import Image from "next/image";

interface ReelFeedGridProps {
  reels: Posts[];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onReelClick: (reel: Posts, index: number) => void;
}

const ReelFeedGrid: React.FC<ReelFeedGridProps> = ({
  reels,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onReelClick,
}) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const observer = useRef<IntersectionObserver | null>(null);
  const lastReelElementRef = useCallback(
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

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={1}>
          {[...Array(9)].map((_, index) => (
            <Grid key={index} size={{ xs: 4 }}>
              <Skeleton
                variant="rectangular"
                sx={{
                  width: "100%",
                  aspectRatio: "9/16",
                  borderRadius: 2,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!reels.length) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          p: 3,
        }}
      >
        <Image
          src={isDark ? "/icons/darkThemeChat.svg" : "/icons/chat.svg"}
          alt="No reels"
          width={80}
          height={80}
          style={{ opacity: 0.5, marginBottom: 16 }}
        />
        <Typography
          variant="h6"
          sx={{
            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
            fontWeight: 600,
            mb: 1,
          }}
        >
          {(t as any)("noReels")}
        </Typography>
      </Box>
    );
  }

  const getMediaUrls = (urls: any): string[] => {
    if (Array.isArray(urls)) return urls;
    if (typeof urls === "string") {
      try {
        // Try parsing if it's a JSON array string
        const parsed = JSON.parse(urls);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // If not JSON, try comma-separated
        if (urls.includes(",")) return urls.split(",");
      }
      return [urls];
    }
    return [];
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Grid container spacing={1}>
        {reels.map((reel, index) => {
          const isLastReel = index === reels.length - 1;
          const urls = getMediaUrls(reel.media_urls);
          // Based on AddPostDrawer, index 0 is thumbnail, index 1 is video
          // If only one, it's likely the video (for old posts)
          const thumbUrl = urls.length > 1 ? urls[0] : urls[0];
          
          return (
            <Grid key={reel.id} size={{ xs: 4 }}>
              <Box
                ref={isLastReel ? lastReelElementRef : null}
                onClick={() => onReelClick(reel, index)}
                sx={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "9/16",
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
                {/* Reel Thumbnail */}
                {thumbUrl && (thumbUrl.endsWith(".mp4") || thumbUrl.endsWith(".webm") || thumbUrl.endsWith(".mov")) ? (
                  <Box
                    component="video"
                    src={`${thumbUrl}#t=0.5`}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onMouseOver={(e: any) => e.currentTarget.play()}
                    onMouseOut={(e: any) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0.5;
                    }}
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${thumbUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}

                {/* Play Icon / Overlay */}
                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s ease-in-out",
                  }}
                >
                  <PlayArrow sx={{ color: "white", fontSize: 40 }} />
                </Box>
                
                {/* Stats in corner */}
                <Box sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "white"
                }}>
                  <PlayArrow sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {reel.likes_count}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {isFetchingNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress size={32} sx={{ color: COLORS.PRIMARY_PURPLE }} />
        </Box>
      )}
    </Box>
  );
};

export default ReelFeedGrid;
