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

interface BlogData {
  id: number;
  image: string;
  date: string;
  title: string;
  description: string;
}

// Dummy blog data
const DUMMY_BLOGS: BlogData[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    date: "Sep 28, 2024",
    title: "The Ultimate Guide to Fall Fashion Trends",
    description:
      "Discover the top color palettes and layering techniques defining this season's wardrobe essentials.",
  },
];

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
        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
        borderRadius: 2,
        boxShadow: "none",
      }}
    >
      {/* Blog Image */}
      <Box
        sx={{
          width: 80,
          height: 80,
          flexShrink: 0,
          borderRadius: 2,
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
        <Typography
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
        </Typography>
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
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {blog.title}
        </Typography>
        <Typography
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
        </Typography>
        <Link
          href={`/blog/${blog.id}`}
          passHref
          style={{ textDecoration: "none" }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              fontSize: "0.85rem",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
              pb: 2,
              borderBottom: `1px solid ${COLORS.BORDER.DEFAULT_DARK}`,
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

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,

        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
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
          fontSize: "1.1rem",
        }}
      >
        Latest Blogs
      </Typography>

      {/* Blog Cards */}
      <Box>
        {DUMMY_BLOGS.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </Box>

      {/* See All Button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="outlined"
          sx={{
            borderRadius: 20,
            px: 2,
            py: 1,
            textTransform: "none",
            borderColor:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              backgroundColor: "rgba(0, 0, 0, 0.05)",
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
