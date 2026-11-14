import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Drawer,
  Button,
} from "@mui/material";
import {
  Close,
  Favorite,
  FavoriteBorderOutlined,
  ChatBubble,
  SentimentSatisfiedAlt,
  Send,
} from "@mui/icons-material";
import { Posts } from "@/services/post/postInterfaces";
import {
  useLikePost,
  useGetPostComments,
  useAddPostComment,
} from "@/hooks/usePosts";
import { formatTimestamp } from "@/helper/helper";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useFollowProvider } from "@/hooks/useProviderProfile";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { selectCurrentUser, selectIsAuthenticated } from "@/features/ui/authSlice";
import { openLoginModal } from "@/features/ui/loginModalSlice";
import toast from "react-hot-toast";
import { AppUserType } from "@/services/auth/auth.interface";
import ExpandableText from "@/components/common/ExpandableText";

interface ReelCommentsProps {
  post: Posts;
  open: boolean;
  onClose: () => void;
  isSidebar?: boolean;
}

const ReelComments: React.FC<ReelCommentsProps> = ({
  post,
  open,
  onClose,
  isSidebar = false,
}) => {
  const [commentText, setCommentText] = useState("");
  const {
    data: commentsData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPostComments(post.id, 10, open);
  const addCommentMutation = useAddPostComment(post.id);
  const likeMutation = useLikePost(post.id);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const followMutation = useFollowProvider(post.user.id);

  const comments = commentsData?.pages.flatMap((page) => page.comments) || [];
  const isOwnReel = currentUser?.id === post.user.id;

  const COMMENT_MAX = 500; // backend commentSchema max

  const handleSend = async () => {
    const text = commentText.trim();
    if (!text || addCommentMutation.isPending) return;
    // Posting needs an account: open the login sheet and keep what was typed.
    if (!isAuthenticated) {
      dispatch(openLoginModal());
      return;
    }
    try {
      await addCommentMutation.mutateAsync(text);
      setCommentText("");
    } catch {
      toast.error("Couldn't post your comment. Please try again.");
    }
  };

  const handleFollow = () => {
    followMutation.mutate(post.is_following ?? false);
  };

  const handleProfileClick = () => {
    dispatch(
      openDrawer({
        userId: post.user.id,
        role: post.upload_user_type,
        username: post.user.username,
      }),
    );
  };

  const content = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: isDark ? "#1a1a1a" : "#fff",
        color: isDark ? "#fff" : "#000",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          borderBottom: `1px solid ${isDark ? "#333" : "#eee"}`,
        }}
      >
        {/* {isSidebar ? (
                    <Box onClick={handleProfileClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
                        <Avatar src={post.user?.profile_pic || ""} sx={{ width: 40, height: 40 }} />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {post.user?.business_name || "User"}
                            </Typography>
                            {!isOwnReel && (
                                <Typography 
                                    variant="caption" 
                                    onClick={(e) => { e.stopPropagation(); handleFollow(); }}
                                    sx={{ color: post.is_following ? "text.secondary" : COLORS.PRIMARY_PURPLE, fontWeight: 600, cursor: 'pointer' }}
                                >
                                    {post.is_following ? t("following") : t("follow")}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{t("reels")}</Typography>
                )} */}
        {!isSidebar && (
          <IconButton onClick={onClose} sx={{ color: "inherit" }} aria-label="Close comments">
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Comment List */}
      <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto", p: 2 }}>
        {/* Caption (Top of list on desktop/sidebar) */}
        {isSidebar && post.caption && (
          <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
            <Avatar
              src={post.user?.profile_pic || ""}
              sx={{ width: 34, height: 34, cursor: "pointer" }}
              onClick={handleProfileClick}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
                onClick={handleProfileClick}
              >
                {post.user?.business_name}
              </Typography>
              <ExpandableText
                text={post.caption || ""}
                sx={{ mt: 0.5, lineHeight: 1.4 }}
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
          <>
            {comments.map((comment: any) => (
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
                    text={comment.comment}
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
                <IconButton
                  size="small"
                  sx={{ color: "inherit", opacity: 0.5 }}
                >
                  <FavoriteBorderOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            ))}
            {hasNextPage && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <Button
                  size="small"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  sx={{ color: COLORS.PRIMARY_PURPLE, textTransform: "none" }}
                >
                  {isFetchingNextPage ? (
                    <CircularProgress size={16} />
                  ) : (
                    "Load more comments"
                  )}
                </Button>
              </Box>
            )}
          </>
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
            <IconButton size="small" sx={{ color: "inherit" }}>
              <Send sx={{ fontSize: 26 }} />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
            {post.likes_count} likes
          </Typography>
          <Typography
            variant="caption"
            sx={{ opacity: 0.5, fontSize: "0.65rem" }}
          >
            {formatTimestamp(post.created_at).toUpperCase()}
          </Typography>
        </Box>
      )}

      {/* Input Section */}
      <Box
        sx={{
          p: 2,
          // clear of the phone's home indicator / navigation buttons
          pb: { xs: "calc(16px + var(--safe-bottom))", md: 2 },
          flexShrink: 0,
          borderTop: `1px solid ${isDark ? "#333" : "#eee"}`,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "inherit",
        }}
      >
        <Avatar src={currentUser?.profile_pic || ""} sx={{ width: 32, height: 32 }} />
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
            onChange={(e) => setCommentText(e.target.value.slice(0, COMMENT_MAX))}
            disabled={addCommentMutation.isPending}
            slotProps={{ htmlInput: { maxLength: COMMENT_MAX, "aria-label": "Write a comment" } }}
            sx={{
              "& .MuiInput-root": {
                color: "inherit",
                fontSize: "14px",
                "&:before, &:after": { borderBottom: "none" },
                "&:hover:not(.Mui-disabled):before": { borderBottom: "none" },
              },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void handleSend();
              }
            }}
          />
          <IconButton
            sx={{ color: "inherit", p: 0.5 }}
            onClick={() => void handleSend()}
            disabled={!commentText.trim() || addCommentMutation.isPending}
            aria-label="Post comment"
          >
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

  if (isMobile && !isSidebar) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            height: "80dvh",
            maxHeight: "calc(100dvh - 24px)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: isSidebar ? "100%" : 350,
        height: "100%",
        display: open ? "block" : "none",
        borderLeft: isSidebar ? "none" : "1px solid",
        borderColor: "divider",
      }}
    >
      {content}
    </Box>
  );
};

export default ReelComments;
