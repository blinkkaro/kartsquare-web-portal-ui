"use client";
import React, { useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  Grid,
  useMediaQuery,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { COLORS } from "@/constants/colors";
import HomeBanner from "./components/HomeBanner";
import CombinedFeaturedSection from "./components/CombinedFeaturedSection";
import StoriesSection from "./components/StoriesSection";
import PostCard from "./components/PostCard";
import AdCard from "./components/AdCard";
import { useGetInfinitePosts } from "@/hooks/usePosts";
import { useGetInfiniteAds } from "@/hooks/useAdvertisements";
import Blogs from "./components/Blogs";
import TopSuggestions from "./components/TopSuggestions";
import { useGetStories } from "@/hooks/useStories";
import CompactMapView from "./components/CompactMapView";
import { Posts, Visibility } from "@/services/post/postInterfaces";
import AdvertisementSlider from "./components/AdvertisementSlider";
import { AdvertiseActiveAd } from "@/services/advertise/advertise.intreface";
import { seededRandom } from "@/helper/helper";

function HomeView() {
  const {
    data: postsData,
    isLoading: postsLoading,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
  } = useGetInfinitePosts({
    limit: 10,
    visibility: Visibility.PUBLIC,
  });

  const {
    data: adsData,
    isLoading: adsLoading,
    fetchNextPage: fetchNextAds,
    hasNextPage: hasNextAds,
    isFetchingNextPage: isFetchingNextAds,
  } = useGetInfiniteAds(5);

  const { data: stories, isLoading: storiesLoading } = useGetStories({
    page: 1,
    limit: 10,
  });
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  // Ref for the loader element at the bottom
  const loaderRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          if (hasNextPosts && !isFetchingNextPosts) {
            fetchNextPosts();
          }
          // Only fetch more ads if we've used up most of our current pool
          // and we're not already fetching.
          if (
            hasNextAds &&
            !isFetchingNextAds &&
            adIndexRef.current >= allAds.length - 2
          ) {
            fetchNextAds();
          }
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [
    hasNextPosts,
    hasNextAds,
    isFetchingNextPosts,
    isFetchingNextAds,
    fetchNextPosts,
    fetchNextAds,
  ]);

  // Flatten all posts and ads from all pages
  const allPosts = postsData?.pages.flatMap((page) => page.posts) || [];
  const allAds = adsData?.pages.flatMap((page) => page.ads) || [];

  // Track how many ads have been placed
  const adIndexRef = useRef(0);

  // Merge posts and ads with random placement (5-15 posts apart)
  const mergedFeed = useMemo(() => {
    if (allPosts.length === 0) return [];

    const feed: Array<{
      type: "post" | "ad";
      data: Posts | AdvertiseActiveAd;
      key: string;
    }> = [];
    let adIndex = 0;
    const rng = seededRandom(12345); // Fixed seed for deterministic placement
    let nextAdPosition = Math.floor(rng() * 11) + 5; // seededRandom returns 0-1 like Math.random()

    allPosts.forEach((post, index) => {
      // Add post
      feed.push({ type: "post", data: post, key: `post-${post.id}` });

      // Check if we should insert an ad
      if (index + 1 === nextAdPosition && adIndex < allAds.length) {
        feed.push({
          type: "ad",
          data: allAds[adIndex],
          key: `ad-${allAds[adIndex].advertise_id}`,
        });
        adIndex++;
        // Calculate next ad position (5-15 posts from current position)
        nextAdPosition = index + 1 + Math.floor(rng() * 11) + 5;
      }
    });

    adIndexRef.current = adIndex;
    return feed;
  }, [allPosts, allAds]);

  const isLoading = postsLoading || adsLoading;
  const isFetchingNext = isFetchingNextPosts || isFetchingNextAds;

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
            {/* Banner Section */}
            <HomeBanner />

            {/* Unified Featured Categories for Services and Products */}
            {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <CombinedFeaturedSection />
            </Box> */}

            <div id="posts-feed-section">
              <StoriesSection data={stories} isLoading={storiesLoading} />
            </div>

            {/* Compact Map - Mobile/Tablet View */}
            <Box
              sx={{
                display: { lg: "none", md: "block" },
                mt: 3,
              }}
            >
              <CompactMapView height="300px" />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {mergedFeed.map((item) =>
                item.type === "post" ? (
                  <PostCard post={item.data as Posts} key={item.key} />
                ) : (
                  <AdCard ad={item.data as AdvertiseActiveAd} key={item.key} />
                )
              )}
            </Box>

            {/* Loading Indicator */}
            {(isLoading || isFetchingNext) && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 3,
                }}
              >
                <LogoLoader />
              </Box>
            )}

            {/* Intersection Observer Target */}
            <div ref={loaderRef} style={{ height: "20px" }} />
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
              <AdvertisementSlider
                ads={allAds.slice(0, 5)}
                isLoading={adsLoading}
              />
              <TopSuggestions />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default HomeView;
