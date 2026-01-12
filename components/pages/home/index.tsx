"use client";
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Grid,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import StoriesSection from "./components/StoriesSection";
import PostCard from "./components/PostCard";
import { useProfile } from "@/hooks/useProfile";
import { useGetPosts } from "@/hooks/usePosts";

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

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
      <Grid container spacing={3}>
        {/* Left Sidebar - Blogs */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 2, md: 1 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <EmptyCard name="Latest Blogs" />
            <EmptyCard name="Events" />
          </Box>
        </Grid>

        {/* Middle Section - Stories & Feed */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Stories Section */}
            <StoriesSection />

            {/* Posts Feed */}
            {posts &&
              posts.posts.map((post: any) => (
                <PostCard post={post} key={post.id} />
              ))}
          </Box>
        </Grid>

        {/* Right Sidebar - Suggestions */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ order: { xs: 3, md: 3 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <EmptyCard name="Top Octopus" />
            <EmptyCard name="Top Suppliers" />
            <EmptyCard name="Top Brands" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default HomeView;
