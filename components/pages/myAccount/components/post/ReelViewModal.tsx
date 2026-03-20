"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Avatar,
  Fade,
  Button,
} from "@mui/material";
import { ChevronLeft, ChevronRight, Close, Favorite, ChatBubble, MoreVert, PlayArrow, FavoriteBorderOutlined, Send, SentimentSatisfiedAlt, ChatBubbleOutline } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Navigation } from "swiper/modules";
import { Posts } from "@/services/post/postInterfaces";
import { useLikePost, useGetPostComments, useAddPostComment } from "@/hooks/usePosts";
import { formatTimestamp } from "@/helper/helper";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import ExpandableText from "@/components/common/ExpandableText";
import { TextField, CircularProgress, useTheme, useMediaQuery } from "@mui/material";
import { useFollowProvider } from "@/hooks/useProviderProfile";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { selectCurrentUser } from "@/features/ui/authSlice";
import { AppUserType } from "@/services/auth/auth.interface";

// Import Swiper styles
import "swiper/css";

/**
 * SUB-COMPONENT: Custom Comment Section (Matches Image)
 */
const ReelCommentSection = ({
  open,
  onClose,
  post,
  isSidebar = false,
}: {
  open: boolean;
  onClose: () => void;
  post: Posts;
  isSidebar?: boolean;
}) => {
  const [commentText, setCommentText] = useState("");
  const { data: commentsData, isLoading } = useGetPostComments(post.id, 10, open);
  const addCommentMutation = useAddPostComment(post.id);
  const likeMutation = useLikePost(post.id);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
    const { t } = useTranslate();

  const comments = commentsData?.pages?.flatMap((page) => page.comments) || [];

  const handleSend = async () => {
    if (commentText.trim()) {
      await addCommentMutation.mutateAsync(commentText);
      setCommentText("");
    }
  };

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const followMutation = useFollowProvider(post.user.id);

  const isOwnReel = currentUser?.id === post.user.id;

  const handleFollow = () => {
    followMutation.mutate(post.is_following ?? false);
  };

  const handleProfileClick = () => {
    dispatch(openDrawer({
      userId: post.user.id,
      role: post.user.role as AppUserType || AppUserType.SERVICE_PROVIDER,
      username: post.user.username || ''
    }));
  };

  if (!open && !isSidebar) return null;

  return (
    <Box
      sx={{
        position: isSidebar ? "relative" : "absolute",
        top: isSidebar ? "auto" : { xs: "20%", md: "5%" },
        bottom: isSidebar ? "auto" : 0,
        left: isSidebar ? "auto" : { xs: 0, md: "10%" },
        right: isSidebar ? "auto" : { xs: 0, md: "10%" },
        width: isSidebar ? "400px" : "100%",
        height: isSidebar ? "100%" : "auto",
        bgcolor: isDark ? "#1a1a1a" : "#fff",
        zIndex: 200,
        borderRadius: isSidebar ? 0 : { xs: "20px 20px 0 0", md: "12px" },
        display: "flex",
        flexDirection: "column",
        color: isDark ? "#fff" : "#000",
        boxShadow: isSidebar ? "none" : "0px -4px 20px rgba(0,0,0,0.5)",
        overflow: "hidden",
        borderLeft: isSidebar ? `1px solid ${isDark ? "#333" : "#eee"}` : "none",
      }}
    >
      {/* Sidebar User Header */}
      {isSidebar && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: `1px solid ${isDark ? "#333" : "#eee"}`,
          }}
        >
          <Box onClick={handleProfileClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
            <Avatar
              src={post.user?.profile_pic || ""}
              sx={{ width: 40, height: 40 }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {post.user?.business_name || "User"}
            </Typography>
          </Box>
          {!isOwnReel && (
            <Button
              size="small"
              onClick={handleFollow}
              sx={{
                fontWeight: 700,
                color: post.is_following ? "text.secondary" : COLORS.PRIMARY_PURPLE,
                textTransform: 'none',
                minWidth: 'auto',
                p: 0,
                ml: 1,
                fontSize: "0.85rem",
                '&:hover': { bgcolor: 'transparent', opacity: 0.8 }
              }}
            >
              • {post.is_following ? t("following") : t("follow")}
            </Button>
          )}
        </Box>
      )}

      {/* Standard Header (Mobile only) */}
      {!isSidebar && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            borderBottom: `1px solid ${isDark ? "#333" : "#eee"}`,
          }}
        >
          <IconButton onClick={onClose} sx={{ color: "inherit" }}>
            <Close />
          </IconButton>
          {/* <Typography
            variant="h6"
            sx={{ flex: 1, textAlign: "center", fontWeight: 700, mr: 5 }}
          >
            {t("comments")}
          </Typography> */}
        </Box>
      )}

      {/* Comment List */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {/* Caption (Top of list on desktop) */}
        {isSidebar && post.caption && (
          <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
            <Avatar
              src={post.user?.profile_pic || ""}
              sx={{ width: 34, height: 34, cursor: 'pointer' }}
              onClick={handleProfileClick}
            />
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="body2" 
                sx={{ fontWeight: 700, fontSize: "0.85rem", cursor: 'pointer' }}
                onClick={handleProfileClick}
              >
                {post.user?.business_name}
              </Typography>
              <ExpandableText
                text={post.caption || ""}
                maxChars={120}
                sx={{ mt: 0.5, lineHeight: 1.4, fontSize: "0.875rem" }}
              />
            </Box>
          </Box>
        )}

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress size={24} sx={{ color: "inherit" }} />
          </Box>
        ) : comments.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", opacity: 0.6 }}>
            <Typography variant="body2">No comments yet.</Typography>
          </Box>
        ) : (
          comments.map((comment: any) => (
            <Box key={comment.id} sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
              <Avatar
                src={comment.user_profile_pic || ""}
                sx={{ width: 34, height: 34 }}
              />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, fontSize: "0.85rem" }}
                  >
                    {comment.user_first_name} {comment.user_last_name}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.5 }}>
                    {formatTimestamp(comment.created_at)}
                  </Typography>
                </Box>
                <ExpandableText
                  text={comment.comment || ""}
                  maxChars={100}
                  sx={{ my: 0.2, fontSize: "0.85rem", lineHeight: 1.4 }}
                />
                <Box sx={{ display: "flex", gap: 2, mt: 0.5, opacity: 0.7 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {comment.likes_count || 0} likes
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, cursor: "pointer" }}
                  >
                    Reply
                  </Typography>
                </Box>
                {comment.replies_count > 0 && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1,
                      opacity: 0.5,
                      cursor: "pointer",
                      "&::before": {
                        content: '"—— "',
                        mr: 1,
                      },
                    }}
                  >
                    View all {comment.replies_count} replies
                  </Typography>
                )}
              </Box>
              {/* <IconButton size="small" sx={{ color: "inherit", opacity: 0.5 }}>
                <FavoriteBorderOutlined sx={{ fontSize: 18 }} />
              </IconButton> */}
            </Box>
          ))
        )}
      </Box>

      {/* Sidebar Reactions Area */}
      {isSidebar && (
        <Box sx={{ p: 2, borderTop: `1px solid ${isDark ? "#333" : "#eee"}` }}>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <IconButton
              size="small"
              onClick={() => likeMutation.mutate()}
              sx={{ color: post.is_liked ? "#ff0042" : "inherit" }}
            >
              {post.is_liked ? (
                <Favorite sx={{ fontSize: 28 }} />
              ) : (
                <FavoriteBorderOutlined sx={{ fontSize: 28 }} />
              )}
            </IconButton>
            <IconButton size="small" sx={{ color: "inherit" }}>
              <ChatBubble sx={{ fontSize: 26 }} />
            </IconButton>
            {/* <IconButton size="small" sx={{ color: "inherit" }}>
              <Send sx={{ fontSize: 26 }} />
            </IconButton> */}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {post.likes_count} likes
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.5, fontSize: "0.65rem" }}>
            {formatTimestamp(post.created_at).toUpperCase()}
          </Typography>
        </Box>
      )}

      {/* Input Section */}
      <Box
        sx={{
          p: 2,
          pb: { xs: 4, md: 2 },
          borderTop: `1px solid ${isDark ? "#333" : "#eee"}`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "inherit",
        }}
      >
        <Avatar src="" sx={{ width: 32, height: 32 }} />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            bgcolor: isDark ? "#333" : "#f5f5f5",
            borderRadius: "20px",
            px: 2,
            py: 0.5,
          }}
        >
          <TextField
            fullWidth
            placeholder="Add a comment..."
            variant="standard"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            sx={{
              "& .MuiInput-root": {
                color: "inherit",
                fontSize: "14px",
                "&:before, &:after": { borderBottom: "none" },
                "&:hover:not(.Mui-disabled):before": { borderBottom: "none" },
              },
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton sx={{ color: "inherit", p: 0.5 }} onClick={handleSend}>
            {addCommentMutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <Send sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

const getMediaUrls = (urls: any): string[] => {
  if (Array.isArray(urls)) return urls;
  if (typeof urls === "string") {
    try {
      const parsed = JSON.parse(urls);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      if (urls.includes(",")) return urls.split(",");
    }
    return [urls];
  }
  return [];
};

/**
 * SUB-COMPONENT: Single Reel Item
 * This handles the specific video logic to prevent echos and poor audio.
 */
const ReelItem = ({
  reel,
  isActive,
  isCommentOpen,
  onCommentClick,
}: {
  reel: Posts;
  isActive: boolean;
  isCommentOpen: boolean;
  onCommentClick: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const isDesktop = useMediaQuery((theme: any) => theme.breakpoints.up("md"));

  const urls = getMediaUrls(reel.media_urls);
  const videoUrl = urls.length > 1 ? urls[1] : urls[0];

  const likeMutation = useLikePost(reel.id);

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const followMutation = useFollowProvider(reel.user.id);

  const isOwnReel = currentUser?.id === reel.user.id;

  const handleFollow = () => {
    followMutation.mutate(reel.is_following ?? false);
  };

  const handleProfileClick = () => {
    dispatch(openDrawer({
      userId: reel.user.id,
      role: reel.user.role as AppUserType || AppUserType.SERVICE_PROVIDER,
      username: reel.user.username || ''
    }));
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // On mobile, we pause when comments are open. On desktop, we keep playing.
    const shouldPause = !isActive || (!isDesktop && isCommentOpen);

    if (!shouldPause) {
      const playPromise = setTimeout(() => {
        video.muted = false;
        video.volume = 1.0;
        video.play().catch(() => {
          video.muted = true;
          video.play();
        });
      }, 100);
      return () => clearTimeout(playPromise);
    } else {
      video.pause();
      if (!isCommentOpen || isDesktop) {
        // Reset only if moving slides or completely closing on desktop
        if (!isActive) video.currentTime = 0;
      }
      video.muted = true;
    }
  }, [isActive, isCommentOpen, isDesktop]);

  // Pause when the browser tab/window loses focus; resume when it comes back (only if active)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVisibilityChange = () => {
      const shouldPause = !isActive || (!isDesktop && isCommentOpen);
      if (document.hidden) {
        video.pause();
      } else if (!shouldPause) {
        video.play().catch(() => {
          video.muted = true;
          video.play();
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive, isCommentOpen, isDesktop]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsManualPaused(false);
      } else {
        videoRef.current.pause();
        setIsManualPaused(true);
      }
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMutation.mutate();
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        bgcolor: "#000",
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        src={videoUrl}
        loop
        playsInline
        onClick={handleVideoClick}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          cursor: "pointer",
        }}
      />

      {/* Play Icon Overlay */}
      <Fade in={isManualPaused}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <PlayArrow sx={{ color: "rgba(255,255,255,0.6)", fontSize: 80 }} />
        </Box>
      </Fade>

      {/* Right Side Actions */}
      <Box
        sx={{
          position: "absolute",
          right: 12,
          bottom: 120,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          zIndex: 10,
          alignItems: "center",
          opacity: isDesktop && isCommentOpen ? 0 : 1,
          transition: "opacity 0.2s",
          pointerEvents: isDesktop && isCommentOpen ? "none" : "auto",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <IconButton onClick={handleLike} sx={{ color: reel.is_liked ? 'red' : 'white', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }}>
                    {reel.is_liked ? <Favorite fontSize="large" /> : <FavoriteBorderOutlined fontSize="large" />}
                </IconButton>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>
                    {reel.likes_count}
                </Typography>
          
          
        </Box>

        <Box sx={{ textAlign: "center", mb: 5 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onCommentClick();
            }}
            sx={{ color: 'white', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }}
          >
            <ChatBubbleOutline fontSize="large" sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>
            {reel.comments_count}
          </Typography>
        </Box>

        {/* <IconButton sx={{ color: "#fff", bgcolor: "rgba(0,0,0,0.3)", filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}>
          <MoreVert fontSize="large" />
        </IconButton> */}
      </Box>

      {/* Bottom Info */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          pb: 6,
          background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
          zIndex: 10,
          opacity: isDesktop && isCommentOpen ? 0 : 1,
          transition: "opacity 0.2s",
          pointerEvents: isDesktop && isCommentOpen ? "none" : "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Box onClick={handleProfileClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
            <Avatar
              src={reel.user?.profile_pic || ""}
              sx={{ width: 42, height: 42, border: "2px solid #fff", filter: "drop-shadow(0px 1px 3px rgba(0,0,0,0.5))" }}
            />
            <Typography
              variant="subtitle1"
              sx={{ color: "#fff", fontWeight: 700, textShadow: "0px 1px 3px rgba(0,0,0,0.8)" }}
            >
              {reel.user?.business_name || "User"}
            </Typography>
          </Box>
          {!isOwnReel && (
            <Button
              variant={reel.is_following ? "contained" : "outlined"}
              size="small"
              onClick={handleFollow}
              sx={{
                color: 'white',
                borderColor: 'white',
                borderRadius: '8px',
                textTransform: 'none',
                px: 1.5,
                height: '28px',
                fontSize: "0.75rem",
                fontWeight: "bold",
                bgcolor: reel.is_following ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
              }}
            >
              {reel.is_following ? "Following" : "Follow"}
            </Button>
          )}
        </Box>
        <ExpandableText
          text={reel.caption || ""}
          maxChars={80}
          sx={{
            color: "#fff",
            maxWidth: "80%",
            textShadow: "0px 2px 4px rgba(0,0,0,0.9)",
            fontWeight: 500,
          }}
        />
      </Box>

      {/* Custom Comment Section Overlay (Mobile only) */}
      {!isDesktop && (
        <ReelCommentSection
          open={isCommentOpen}
          onClose={onCommentClick}
          post={reel}
        />
      )}
    </Box>
  );
};

/**
 * MAIN COMPONENT: Reel View Modal
 */
const ReelViewModal = ({ open, onClose, reels, initialIndex }: any) => {
  const isDesktop = useMediaQuery((theme: any) => theme.breakpoints.up("md"));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isCommentOpen, setIsCommentOpen] = useState(isDesktop);

  const activeReel = reels[activeIndex];

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: isDesktop && isCommentOpen ? "820px" : { xs: "100%", md: "420px" },
          height: { xs: "100%", md: "90vh" },
          bgcolor: "#000",
          outline: "none",
          position: "relative",
          borderRadius: { md: 3 },
          overflow: "hidden",
          boxShadow: 24,
          display: "flex",
          transition: "width 0.3s ease",
        }}
      >
        {/* Top Close Button (Visible when sidebar is closed or on mobile) */}
        {(!isDesktop || !isCommentOpen) && (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 100,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.4)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
            }}
          >
            <Close />
          </IconButton>
        )}

        {/* Global Modal Close Button for Desktop when Sidebar is Open */}
        {isDesktop && isCommentOpen && (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              zIndex: 300,
              color: isDesktop ? "inherit" : "#fff",
            }}
          >
            <Close />
          </IconButton>
        )}

        {/* Left/Right Navigation Buttons */}
        {isDesktop && (
          <>
            <IconButton
              className="reel-nav-prev"
              sx={{
                position: "fixed",
                left: { md: "calc(50% - 450px)", lg: "calc(50% - 500px)" },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 100,
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                "&.swiper-button-disabled": { opacity: 0.3, cursor: "default" },
              }}
            >
              <ChevronLeft sx={{ fontSize: 40 }} />
            </IconButton>
            <IconButton
              className="reel-nav-next"
              sx={{
                position: "fixed",
                right: { md: "calc(50% - 450px)", lg: "calc(50% - 500px)" },
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 1000,
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                "&.swiper-button-disabled": { opacity: 0.3, cursor: "default" },
              }}
            >
              <ChevronRight sx={{ fontSize: 40 }} />
            </IconButton>
          </>
        )}

        <Box sx={{ flex: 1, height: "100%", position: "relative" }}>
          <Swiper
            direction="vertical"
            modules={[Mousewheel, Navigation]}
            mousewheel={true}
            navigation={{
              prevEl: ".reel-nav-prev",
              nextEl: ".reel-nav-next",
            }}
            initialSlide={initialIndex}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            style={{ width: "100%", height: "100%" }}
          >
            {reels.map((reel: any, index: number) => (
              <SwiperSlide key={reel.id}>
                <ReelItem
                  reel={reel}
                  isActive={index === activeIndex}
                  isCommentOpen={isCommentOpen}
                  onCommentClick={() => {
                    if (!isDesktop) setIsCommentOpen(!isCommentOpen);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Desktop Sidebar Comments */}
        {isDesktop && isCommentOpen && (
          <Box sx={{ width: "400px", height: "100%", bgcolor: "background.paper" }}>
            <ReelCommentSection
              open={isCommentOpen}
              onClose={() => {
                if (!isDesktop) setIsCommentOpen(false);
              }}
              post={activeReel}
              isSidebar
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ReelViewModal;