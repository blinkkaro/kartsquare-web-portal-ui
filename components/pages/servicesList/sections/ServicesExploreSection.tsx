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
          mb: 3.5,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: "0.74rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: COLORS.PRIMARY_PURPLE,
              mb: 0.5,
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
            <span>From Explore</span>
          </Box>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "1.3rem", sm: "1.6rem" },
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "text.primary",
            }}
          >
            Recent work by {categoryName} near you
          </Typography>
          <Typography sx={{ fontSize: "0.88rem", color: "text.secondary", mt: 0.5 }}>
            Real photos and reels shared by verified service providers and customers{" "}
            {cityName ? `in ${cityName}` : ""}.
          </Typography>
        </Box>

        <Box
          component={Link}
          href="/cus/reels"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: "0.86rem",
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
          <span>Explore all reels & posts</span>
          <ArrowForwardRoundedIcon
            className="explore-arrow"
            sx={{ fontSize: 16, transition: "transform 0.2s ease" }}
          />
        </Box>
      </Box>

      {/* Grid of 4 Explore Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2.5,
        }}
      >
        {exploreItems.map((item) => (
          <Box
            key={item.id}
            component={Link}
            href={item.link}
            sx={{
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
              boxShadow: dark ? "0 4px 16px rgba(0,0,0,0.25)" : "0 2px 10px rgba(0,0,0,0.04)",
              transition: "transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease",
              textDecoration: "none",
              display: "block",
              "&:hover": {
                transform: "translateY(-4px)",
                borderColor: dark ? "rgba(130,72,247,0.4)" : "#d6cbef",
                boxShadow: dark ? "0 10px 24px rgba(0,0,0,0.4)" : "0 10px 24px rgba(105,39,218,0.12)",
                "& .explore-img": { transform: "scale(1.05)" },
                "& .explore-play": { opacity: 1, transform: "scale(1.08)" },
              },
            }}
          >
            {/* Image / Thumbnail Container */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 280,
                overflow: "hidden",
                bgcolor: dark ? "rgba(255,255,255,0.04)" : "#f0ecf6",
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
                  transition: "transform 400ms ease",
                }}
                priority={false}
              />

              {/* Gradient Dark Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)",
                }}
              />

              {/* Badge */}
              <Box sx={{ position: "absolute", top: 12, left: 12 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    bgcolor:
                      item.badge === "Reel"
                        ? "rgba(239, 68, 68, 0.92)"
                        : item.badge === "Customer post"
                        ? "rgba(245, 158, 11, 0.92)"
                        : "rgba(255, 255, 255, 0.92)",
                    color:
                      item.badge === "Reel" || item.badge === "Customer post"
                        ? "#ffffff"
                        : "#1f1c2b",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  {item.badge === "Reel" ? (
                    <PlayArrowRoundedIcon sx={{ fontSize: 13 }} />
                  ) : item.badge === "Customer post" ? (
                    <VerifiedUserRoundedIcon sx={{ fontSize: 13 }} />
                  ) : (
                    <CheckCircleRoundedIcon sx={{ fontSize: 13, color: COLORS.PRIMARY_PURPLE }} />
                  )}
                  {item.badge}
                </Box>
              </Box>

              {/* Center Play Button on Hover if Reel */}
              {item.isReel && (
                <Box
                  className="explore-play"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 200ms ease, transform 200ms ease",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.3)",
                      backdropFilter: "blur(8px)",
                      border: "1.5px solid rgba(255,255,255,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                    }}
                  >
                    <PlayArrowRoundedIcon sx={{ fontSize: 24, ml: 0.25 }} />
                  </Box>
                </Box>
              )}

              {/* Bottom Content */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  color: "#fff",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    lineHeight: 1.35,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.85)",
                    mt: 0.5,
                    fontWeight: 500,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.author}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
