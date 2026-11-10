"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Avatar, Box, Button, ButtonBase, Container, IconButton, Skeleton, Typography, useTheme } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import DynamicFeedRoundedIcon from "@mui/icons-material/DynamicFeedRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import MainLayout from "@/app/mainLayout";
import RightDrawer from "@/components/common/RightDrawer";
import AddPostDrawer from "@/components/pages/myAccount/components/post/AddPostDrawer";
import { COLORS } from "@/constants/colors";
import { useGetInfinitePosts, useGetReels } from "@/hooks/usePosts";
import { Posts, Visibility } from "@/services/post/postInterfaces";
import { selectCurrentUser, selectIsAuthenticated } from "@/features/ui/authSlice";
import FeedPostCard from "./sections/FeedPostCard";
import FeedStories from "./sections/FeedStories";
import FeedSidebar from "./sections/FeedSidebar";
import { FeedReelsGrid, FeedReelsStrip } from "./sections/FeedReels";

type FeedTab = "for_you" | "posts" | "reels";
const TABS: Array<{ id: FeedTab; label: string }> = [
  { id: "for_you", label: "For you" },
  { id: "posts", label: "Posts" },
  { id: "reels", label: "Reels" },
];
/** A "Reels for you" strip appears after every this many posts in "For you". */
const REELS_EVERY = 4;
const REELS_PER_STRIP = 8;

