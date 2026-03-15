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
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { Close, Send } from "@mui/icons-material";
import { Posts, Comment } from "@/services/post/postInterfaces";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslate();

  const [commentText, setCommentText] = useState("");

  const { data: commentsData, isLoading } = useGetPostComments(post.id, open);
  const addCommentMutation = useAddPostComment(post.id);

  const handleSubmitComment = async () => {
    try {
      if (commentText.trim()) {
        await addCommentMutation.mutateAsync(commentText);
        setCommentText("");
      }
    } catch (error) {
      onClose();
    }

  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };

  const comments = commentsData?.comments || [];

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
          height: { xs: "100%", sm: "90%", md: "85%" },
          maxHeight: { xs: "100vh", sm: "90vh" },
          bgcolor: theme.palette.mode === "dark" ? "#1a1a1a" : "#fff",
          borderRadius: { xs: 0, sm: 2 },
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          outline: "none",
        }}
      >
        {/* Left Side - Post Image (Desktop and Tablet) */}
        {!isMobile && (
          <Box
            sx={{
              flex: { md: 1 },
              minWidth: { md: 0 },
              bgcolor: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <img
              src={post.media_urls}
              alt="Post"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        )}

        {/* Right Side - Comments Section */}
        <Box
          sx={{
            flex: 1, // Changed from flex: { md: 1 } to flex: 1 to ensure it fills height on mobile
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", md: "auto" },
            maxWidth: { md: 500 },
            minWidth: { md: 400 },
            height: "100%", // Explicitly set height to fill parent
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
                src={post.user.profile_pic || ""}
                alt={post.user.first_name}
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
                  {post.user.first_name} {post.user.last_name}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={onClose} size="small">
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
                borderBottom: `1px solid ${
                  theme.palette.mode === "dark" ? "#333" : "#dbdbdb"
                }`,
              }}
            >
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Avatar
                  src={post.user.profile_pic || ""}
                  alt={post.user.first_name}
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
                    }}
                  >
                    <strong>{post.user.first_name}</strong> {post.caption}
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
              overflowY: "auto",
              p: { xs: 1.5, sm: 2 }, // Reduced padding on mobile
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
              </Box>
            )}
          </Box>

          {/* Comment Input */}
          <Box
            sx={{
              p: 2,
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
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={handleKeyPress}
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
