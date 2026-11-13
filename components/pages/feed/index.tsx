"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Avatar, Box, Button, ButtonBase, Container, Skeleton, Typography, useTheme } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import DynamicFeedRoundedIcon from "@mui/icons-material/DynamicFeedRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import MainLayout from "@/app/mainLayout";
import RightDrawer from "@/components/common/RightDrawer";
import EmptyState from "@/components/common/EmptyState";
import AddPostDrawer from "@/components/pages/myAccount/components/post/AddPostDrawer";
import { COLORS } from "@/constants/colors";
import { useGetInfinitePosts } from "@/hooks/usePosts";
import { type Posts, Visibility } from "@/services/post/postInterfaces";
import { selectCurrentUser, selectIsAuthenticated } from "@/features/ui/authSlice";
import { canCreatePosts } from "@/utils/auth";
import FeedPostCard from "./sections/FeedPostCard";
import FeedStories from "./sections/FeedStories";
import FeedSidebar from "./sections/FeedSidebar";
import BackToTop from "./sections/BackToTop";
import { FEED_DURATION, FEED_EASE } from "./feedMotion";

type FeedUser = {
  id?: string;
  first_name?: string;
  last_name?: string;
  business_name?: string;
  profile_pic?: string | null;
  username?: string;
  role?: string;
} | null;

