"use client";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Box, Button, ButtonBase, IconButton, Typography, useTheme } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import toast from "react-hot-toast";
import { COLORS } from "@/constants/colors";
import { Posts } from "@/services/post/postInterfaces";
import { AppUserType } from "@/services/auth/auth.interface";
import { useLikePost } from "@/hooks/usePosts";
import { useFollow } from "@/hooks/useFollow";
import { useSavedPostIds, useToggleSavePost } from "@/hooks/useSavedPosts";
import { selectCurrentUser, selectIsAuthenticated } from "@/features/ui/authSlice";
import { openLoginModal } from "@/features/ui/loginModalSlice";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { formatTimestamp } from "@/helper/helper";
import PostComment from "@/components/pages/home/components/PostComment";
import { isVideoUrl } from "@/services/post/postMedia";

/** media_urls arrives as an array of urls (older rows: a single url string). */
export function postMedia(post: Pick<Posts, "media_urls">): string[] {
  const raw = post.media_urls as unknown;
  if (Array.isArray(raw)) return raw.filter((u): u is string => typeof u === "string" && !!u);
  if (typeof raw === "string" && raw.trim()) {
    const value = raw.trim();
    if (value.startsWith("[")) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter((u) => typeof u === "string" && u);
      } catch {
        /* fall through: treat as a single url */
      }
    }
    return [value];
  }
  return [];
}

export { isVideoUrl };

/**
 * What to show for a post: video posts carry a thumbnail image and the video
 * file in media_urls, so they show the video with the image as its poster;
 * photo posts show every image.
 */
export function postSlides(post: Pick<Posts, "media_urls" | "post_type">): Array<{ url: string; video: boolean; poster?: string }> {
  const urls = postMedia(post);
  const videos = urls.filter(isVideoUrl);
  const images = urls.filter((u) => !isVideoUrl(u));
  if (post.post_type === "video" || videos.length > 0) {
    return videos.map((url) => ({ url, video: true, poster: images[0] }));
  }
  return images.map((url) => ({ url, video: false }));
}

function displayName(post: Posts): string {
  const u = post.user;
  return u?.business_name?.trim() || `${u?.first_name ?? ""} ${u?.last_name ?? ""}`.trim() || u?.username || "Kartsquare user";
}

interface FeedPostCardProps {
  post: Posts;
}

