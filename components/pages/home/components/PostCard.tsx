import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
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
  const dispatch = useDispatch();

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
          flex: { md: 1 },
          minWidth: { md: 0 },
          borderRadius: 5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
            onClick={() => dispatch(openDrawer({ userId: post.user_id }))}
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
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {post.user.first_name} {post.user.last_name}
            </Typography>
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
        <Box
          sx={{
            width: "100%",
            height: { xs: "50vh", md: "60vh" },
            backgroundColor: "#000",
            borderRadius: 5,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Blurred background image */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${post.media_urls})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px)",
              transform: "scale(1.1)",
              opacity: 0.6,
            }}
          />
          {/* Dark overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
          />
          {/* Main image */}
          <CardMedia
            component="img"
            image={post.media_urls}
            alt="Post Media"
            sx={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
              maxHeight: "100%",
              position: "relative",
              zIndex: 1,
            }}
          />
        </Box>
      </Box>

      {/* bottom icons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          p: 2,
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
        ></Box>
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