/** Calls `onVisible` when the sentinel scrolls near the viewport (infinite scroll). */
function useLoadMore(enabled: boolean, onVisible: () => void) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const observer = new IntersectionObserver((entries) => entries[0]?.isIntersecting && onVisible(), { rootMargin: "600px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, onVisible]);
  return ref;
}

export default function FeedView() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser) as FeedUser;
  // Only service providers and suppliers create posts and reels; customers only read the feed.
  const canCreate = isAuthenticated && canCreatePosts(currentUser?.role);
  const reduce = useReducedMotion() === true;
  const [composerOpen, setComposerOpen] = useState(false);

  const posts = useGetInfinitePosts({ limit: 10, visibility: Visibility.PUBLIC });

  const postList = useMemo(() => posts.data?.pages.flatMap((p) => p.posts) ?? [], [posts.data]);
  // The feed shows photo and text posts; videos live in Reels (in the navbar).
  const visiblePosts = useMemo(() => postList.filter((p: Posts) => p.post_type !== "video"), [postList]);

  const loadMoreRef = useLoadMore(!!posts.hasNextPage && !posts.isFetchingNextPage, () => {
    if (posts.hasNextPage && !posts.isFetchingNextPage) void posts.fetchNextPage();
  });

  const border = dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT;
  const accent = dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE;
  const myName = currentUser?.business_name?.trim() || currentUser?.first_name || "You";
  const cardSx = {
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: border,
    borderRadius: "16px",
    boxShadow: dark ? COLORS.NEW_UI.CARD_SHADOW_DARK : COLORS.NEW_UI.CARD_SHADOW_LIGHT,
  };

  const postSkeleton = (key: number) => (
    <Box key={key} sx={{ ...cardSx, borderRadius: { xs: 0, sm: "16px" }, mb: 2, overflow: "hidden" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, p: 1.5 }}>
        <Skeleton variant="circular" width={38} height={38} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="25%" />
        </Box>
      </Box>
      <Skeleton variant="rectangular" sx={{ width: "100%", height: "auto", aspectRatio: "4 / 5" }} />
      <Box sx={{ p: 1.5 }}>
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="85%" />
      </Box>
    </Box>
  );

  // The shared EmptyState, in the feed's card.
  const stateCard = (title: string, body: string, action?: React.ReactNode) => (
    <Box sx={{ ...cardSx, borderRadius: { xs: 0, sm: "16px" } }}>
      <EmptyState
        titleKey=""
        title={title}
        description={body}
        action={action}
        minHeight={260}
        icon={
          <Box sx={{ width: 56, height: 56, borderRadius: "16px", mx: "auto", mb: 2, display: "grid", placeItems: "center", bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10, color: accent }}>
            <DynamicFeedRoundedIcon />
          </Box>
        }
      />
    </Box>
  );

  const primaryBtnSx = {
    bgcolor: COLORS.PRIMARY_PURPLE,
    color: COLORS.WHITE,
    fontWeight: 700,
    borderRadius: "10px",
    px: 2.5,
    textTransform: "none" as const,
    boxShadow: "none",
    "&:hover": { bgcolor: COLORS.PURPLE_HOVER, boxShadow: "none" },
  };

  const renderPosts = () => {
    if (posts.isLoading) return [0, 1].map(postSkeleton);
    if (posts.isError && postList.length === 0) {
      return stateCard(
        "Couldn't load the feed",
        "Something went wrong while loading posts. Check your connection and try again.",
        <Button onClick={() => posts.refetch()} startIcon={<RefreshRoundedIcon />} sx={primaryBtnSx}>
          Try again
        </Button>,
      );
    }
    if (visiblePosts.length === 0) {
      return stateCard(
        "No posts yet",
        canCreate ? "Be the first to share a photo or update with your community." : "Posts from local providers and people near you will show up here.",
        canCreate ? (
          <Button onClick={() => setComposerOpen(true)} sx={primaryBtnSx}>
            Create a post
          </Button>
        ) : (
          <Button component={Link} href="/cus/services-list" sx={primaryBtnSx}>
            Explore services
          </Button>
        ),
      );
    }
    return visiblePosts.map((post) => <FeedPostCard key={post.id} post={post} />);
  };

  const endOfList = () => {
    if (posts.isFetchingNextPage) return postSkeleton(99);
    if (!posts.hasNextPage && visiblePosts.length > 0 && !posts.isLoading) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 4 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE }}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: FEED_EASE }} />
            </svg>
          </Box>
          <Typography sx={{ color: "text.secondary", fontSize: "0.86rem" }}>You&apos;re all caught up</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <MainLayout flushTop>
      <Box sx={{ bgcolor: dark ? "background.default" : COLORS.NEW_UI.PAGE_BG_LIGHT, minHeight: "100vh", pb: { xs: 2, lg: 8 } }}>
        <Typography component="h1" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
          Kartsquare feed — stories, posts and reels
        </Typography>
        {/* Same container and side padding as the services list; phones stay edge-to-edge. */}
        <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2.5, md: 3, lg: 4 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 340px" },
              gap: { lg: 4 },
              pt: { xs: 0, sm: 3 },
            }}
          >
            {/* Main column */}
            <Box sx={{ minWidth: 0, width: "100%" }}>
              {isAuthenticated && (
                <>
                  <Box sx={{ mb: { xs: 0, sm: 2 } }}>
                    <FeedStories currentUser={currentUser} onCreatePost={canCreate ? () => setComposerOpen(true) : undefined} />
                  </Box>

                  {/* Composer (tablet/desktop); phones use the + button. Providers only. */}
                  {canCreate && (
                  <Box sx={{ ...cardSx, display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1.5, p: 1.75, mb: 2 }}>
                    <Avatar src={currentUser?.profile_pic || undefined} alt={myName} sx={{ width: 40, height: 40, fontWeight: 700, bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10, color: accent }}>
                      {myName.charAt(0).toUpperCase()}
                    </Avatar>
                    <ButtonBase
                      onClick={() => setComposerOpen(true)}
                      sx={{
                        flex: 1,
                        justifyContent: "flex-start",
                        height: 42,
                        px: 2,
                        borderRadius: "999px",
                        bgcolor: dark ? COLORS.NEW_UI.SURFACE_SOFT_DARK : COLORS.NEW_UI.SURFACE_SOFT_LIGHT,
                        border: "1px solid",
                        borderColor: border,
                        color: "text.secondary",
                        fontSize: "0.9rem",
                        transition: "transform 120ms ease, border-color 120ms ease",
                        "&:hover": { borderColor: COLORS.PRIMARY_PURPLE },
                        "&:active": { transform: "scale(0.99)" },
                        "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:active": { transform: "none" } },
                      }}
                    >
                      Share a photo, video or update…
                    </ButtonBase>
                    <Button
                      onClick={() => setComposerOpen(true)}
                      variant="outlined"
                      startIcon={<PhotoLibraryRoundedIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        borderColor: dark ? COLORS.NEW_UI.OUTLINE_DARK : COLORS.NEW_UI.OUTLINE_LIGHT,
                        color: "text.primary",
                        fontWeight: 700,
                        fontSize: "0.84rem",
                        borderRadius: "10px",
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        "&:hover": { borderColor: COLORS.PRIMARY_PURPLE, color: COLORS.PRIMARY_PURPLE },
                      }}
                    >
                      Photo / Video
                    </Button>
                  </Box>
                  )}
                </>
              )}

              <Box id="feed-panel" component={motion.div} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: FEED_DURATION.enter, ease: FEED_EASE }}>
                {renderPosts()}
              </Box>

              {/* "1px", not 1: in sx a 1 means 100%, which made this trigger as tall as the feed. */}
              <Box ref={loadMoreRef} sx={{ height: "1px" }} />
              {endOfList()}
            </Box>

            {/* Right rail (desktop) */}
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <FeedSidebar currentUser={currentUser} />
            </Box>
          </Box>
        </Container>

      </Box>

      <BackToTop />

      {canCreate && (
        <RightDrawer open={composerOpen} onClose={() => setComposerOpen(false)} title="Create post" width={520}>
          <AddPostDrawer onClose={() => setComposerOpen(false)} />
        </RightDrawer>
      )}
    </MainLayout>
  );
}
