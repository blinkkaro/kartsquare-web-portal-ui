"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button, useTheme } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { COLORS } from "@/constants/colors";
import { SAMPLE_EXPLORE_POSTS } from "../servicesSampleData";
import { useGetInfinitePosts, useGetReels } from "@/hooks/usePosts";
import { Visibility, Posts } from "@/services/post/postInterfaces";

interface ServicesExploreSectionProps {
  categoryName?: string;
  cityName?: string;
}

export const ServicesExploreSection: React.FC<ServicesExploreSectionProps> = ({
  categoryName = "electricians",
  cityName = "Jaipur",
}) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const { data: postsData } = useGetInfinitePosts({ limit: 6, visibility: Visibility.PUBLIC });
  const { data: reelsData } = useGetReels();

  const exploreItems = useMemo(() => {
    const liveItems: Array<{
      id: string;
      title: string;
      author: string;
      badge: string;
      image: string;
      isReel: boolean;
      link: string;
    }> = [];

    // Check live reels
    const reels: Posts[] = (reelsData?.pages.flatMap((p) => p.posts) ?? []).filter((p) => !!p.media_urls);
    reels.slice(0, 2).forEach((r) => {
      const uName =
        r.user?.business_name ||
        [r.user?.first_name, r.user?.last_name].filter(Boolean).join(" ") ||
        "Verified Pro";
      let img = "";
      if (Array.isArray(r.media_urls) && r.media_urls.length > 0) {
        img =
          typeof r.media_urls[0] === "string"
            ? r.media_urls[0]
            : (r.media_urls[0] as { url?: string })?.url || "";
      } else if (typeof r.media_urls === "string") {
        img = r.media_urls;
      }
      if (img) {
        liveItems.push({
          id: r.id || `reel-${Math.random()}`,
          title: r.caption || "Recent project demonstration",
          author: uName,
          badge: "Reel",
          image: img,
          isReel: true,
          link: "/cus/reels",
        });
      }
    });

    // Check live posts
    const posts: Posts[] = (postsData?.pages.flatMap((p) => p.posts) ?? []).filter((p) => !!p.media_urls);
    posts.slice(0, 4 - liveItems.length).forEach((p) => {
      const uName =
        p.user?.business_name ||
        [p.user?.first_name, p.user?.last_name].filter(Boolean).join(" ") ||
        "Local Pro";
      let img = "";
      if (Array.isArray(p.media_urls) && p.media_urls.length > 0) {
        img =
          typeof p.media_urls[0] === "string"
            ? p.media_urls[0]
            : (p.media_urls[0] as { url?: string })?.url || "";
      } else if (typeof p.media_urls === "string") {
        img = p.media_urls;
      }
      if (img) {
        liveItems.push({
          id: p.id || `post-${Math.random()}`,
          title: p.caption || "Completed client installation",
          author: uName,
          badge: p.user?.business_name ? "Business post" : "Customer post",
          image: img,
          isReel: p.post_type === "video",
          link: "/cus/reels",
        });
      }
    });

    // Fallback if live items are empty or fewer than 4
    if (liveItems.length < 4) {
      const needed = 4 - liveItems.length;
      return [...liveItems, ...SAMPLE_EXPLORE_POSTS.slice(0, needed)];
    }

    return liveItems.slice(0, 4);
  }, [postsData, reelsData]);

  return (
    <Box
      component="section"
      aria-label="Recent work from explore"
      sx={{
        mt: 8,
        mb: 6,
        pt: 5,
        borderTop: "1px solid",
        borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "flex-end" },
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "0.76rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: COLORS.PRIMARY_PURPLE,
              mb: 0.5,
            }}
          >
            FROM EXPLORE
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "1.35rem", sm: "1.65rem" },
              fontWeight: 800,
              letterSpacing: "-0.025em",
              color: "text.primary",
            }}
          >
            Recent work by {categoryName.toLowerCase()} near you
          </Typography>
        </Box>

        <Box
          component={Link}
          href="/cus/reels"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: "0.9rem",
            fontWeight: 700,
            color: COLORS.PRIMARY_PURPLE,
            textDecoration: "none",
            flexShrink: 0,
            "&:hover": {
              color: COLORS.PURPLE_HOVER,
              "& .explore-arrow": { transform: "translateX(3px)" },
            },
          }}
        >
          <span>Explore more</span>
          <ArrowForwardRoundedIcon
            className="explore-arrow"
            sx={{ fontSize: 16, transition: "transform 0.2s ease" }}
          />
        </Box>
      </Box>

      {/* Grid of 4 Explore Cards (Clean Editorial Style Matching Artboard) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: { xs: 2.5, lg: 3 },
        }}
      >
        {exploreItems.map((item) => (
          <Box
            key={item.id}
            component={Link}
            href={item.link}
            sx={{
              textDecoration: "none",
              display: "block",
              cursor: "pointer",
              "&:hover": {
                "& .explore-img": { transform: "scale(1.04)" },
                "& .explore-title": { color: COLORS.PRIMARY_PURPLE },
              },
            }}
          >
            {/* Image Container with rounded corners */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 260,
                borderRadius: "16px",
                overflow: "hidden",
                bgcolor: dark ? "rgba(255,255,255,0.04)" : "#f0ecf6",
                border: "1px solid",
                borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="explore-img"
                style={{
                  objectFit: "cover",
                  transition: "transform 350ms ease",
                }}
                priority={false}
              />

              {/* Video Play Pill/Icon in Top-Right for Reels */}
              {item.isReel && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: "rgba(0,0,0,0.45)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                  }}
                >
                  <PlayArrowRoundedIcon sx={{ fontSize: 20, ml: 0.15 }} />
                </Box>
              )}
            </Box>

            {/* Content below image */}
            <Box sx={{ pt: 1.5, px: 0.5 }}>
              <Typography
                className="explore-title"
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "text.primary",
                  lineHeight: 1.35,
                  mb: 0.35,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  transition: "color 0.18s ease",
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.82rem",
                  color: "text.secondary",
                  fontWeight: 500,
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.author} · {item.badge}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
