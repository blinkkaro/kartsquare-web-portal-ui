import React from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Typography,
  useTheme,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import Link from "next/link";
import { useTranslate } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";
import router from "next/router";
import { blogs } from "@/data/blogs";

interface BlogData {
  id: string;
  slug?: string;
  image: string;
  date: string;
  title: string;
  description: string;
}

const BlogCard = ({ blog }: { blog: BlogData }) => {
  const theme = useTheme();
  const { t } = useTranslate();

  return (
    <Card
      sx={{
        display: "flex",
        gap: 2,
        p: 1.5,
        mb: 2,
        ":hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.LIGHT_GRAY,
        borderRadius: 2,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 12px rgba(0,0,0,0.6)"
            : "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Blog Image */}
      <Box
        sx={{
          width: 80,
          height: 80,
          flexShrink: 0,
          borderRadius: 2,
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          image={blog.image}
          alt={blog.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Blog Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {/* <Typography
          variant="caption"
          sx={{
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
            fontSize: "0.75rem",
          }}
        >
          {blog.date}
        </Typography> */}
        <Typography
          variant="subtitle2"
          sx={{
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            fontWeight: 700,
            fontSize: "0.9rem",
            lineHeight: 1.2,
            display: "-webkit-box",

            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {blog.title}
        </Typography>
        {/* <Typography
          variant="body2"
          sx={{
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
            fontSize: "0.75rem",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            mb: 0.5,
          }}
        >
          {blog.description}
        </Typography> */}
        <Link
          href={`/blogs/${blog.slug || blog.id}`}
          passHref
          style={{ textDecoration: "none" }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.mode === "dark" ? "#BDBDBD" : "#757575",
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
              pb: 2,
              // borderBottom: `1px solid #757575`,
            }}
          >
            {t("readmore")}
          </Typography>
        </Link>
      </Box>
    </Card>
  );
};

const Blogs = () => {
  const theme = useTheme();
  const { t } = useTranslate();
  const router = useRouter();

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,

        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 4px 12px rgba(0,0,0,0.6)"
            : "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        sx={{
          color:
            theme.palette.mode === "dark"
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          fontWeight: 600,
          mb: 3,
        }}
      >
        {t("home_latest_blogs_title")}
      </Typography>

      {/* Blog Cards */}
      {/* <Box> */}
      {blogs.slice(0, 2).map((blog) => (
        <BlogCard
          key={blog.id}
          blog={{
            id: blog.id,
            slug: blog.slug,
            image: blog.coverImage,
            date: blog.date,
            title: blog.title,
            description: blog.description,
          }}
        />
      ))}
      {/* </Box> */}

      {/* See All Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          onClick={() => router.push("/blogs")}
          variant="outlined"
          sx={{
            borderRadius: 20,
            px: 2,
            py: 1,
            textTransform: "none",

            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            "&:hover": {
              backgroundColor: COLORS.PURPLE_ALPHA_04,
            },
          }}
        >
          {t("seeall")}
        </Button>
      </Box>
    </Box>
  );
};

export default Blogs;
