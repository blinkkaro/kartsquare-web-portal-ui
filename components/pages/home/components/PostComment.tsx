import React, { useState } from "react";
import {
  Modal,
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { Close, Send } from "@mui/icons-material";
import toast from "react-hot-toast";
import { type Posts, type Comment } from "@/services/post/postInterfaces";
import { postSlides } from "@/services/post/postMedia";
import { useGetPostComments, useAddPostComment } from "@/hooks/usePosts";
import { COLORS } from "@/constants/colors";
import { formatTimestamp } from "@/helper/helper";
import { useTranslate } from "@/hooks/useTranslate";

interface PostCommentProps {
  open: boolean;
  onClose: () => void;
  post: Posts;
}

const PostComment: React.FC<PostCommentProps> = ({ open, onClose, post }) => {
  const theme = useTheme();
  // The media panel only fits beside the comments from md up; below that the
  // comments (and the box to write one) get the whole dialog.
  const showMedia = useMediaQuery(theme.breakpoints.up("md"));
  const { t } = useTranslate();

  const [commentText, setCommentText] = useState("");

  const { data: commentsData, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetPostComments(post.id, 10, open);
  const addCommentMutation = useAddPostComment(post.id);

  const COMMENT_MAX = 500; // backend commentSchema max
  const authorName =
    post.user?.business_name?.trim() ||
    `${post.user?.first_name ?? ""} ${post.user?.last_name ?? ""}`.trim() ||
    post.user?.username ||
    "Kartsquare user";
  const firstSlide = postSlides(post)[0];

  const handleSubmitComment = async () => {
    const text = commentText.trim();
    if (!text || addCommentMutation.isPending) return;
    try {
      await addCommentMutation.mutateAsync(text);
      setCommentText("");
    } catch {
      // Keep the dialog and the typed text so the user can try again.
      toast.error("Couldn't post your comment. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const comments = commentsData?.pages.flatMap((page) => page.comments) || [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "90%", md: "85%", lg: "75%" },
          maxWidth: { sm: 560, md: 1100 },
          height: { xs: "100dvh", sm: "85vh" },
          maxHeight: { xs: "100dvh", sm: "90vh" },
          bgcolor: theme.palette.mode === "dark" ? "#1a1a1a" : "#fff",
          borderRadius: { xs: 0, sm: 2 },
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          outline: "none",
        }}
      >
        {/* Left Side - Post Image (Desktop and Tablet) */}
        {showMedia && firstSlide && (
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              bgcolor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {firstSlide.video ? (
              <Box
                component="video"
                src={firstSlide.url}
                poster={firstSlide.poster}
                controls
                playsInline
                preload="none"
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <Box
                component="img"
                src={firstSlide.url}
                alt={`Post by ${authorName}`}
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            )}
          </Box>
        )}

        {/* Right Side - Comments Section */}
        <Box
          sx={{
            flex: { xs: 1, md: "0 0 420px" },
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", md: 420 },
            minWidth: 0,
            minHeight: 0,
            height: "100%",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: { xs: 1.5, sm: 2 }, // Reduced padding on mobile
              borderBottom: `1px solid ${
                theme.palette.mode === "dark" ? "#333" : "#dbdbdb"
              }`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                src={post.user?.profile_pic || ""}
                alt={authorName}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {authorName}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small" aria-label="Close comments">
              <Close
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              />
            </IconButton>
          </Box>

          {/* Caption */}
          {post.caption && (
            <Box
              sx={{
                p: 2,
                maxHeight: "30%",
                overflowY: "auto",
                flexShrink: 0,
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                borderBottom: `1px solid ${
                  theme.palette.mode === "dark" ? "#333" : "#dbdbdb"
                }`,
              }}
            >
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Avatar
                  src={post.user?.profile_pic || ""}
                  alt={authorName}
                  sx={{ width: 32, height: 32 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? COLORS.TEXT.PRIMARY_DARK
                          : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                  >
                    <strong>{authorName}</strong> {post.caption}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        theme.palette.mode === "dark"
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                      mt: 0.5,
                      display: "block",
                    }}
                  >
                    {formatTimestamp(post.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Comments List */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              p: { xs: 1.5, sm: 2 },
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background:
                  theme.palette.mode === "dark" ? "#1a1a1a" : "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: theme.palette.mode === "dark" ? "#888" : "#ccc",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: theme.palette.mode === "dark" ? "#555" : "#999",
              },
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <LogoLoader size={30} />
              </Box>
            ) : comments.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 1,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    fontWeight: 600,
                  }}
                >
                  {t("noComments")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                  }}
                >
                  {t("startConversation")}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {comments.map((comment: Comment) => (
                  <Box key={comment.id} sx={{ display: "flex", gap: 1.5 }}>
                    <Avatar
                      src={comment.user_profile_pic || ""}
                      alt={comment.user_first_name}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? COLORS.TEXT.PRIMARY_DARK
                              : COLORS.TEXT.PRIMARY_LIGHT,
                          wordBreak: "break-word",
                        }}
                      >
                        <strong>
                          {comment.user_first_name} {comment.user_last_name}
                        </strong>{" "}
                        {comment.comment}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? COLORS.TEXT.SECONDARY_DARK
                              : COLORS.TEXT.SECONDARY_LIGHT,
                          mt: 0.5,
                          display: "block",
                        }}
                      >
                        {formatTimestamp(comment.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {hasNextPage && (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                    <Typography
                      variant="caption"
                      onClick={() => fetchNextPage()}
                      sx={{
                        cursor: "pointer",
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {isFetchingNextPage ? <CircularProgress size={16} /> : "Load more comments"}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Comment Input */}
          <Box
            sx={{
              p: 2,
              pb: { xs: "calc(16px + var(--safe-bottom))", sm: 2 },
              flexShrink: 0,
              borderTop: `1px solid ${
                theme.palette.mode === "dark" ? "#333" : "#dbdbdb"
              }`,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                fullWidth
                placeholder={t("commentPlaceholder")}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value.slice(0, COMMENT_MAX))}
                onKeyDown={handleKeyDown}
                slotProps={{ htmlInput: { maxLength: COMMENT_MAX, "aria-label": "Write a comment" } }}
                variant="standard"
                multiline
                maxRows={3}
                disabled={addCommentMutation.isPending}
                sx={{
                  "& .MuiInput-root": {
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    "&:before": {
                      borderBottom: "none",
                    },
                    "&:after": {
                      borderBottom: "none",
                    },
                    "&:hover:not(.Mui-disabled):before": {
                      borderBottom: "none",
                    },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                  },
                }}
              />
              <IconButton
                onClick={handleSubmitComment}
                aria-label="Post comment"
                disabled={!commentText.trim() || addCommentMutation.isPending}
                sx={{
                  color: commentText.trim()
                    ? theme.palette.primary.main
                    : theme.palette.mode === "dark"
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                }}
              >
                {addCommentMutation.isPending ? (
                  <LogoLoader size={20} />
                ) : (
                  <Send fontSize="small" />
                )}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PostComment;
