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
import { useGetStories } from "@/hooks/useStories";
import CompactMapView from "./components/CompactMapView";
import { Visibility } from "@/services/post/postInterfaces";
import AdvertisementSlider from "./components/AdvertisementSlider";

function HomeView() {
  const { data: posts, isLoading } = useGetPosts({
    limit: 10,
    visibility: Visibility.PUBLIC,
  });
  const { data: stories, isLoading: storiesLoading } = useGetStories({
    page: 1,
    limit: 10,
  });
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <Box sx={{ position: "relative", maxHeight: "100vh" }}>
      <Grid container spacing={3}>
        {!isMobile && (
          /* Left Sidebar - Map & Blogs (Hidden on MD, Visible on LG) */
          <Grid
            size={{ xs: 12, lg: 3 }}
            sx={{
              order: { xs: 2, md: 1 },
              display: { xs: "none", lg: "block" }, // Hide on md, show on lg
              maxHeight: "calc(100vh - 5rem)",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Compact Map View */}
              <CompactMapView height="300px" />
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
            maxHeight: "calc(100vh - 5rem)",
            scrollbarWidth: "none",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Stories Section */}
            <StoriesSection data={stories} isLoading={storiesLoading} />

            {/* Compact Map - Mobile/Tablet View */}
            <Box
              sx={{
                display: { lg: "none", md: "block" },
              }}
            >
              <CompactMapView height="300px" />
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
              maxHeight: "calc(100vh - 5rem)",
              scrollbarWidth: "none",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <AdvertisementSlider />
              <TopSuggestions />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default HomeView;
