import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Typography,
  useTheme,
} from "@mui/material";
import { Posts } from "@/services/post/postInterfaces";
import {
  BookmarkBorder,
  Close,
  FavoriteBorderOutlined,
  Favorite,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import Image from "next/image";
import { useTranslate } from "@/hooks/useTranslate";
import { useLikePost } from "@/hooks/usePosts";
import PostComment from "./PostComment";

const PostCard = ({ post }: { post: Posts }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { t } = useTranslate();

  const likeMutation = useLikePost(post.id);

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleOpenComments = () => {
    setIsCommentModalOpen(true);
  };

  return (
    <Card sx={{ boxShadow: "none", background: "transparent" }}>
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          gap: { md: 2 },
          position: "relative",
          flexDirection: "column"
        }}
      >
        <Box
          sx={{
            flex: { md: 1 },
            minWidth: { md: 0 },
            borderRadius: 5,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <CardMedia
            component="img"
            height="40rem"
            image={post.media_urls}
            alt="Post Media"
            sx={{
              objectFit: "cover",
              width: "100%",
              height: { xs: "50vh", md: "70vh", lg: "80vh" },
            }}
          />

          {/* Top icons (Close & Bookmark) - Visible on small screens */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              position: "absolute",
              top: 16,
              right: 16,
              gap: 1,
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Close
                sx={{
                  fontSize: 24,
                  color: COLORS.TEXT.PRIMARY_DARK,
                }}
              />
            </Box>
            <Box
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <BookmarkBorder
                sx={{
                  fontSize: 24,
                  color: COLORS.TEXT.PRIMARY_DARK,
                }}
              />
            </Box>
          </Box>

          {/* Bottom icons (Like, Comment, Share, Profile) - Visible on small screens */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              position: "absolute",
              bottom: 16,
              right: 16,
              gap: 2,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              onClick={handleLike}
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {post.is_liked ? (
                <Favorite
                  sx={{
                    fontSize: 24,
                    color: "#ff0042",
                  }}
                />
              ) : (
                <FavoriteBorderOutlined
                  sx={{
                    fontSize: 24,
                    color: COLORS.TEXT.PRIMARY_DARK,
                  }}
                />
              )}
              {post.likes_count > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    bottom: -18,
                    fontSize: "0.7rem",
                    color: COLORS.TEXT.PRIMARY_DARK,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    px: 0.5,
                    borderRadius: 1,
                    fontWeight: 600,
                  }}
                >
                  {post.likes_count}
                </Typography>
              )}
            </Box>
            <Box
              onClick={handleOpenComments}
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <Image
                src="/icons/darkThemeChat.svg"
                alt="comment"
                width={20}
                height={20}
              />
              {post.comments_count > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    bottom: -18,
                    fontSize: "0.7rem",
                    color: COLORS.TEXT.PRIMARY_DARK,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    px: 0.5,
                    borderRadius: 1,
                    fontWeight: 600,
                  }}
                >
                  {post.comments_count}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Image
                src="/icons/darkThemeShare.svg"
                alt="share"
                width={20}
                height={20}
              />
            </Box>
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Avatar
                sx={{
                  cursor: "pointer",
                  width: 40,
                  height: 40,
                  border: "2px solid white",
                }}
                src={post.user.profile_pic || ""}
                alt={post.user.first_name}
              />
              <Typography
                variant="caption"
                sx={{
                  color: COLORS.TEXT.PRIMARY_DARK,
                  fontSize: "0.65rem",
                  maxWidth: 50,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  px: 0.5,
                  borderRadius: 1,
                }}
              >
                {post.user.first_name}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right sidebar icons - Visible on large screens */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 2,
            justifyContent: "space-between",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Close
              sx={{
                cursor: "pointer",
                fontSize: 30,
                color:
                  theme.palette.mode === "dark"
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            />
            <BookmarkBorder
              sx={{
                cursor: "pointer",
                fontSize: 30,
                color:
                  theme.palette.mode === "dark"
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              onClick={handleLike}
              sx={{ cursor: "pointer", position: "relative" }}
            >
              {post.is_liked ? (
                <Favorite
                  sx={{
                    cursor: "pointer",
                    fontSize: 30,
                    color: "#ff0042",
                  }}
                />
              ) : (
                <FavoriteBorderOutlined
                  sx={{
                    cursor: "pointer",
                    fontSize: 30,
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                />
              )}
              {post.likes_count > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "0.75rem",
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    fontWeight: 600,
                  }}
                >
                  {post.likes_count}
                </Typography>
              )}
            </Box>
            <Box
              onClick={handleOpenComments}
              sx={{ cursor: "pointer", position: "relative" }}
            >
              <Image
                src={
                  theme.palette.mode === "dark"
                    ? "/icons/darkThemeChat.svg"
                    : "/icons/chat.svg"
                }
                alt="comment"
                width={25}
                height={25}
              />
              {post.comments_count > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "0.75rem",
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    fontWeight: 600,
                  }}
                >
                  {post.comments_count}
                </Typography>
              )}
            </Box>
            <Box sx={{ cursor: "pointer" }}>
              <Image
                src={
                  theme.palette.mode === "dark"
                    ? "/icons/darkThemeShare.svg"
                    : "/icons/share.svg"
                }
                alt="share"
                width={25}
                height={25}
              />
            </Box>
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Avatar
                sx={{
                  cursor: "pointer",
                  width: 40,
                  height: 40,
                }}
                src={post.user.profile_pic || ""}
                alt={post.user.first_name}
              />
              <Typography
                variant="caption"
                sx={{
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  fontSize: "0.65rem",
                  maxWidth: 50,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {post.user.first_name}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {post.caption && (
        <Box sx={{ mt: 2, px: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: isExpanded ? "unset" : 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.5,
            }}
          >
            {post.caption}
          </Typography>
          {post.caption.length > 100 && (
            <Typography
              variant="body2"
              component="span"
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                cursor: "pointer",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {isExpanded ? t("less") : t("more")}
            </Typography>
          )}
        </Box>
      )}

      {/* Comment Modal */}
      <PostComment
        open={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post={post}
      />
    </Card>
  );
};

export default PostCard;
