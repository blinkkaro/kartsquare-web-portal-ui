"use client";
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import StoriesSection from "./components/StoriesSection";
import PostCard from "./components/PostCard";
import { useGetPosts } from "@/hooks/usePosts";
import Blogs from "./components/Blogs";
import TopSuggestions from "./components/TopSuggestions";

interface EmptyCardProps {
  name: string;
}

const EmptyCard: React.FC<EmptyCardProps> = ({ name }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: "100%",
        minHeight: 200,
        border: `1px solid`,
        borderColor: COLORS.BORDER.DEFAULT_LIGHT,
        borderRadius: 2,
        boxShadow: COLORS.SHADOW.LIGHT,
        transition: "all 0.3s ease",
        bgcolor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

function HomeView() {
  const { data: posts, isLoading } = useGetPosts({
    limit: 10,
    visibility: "public",
  });
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <Box sx={{ position: "relative", maxHeight: "100vh" }}>
      <Grid container spacing={3}>
        {!isMobile && (
          /* Left Sidebar - Blogs (Hidden on MD, Visible on LG) */
          <Grid
            size={{ xs: 12, lg: 3 }}
            sx={{
              order: { xs: 2, md: 1 },
              display: { xs: "none", lg: "block" }, // Hide on md, show on lg
              maxHeight: "calc(100vh - 4.8rem)",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <EmptyCard name="Map" />
              <Blogs />
            </Box>
          </Grid>
        )}

        {/* Middle Section - Stories & Feed */}
        <Grid
          size={{ xs: 12, md: 8, lg: 6 }}
          sx={{
            order: { xs: 1, md: 2 },
            overflowY: "auto",
            maxHeight: "calc(100vh - 4.8rem)",
            scrollbarWidth: "none",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Stories Section */}
            <StoriesSection />
            <Box
              sx={{
                flexDirection: "column",
                gap: 3,
                display: { lg: "none", md: "block" },
              }}
            >
              <EmptyCard name="Map" />
            </Box>

            {/* Posts Feed */}
            {posts &&
              posts.posts.map((post: any) => (
                <PostCard post={post} key={post.id} />
              ))}
          </Box>
        </Grid>

        {!isMobile && (
          /* Right Sidebar - Suggestions */
          <Grid
            size={{ xs: 12, md: 4, lg: 3 }}
            sx={{
              order: { xs: 3, md: 3 },
              overflowY: "auto",
              maxHeight: "calc(100vh - 4.8rem)",
              scrollbarWidth: "none",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TopSuggestions />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default HomeView;