/** The list starting at `offset`, wrapping around, so every strip has reels to show. */
function rotate<T>(list: T[], offset: number): T[] {
  if (list.length === 0) return list;
  const start = offset % list.length;
  return [...list.slice(start), ...list.slice(0, start)];
}

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
  const [tab, setTab] = useState<FeedTab>("for_you");
  const [composerOpen, setComposerOpen] = useState(false);

  const posts = useGetInfinitePosts({ limit: 10, visibility: Visibility.PUBLIC });
  const reels = useGetReels();

  const postList = useMemo(() => posts.data?.pages.flatMap((p) => p.posts) ?? [], [posts.data]);
  const reelList = useMemo(() => reels.data?.pages.flatMap((p) => p.posts) ?? [], [reels.data]);
  // "Posts" shows photo and text posts; videos live in Reels.
  const visiblePosts = useMemo(
    () => (tab === "posts" ? postList.filter((p: Posts) => p.post_type !== "video") : postList),
    [postList, tab],
  );

  const activeQuery = tab === "reels" ? reels : posts;
  const loadMoreRef = useLoadMore(!!activeQuery.hasNextPage && !activeQuery.isFetchingNextPage, () => {
    if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) void activeQuery.fetchNextPage();
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

  const stateCard = (title: string, body: string, action?: React.ReactNode) => (
    <Box sx={{ ...cardSx, borderRadius: { xs: 0, sm: "16px" }, p: { xs: 4, sm: 5 }, textAlign: "center" }}>
      <Box sx={{ width: 56, height: 56, borderRadius: "16px", mx: "auto", mb: 2, display: "grid", placeItems: "center", bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10, color: accent }}>
        <DynamicFeedRoundedIcon />
      </Box>
      <Typography component="h2" sx={{ fontSize: "1.15rem", fontWeight: 800, color: "text.primary", mb: 0.75 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "0.9rem", color: "text.secondary", maxWidth: 420, mx: "auto", mb: action ? 2.5 : 0 }}>{body}</Typography>
      {action}
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
        isAuthenticated ? "Be the first to share a photo or update with your community." : "Posts from local providers and people near you will show up here.",
        isAuthenticated ? (
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
    return visiblePosts.map((post, i) => {
      // After every REELS_EVERY posts, a reels strip; each strip starts further
      // into the reels list so consecutive strips don't repeat the same videos.
      const stripNo = (i + 1) % REELS_EVERY === 0 ? (i + 1) / REELS_EVERY - 1 : -1;
      const stripReels = stripNo >= 0 ? rotate(reelList, stripNo * REELS_PER_STRIP) : [];
      return (
        <React.Fragment key={post.id}>
          <FeedPostCard post={post} />
          {tab === "for_you" && stripNo >= 0 && <FeedReelsStrip reels={stripReels} />}
        </React.Fragment>
      );
    });
  };

  const endOfList = () => {
    if (activeQuery.isFetchingNextPage) return tab === "reels" ? null : postSkeleton(99);
    const items = tab === "reels" ? reelList : visiblePosts;
    if (!activeQuery.hasNextPage && items.length > 0 && !activeQuery.isLoading) {
      return (
        <Typography sx={{ textAlign: "center", color: "text.secondary", fontSize: "0.86rem", py: 3 }}>
          You&apos;re all caught up
        </Typography>
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
                    <FeedStories currentUser={currentUser} />
                  </Box>

                  {/* Composer (tablet/desktop); phones use the + button */}
                  <Box sx={{ ...cardSx, display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1.5, p: 1.75, mb: 2 }}>
                    <Avatar src={currentUser?.profile_pic || undefined} alt={myName} sx={{ width: 40, height: 40, fontWeight: 800, bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10, color: accent }}>
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
                </>
              )}

              {/* Tabs */}
              <Box role="tablist" aria-label="Feed" sx={{ display: "flex", gap: 1, px: { xs: 1.5, sm: 0 }, py: { xs: 1.5, sm: 0 }, mb: { xs: 0, sm: 2 } }}>
                {TABS.map((t) => {
                  const selected = tab === t.id;
                  return (
                    <ButtonBase
                      key={t.id}
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setTab(t.id)}
                      sx={{
                        height: 36,
                        px: 2,
                        borderRadius: "999px",
                        fontSize: "0.86rem",
                        fontWeight: selected ? 700 : 600,
                        border: "1px solid",
                        borderColor: selected ? (dark ? COLORS.WHITE : COLORS.NEW_UI.INK) : dark ? COLORS.NEW_UI.DIVIDER_DARK : COLORS.NEW_UI.DIVIDER_LIGHT,
                        bgcolor: selected ? (dark ? COLORS.WHITE : COLORS.NEW_UI.INK) : "transparent",
                        color: selected ? (dark ? COLORS.NEW_UI.INK : COLORS.WHITE) : "text.primary",
                        "&:hover": selected ? {} : { borderColor: COLORS.PRIMARY_PURPLE, color: COLORS.PRIMARY_PURPLE },
                      }}
                    >
                      {t.label}
                    </ButtonBase>
                  );
                })}
                {/* Create (phones): in the tab row, clear of the floating Kart AI button */}
                {isAuthenticated && (
                  <IconButton
                    onClick={() => setComposerOpen(true)}
                    aria-label="Create a post"
                    sx={{
                      display: { xs: "inline-flex", sm: "none" },
                      ml: "auto",
                      width: 36,
                      height: 36,
                      bgcolor: COLORS.PRIMARY_PURPLE,
                      color: COLORS.WHITE,
                      "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
                    }}
                  >
                    <AddRoundedIcon />
                  </IconButton>
                )}
              </Box>

              {tab === "reels" ? (
                reels.isError && reelList.length === 0 ? (
                  stateCard(
                    "Couldn't load reels",
                    "Something went wrong while loading reels. Check your connection and try again.",
                    <Button onClick={() => reels.refetch()} startIcon={<RefreshRoundedIcon />} sx={primaryBtnSx}>
                      Try again
                    </Button>,
                  )
                ) : !reels.isLoading && reelList.length === 0 ? (
                  stateCard("No reels yet", "Short videos from providers will show up here.")
                ) : (
                  <FeedReelsGrid reels={reelList} loading={reels.isLoading} />
                )
              ) : (
                renderPosts()
              )}

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

      <RightDrawer open={composerOpen} onClose={() => setComposerOpen(false)} title="Create post" width={520}>
        <AddPostDrawer onClose={() => setComposerOpen(false)} />
      </RightDrawer>
    </MainLayout>
  );
}