export default function FeedPostCard({ post }: FeedPostCardProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser) as { id?: string } | null;

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [slide, setSlide] = useState(0);
  // Followed from this card; the server value is the source of truth otherwise.
  const [followedHere, setFollowedHere] = useState(false);
  const following = followedHere || !!(post.is_following ?? post.user?.is_following);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastTap = useRef(0);

  const likeMutation = useLikePost(post.id);
  const followMutation = useFollow();
  const { data: savedIds } = useSavedPostIds(isAuthenticated);
  const toggleSave = useToggleSavePost();

  const name = displayName(post);
  const media = postSlides(post);
  const isProvider =
    post.upload_user_type === AppUserType.SERVICE_PROVIDER || post.upload_user_type === AppUserType.SUPPLIER;
  const isOwn = !!currentUser?.id && currentUser.id === post.user_id;
  const isSaved = !!savedIds?.has(post.id);
  const place = post.location_name?.trim();
  const caption = post.caption?.trim() ?? "";
  const longCaption = caption.length > 140;

  const requireLogin = () => {
    if (isAuthenticated) return false;
    dispatch(openLoginModal());
    return true;
  };

  const openProfile = () =>
    dispatch(openDrawer({ userId: post.user_id, role: post.upload_user_type, username: post.user?.username }));

  const like = () => {
    if (requireLogin()) return;
    likeMutation.mutate();
  };

  // Double-tap / double-click on the photo likes it (never unlikes), like Instagram.
  const onMediaTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300 && !post.is_liked) like();
    lastTap.current = now;
  };

  const openComments = () => {
    if (requireLogin()) return;
    setCommentsOpen(true);
  };

  const follow = () => {
    if (requireLogin()) return;
    setFollowedHere(true);
    followMutation.mutate(post.user_id, {
      onError: () => {
        setFollowedHere(false);
        toast.error("Couldn't follow. Please try again.");
      },
    });
  };

  const save = () => {
    if (requireLogin()) return;
    toggleSave.mutate(
      { postId: post.id, saved: isSaved },
      { onError: () => toast.error("Couldn't update saved posts. Please try again.") },
    );
  };

  const share = async () => {
    const username = post.user?.username;
    const url = `${window.location.origin}${username ? `/in/${username}` : "/cus/feed"}`;
    const text = caption ? `${name}: ${caption.slice(0, 120)}` : `${name} on Kartsquare`;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      /* the user closed the share sheet */
    }
  };

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(media.length - 1, index));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const onTrackScroll = () => {
    const el = trackRef.current;
    if (el && el.clientWidth) setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };

  const iconColor = "text.primary";
  const border = dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT;

  return (
    <Box
      component="article"
      aria-label={`Post by ${name}`}
      sx={{
        bgcolor: "background.paper",
        // Phones: edge-to-edge with top/bottom rules; tablet up: a bordered card.
        border: { xs: "none", sm: `1px solid ${border}` },
        borderTop: `1px solid ${border}`,
        borderBottom: `1px solid ${border}`,
        borderRadius: { xs: 0, sm: "16px" },
        boxShadow: { xs: "none", sm: dark ? COLORS.NEW_UI.CARD_SHADOW_DARK : COLORS.NEW_UI.CARD_SHADOW_LIGHT },
        overflow: "hidden",
        mb: { xs: 1.25, sm: 2.25 },
      }}
    >
      {/* Header: avatar + name (open profile), area · time, Follow */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: { xs: 1.5, sm: 1.75 }, py: 1.5 }}>
        <ButtonBase onClick={openProfile} aria-label={`View ${name}'s profile`} sx={{ borderRadius: "50%" }}>
          <Avatar
            src={post.user?.profile_pic || undefined}
            alt={name}
            sx={{
              width: 38,
              height: 38,
              fontWeight: 800,
              fontSize: "0.95rem",
              bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10,
              color: dark ? COLORS.NEW_UI.CHIP_TEXT_DARK : COLORS.PRIMARY_PURPLE,
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
        </ButtonBase>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
            <Typography
              component="button"
              onClick={openProfile}
              sx={{
                all: "unset",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 800,
                color: "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                "&:hover": { color: COLORS.PRIMARY_PURPLE },
                "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}`, borderRadius: "4px" },
              }}
            >
              {name}
            </Typography>
            {isProvider && (
              <>
                <CheckCircleRoundedIcon sx={{ fontSize: 15, color: COLORS.NEW_UI.VERIFIED_GREEN, flexShrink: 0 }} titleAccess="Listed on Kartsquare" />
                <Box
                  component="span"
                  sx={{
                    display: { xs: "none", sm: "inline-flex" },
                    px: 1,
                    py: 0.15,
                    borderRadius: "999px",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10,
                    color: dark ? COLORS.NEW_UI.CHIP_TEXT_DARK : COLORS.PRIMARY_PURPLE,
                    flexShrink: 0,
                  }}
                >
                  {post.upload_user_type === AppUserType.SUPPLIER ? "Supplier" : "Provider"}
                </Box>
              </>
            )}
          </Box>
          <Typography sx={{ fontSize: "0.76rem", color: "text.secondary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {place ? `${place} · ` : ""}
            {formatTimestamp(post.created_at)}
          </Typography>
        </Box>
        {!isOwn && !following && (
          <Button
            onClick={follow}
            size="small"
            sx={{
              minWidth: 0,
              px: 1,
              fontSize: "0.84rem",
              fontWeight: 700,
              textTransform: "none",
              color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE,
            }}
          >
            Follow
          </Button>
        )}
      </Box>

      {/* Media: swipeable photos, or a video */}
      {media.length > 0 && (
        <Box sx={{ position: "relative", bgcolor: dark ? "#000" : COLORS.NEW_UI.SURFACE_SOFT_LIGHT }}>
          <Box
            ref={trackRef}
            onScroll={onTrackScroll}
            onClick={onMediaTap}
            sx={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {media.map((slideItem, i) => (
              <Box key={slideItem.url + i} sx={{ flex: "0 0 100%", scrollSnapAlign: "start", aspectRatio: "4 / 5", maxHeight: 640, display: "flex" }}>
                {slideItem.video ? (
                  <Box component="video" src={slideItem.url} poster={slideItem.poster} controls playsInline preload="none" sx={{ width: "100%", height: "100%", objectFit: "contain", bgcolor: "#000" }} />
                ) : (
                  <Box
                    component="img"
                    src={slideItem.url}
                    alt={caption ? caption.slice(0, 100) : `Post by ${name}`}
                    loading="lazy"
                    draggable={false}
                    // Whole photo, never cropped: posters often carry text right to the edge.
                    sx={{ width: "100%", height: "100%", objectFit: "contain", userSelect: "none" }}
                  />
                )}
              </Box>
            ))}
          </Box>

          {media.length > 1 && (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  px: 1,
                  py: 0.25,
                  borderRadius: "999px",
                  bgcolor: "rgba(0,0,0,0.55)",
                  color: COLORS.WHITE,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                {slide + 1}/{media.length}
              </Box>
              {slide > 0 && (
                <IconButton
                  onClick={() => goTo(slide - 1)}
                  aria-label="Previous photo"
                  size="small"
                  sx={{ display: { xs: "none", sm: "flex" }, position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.9)", "&:hover": { bgcolor: COLORS.WHITE } }}
                >
                  <ChevronLeftRoundedIcon />
                </IconButton>
              )}
              {slide < media.length - 1 && (
                <IconButton
                  onClick={() => goTo(slide + 1)}
                  aria-label="Next photo"
                  size="small"
                  sx={{ display: { xs: "none", sm: "flex" }, position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", bgcolor: "rgba(255,255,255,0.9)", "&:hover": { bgcolor: COLORS.WHITE } }}
                >
                  <ChevronRightRoundedIcon />
                </IconButton>
              )}
              <Box sx={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 0.5 }}>
                {media.map((_, i) => (
                  <Box key={i} sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: i === slide ? COLORS.WHITE : "rgba(255,255,255,0.55)" }} />
                ))}
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Provider posts link back into the marketplace */}
      {isProvider && !isOwn && (
        <Box
          sx={{
            mx: { xs: 1.5, sm: 1.75 },
            mt: 1.5,
            p: 1.25,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: border,
            bgcolor: dark ? COLORS.NEW_UI.SURFACE_SOFT_DARK : COLORS.NEW_UI.SURFACE_SOFT_LIGHT,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <StorefrontRoundedIcon sx={{ fontSize: 20, color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE }} />
          <Typography sx={{ flex: 1, minWidth: 0, fontSize: "0.84rem", color: "text.primary" }} noWrap>
            Services by <b>{name}</b>
          </Typography>
          <Button
            onClick={openProfile}
            variant="contained"
            size="small"
            sx={{
              bgcolor: COLORS.PRIMARY_PURPLE,
              color: COLORS.WHITE,
              fontWeight: 700,
              fontSize: "0.8rem",
              borderRadius: "10px",
              px: 1.5,
              textTransform: "none",
              boxShadow: "none",
              flexShrink: 0,
              "&:hover": { bgcolor: COLORS.PURPLE_HOVER, boxShadow: "none" },
            }}
          >
            View services
          </Button>
        </Box>
      )}

      {/* Actions */}
      <Box sx={{ display: "flex", alignItems: "center", px: { xs: 0.75, sm: 1 }, pt: 0.75 }}>
        <IconButton onClick={like} aria-label={post.is_liked ? "Unlike" : "Like"} aria-pressed={!!post.is_liked}>
          {post.is_liked ? (
            <FavoriteRoundedIcon sx={{ color: "#ef4444" }} />
          ) : (
            <FavoriteBorderRoundedIcon sx={{ color: iconColor }} />
          )}
        </IconButton>
        <IconButton onClick={openComments} aria-label="Comment">
          <ChatBubbleOutlineRoundedIcon sx={{ color: iconColor }} />
        </IconButton>
        <IconButton onClick={share} aria-label="Share">
          <SendRoundedIcon sx={{ color: iconColor, transform: "rotate(-30deg) translateY(-2px)" }} />
        </IconButton>
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={save} aria-label={isSaved ? "Remove from saved" : "Save"} aria-pressed={isSaved}>
          {isSaved ? (
            <BookmarkRoundedIcon sx={{ color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE }} />
          ) : (
            <BookmarkBorderRoundedIcon sx={{ color: iconColor }} />
          )}
        </IconButton>
      </Box>

      {/* Likes, caption, comments, time */}
      <Box sx={{ px: { xs: 1.5, sm: 1.75 }, pb: 1.75 }}>
        {post.likes_count > 0 && (
          <Typography sx={{ fontSize: "0.86rem", fontWeight: 800, color: "text.primary", mb: 0.5 }}>
            {post.likes_count.toLocaleString("en-IN")} {post.likes_count === 1 ? "like" : "likes"}
          </Typography>
        )}
        {caption && (
          <Typography sx={{ fontSize: "0.86rem", color: "text.primary", lineHeight: 1.5, whiteSpace: "pre-line", wordBreak: "break-word" }}>
            <Box component="span" sx={{ fontWeight: 800, mr: 0.75 }}>
              {name}
            </Box>
            {longCaption && !expanded ? `${caption.slice(0, 140).trimEnd()}… ` : caption}
            {longCaption && !expanded && (
              <Box
                component="button"
                onClick={() => setExpanded(true)}
                sx={{ all: "unset", cursor: "pointer", color: "text.secondary", fontWeight: 600 }}
              >
                more
              </Box>
            )}
          </Typography>
        )}
        {post.comments_count > 0 && (
          <Box
            component="button"
            onClick={openComments}
            sx={{ all: "unset", cursor: "pointer", display: "block", mt: 0.5, fontSize: "0.84rem", color: "text.secondary" }}
          >
            View {post.comments_count === 1 ? "1 comment" : `all ${post.comments_count} comments`}
          </Box>
        )}
        <Box
          component="button"
          onClick={openComments}
          sx={{ all: "unset", cursor: "pointer", display: "block", mt: 0.5, fontSize: "0.84rem", color: "text.secondary" }}
        >
          Add a comment…
        </Box>
      </Box>

      <PostComment open={commentsOpen} onClose={() => setCommentsOpen(false)} post={post} />
    </Box>
  );
}
