"use client";
import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import { COLORS } from "@/constants/colors";
import { useGetInfinitePosts, useGetReels } from "@/hooks/usePosts";
import { ShimmerBox } from "./HomeLoading";
import { Visibility, Posts } from "@/services/post/postInterfaces";
import { Section, sectionTitleSx, sectionSubtitleSx } from "./shared";
import { HOME_PHOTOS } from "./homePhotos";

interface DiscoverItem {
  id: string;
  badge: "Portfolio" | "Reel" | "Project" | "Local business" | "Look" | "Showcase";
  title: string;
  subtitle: string;
  category: "home" | "beauty" | "photo" | "reels" | "business";
  image: string;
  isReel?: boolean;
  link: string;
}

const getMediaUrl = (media: any): string => {
  if (Array.isArray(media) && media.length > 0) {
    return media[0];
  }
  if (typeof media === "string" && media.length > 0) {
    return media;
  }
  return HOME_PHOTOS.weddingPortrait.src;
};

const categorizePost = (caption?: string | null, postType?: string | null): "home" | "beauty" | "photo" | "reels" | "business" => {
  if (postType === "video") return "reels";
  const c = (caption || "").toLowerCase();
  if (/photo|shoot|wedding|portrait|lens|cam/i.test(c)) return "photo";
  if (/beauty|salon|hair|spa|makeup|bridal|groom|facial/i.test(c)) return "beauty";
  if (/clean|plumb|electric|ac|repair|home|renov|paint|carpenter/i.test(c)) return "home";
  return "business";
};

const TABS = [
  { id: "all", label: "All" },
  { id: "home", label: "Home projects" },
  { id: "beauty", label: "Beauty & salon" },
  { id: "photo", label: "Photography" },
  { id: "reels", label: "Reels" },
  { id: "business", label: "Local businesses" },
] as const;

export default function NewDiscoverSection() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const [activeTab, setActiveTab] = useState<string>("all");
  const trackRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    setSlide(0);
  }, [activeTab]);
  const onTrackScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || !el.firstElementChild) return;
    setSlide(Math.round(el.scrollLeft / ((el.firstElementChild as HTMLElement).offsetWidth + 12)));
  }, []);

  const { data: postsData, isLoading: postsLoading } = useGetInfinitePosts({ limit: 4, visibility: Visibility.PUBLIC });
  const { data: reelsData, isLoading: reelsLoading } = useGetReels();
  const loading = postsLoading || reelsLoading;

  const rawPosts: Posts[] = useMemo(
    () => (postsData?.pages.flatMap((p) => p.posts) ?? []).filter((p) => !!p.media_urls),
    [postsData]
  );

  const rawReels: Posts[] = useMemo(
    () => (reelsData?.pages.flatMap((p) => p.posts) ?? []).filter((p) => !!p.media_urls),
    [reelsData]
  );

  const items: DiscoverItem[] = useMemo(() => {
    const combined: DiscoverItem[] = [];

    // Map reels first (max 4)
    rawReels.slice(0, 4).forEach((r, idx) => {
      const uName = r.user?.business_name || [r.user?.first_name, r.user?.last_name].filter(Boolean).join(" ");
      combined.push({
        id: r.id || `reel-${idx}`,
        badge: "Reel",
        title: r.caption || "Service in action",
        subtitle: uName ? `${uName} · Reel` : "Kartsquare Reel",
        category: "reels",
        image: getMediaUrl(r.media_urls),
        isReel: true,
        link: "/cus/reels",
      });
    });

    // Map image posts (max 4)
    rawPosts.slice(0, 4).forEach((p, idx) => {
      const uName = p.user?.business_name || [p.user?.first_name, p.user?.last_name].filter(Boolean).join(" ");
      const cat = categorizePost(p.caption, p.post_type);
      const badgeType: DiscoverItem["badge"] =
        cat === "photo" ? "Portfolio" : cat === "beauty" ? "Look" : cat === "home" ? "Project" : "Local business";

      combined.push({
        id: p.id || `post-${idx}`,
        badge: badgeType,
        title: p.caption || "Verified service highlight",
        subtitle: uName ? `${uName} · Professional` : "Kartsquare Pro",
        category: cat,
        image: getMediaUrl(p.media_urls),
        isReel: p.post_type === "video",
        link: "/cus/reels",
      });
    });

    // Real posts and reels only; never made-up items.
    return combined.slice(0, 8);
  }, [rawPosts, rawReels]);

  const filteredItems = useMemo(() => {
    if (activeTab === "all") return items;
    return items.filter((item) => item.category === activeTab);
  }, [items, activeTab]);

  // Loaded, and there is nothing real to show: hide the section rather than invent one.
  if (!loading && items.length === 0) return null;

  return (
    <Section id="discover" sx={{ py: { xs: 3.5, md: 7 }, px: 0 }}>
      {/* Header with pill tag */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 0.5,
            borderRadius: 99,
            bgcolor: COLORS.PURPLE_ALPHA_10,
            color: COLORS.PRIMARY_PURPLE,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            mb: 1.25,
          }}
        >
          <ExploreRoundedIcon sx={{ fontSize: 16 }} />
          EXPLORE
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "flex-end" }, justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ maxWidth: 640 }}>
            <Typography component="h2" sx={{ ...sectionTitleSx, color: "text.primary" }}>
              Discover what&apos;s happening around you
            </Typography>
            <Typography sx={sectionSubtitleSx}>
              Explore local businesses, inspiring projects, and real work from professionals near you.
            </Typography>
          </Box>

          <Box
            component={Link}
            href="/cus/reels"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              alignItems: "center",
              gap: 0.75,
              px: 2.25,
              py: 1,
              borderRadius: 99,
              border: "1.5px solid",
              borderColor: dark ? "rgba(255,255,255,0.2)" : "#d6d0e0",
              color: "text.primary",
              fontWeight: 700,
              fontSize: "0.88rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "all 160ms ease",
              "&:hover": {
                borderColor: COLORS.PRIMARY_PURPLE,
                color: COLORS.PRIMARY_PURPLE,
                bgcolor: COLORS.PURPLE_ALPHA_04,
              },
            }}
          >
            Explore more
            <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
          </Box>
        </Box>
      </Box>

      {/* Filter Tabs */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          pb: 2,
          mb: 1.5,
          mx: { xs: -1.5, sm: 0 },
          px: { xs: 1.5, sm: 0 },
          scrollSnapType: "x proximity",
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Box
              key={tab.id}
              component="button"
              type="button"
              onClick={() => setActiveTab(tab.id)}
              sx={{
                px: 2.25,
                py: 0.85,
                minHeight: 38,
                flexShrink: 0,
                scrollSnapAlign: "start",
                borderRadius: 99,
                border: "1px solid",
                borderColor: isActive
                  ? COLORS.PRIMARY_PURPLE
                  : dark
                  ? "rgba(255,255,255,0.12)"
                  : "#e5e0ec",
                bgcolor: isActive
                  ? dark
                    ? "#fff"
                    : "#1c1924"
                  : "transparent",
                color: isActive
                  ? dark
                    ? "#1c1924"
                    : "#fff"
                  : "text.secondary",
                fontSize: "0.85rem",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 160ms ease",
                "&:hover": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                  color: isActive ? undefined : COLORS.PRIMARY_PURPLE,
                },
              }}
            >
              {tab.label}
            </Box>
          );
        })}
      </Box>

      {/* Mosaic Gallery Grid */}
      <Box
        ref={trackRef}
        onScroll={onTrackScroll}
        sx={{
          display: { xs: "flex", sm: "grid" },
          gridTemplateColumns: { sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: { xs: 1.5, md: 2 },
          // Mobile: swipeable story-style cards, next one peeks in
          overflowX: { xs: "auto", sm: "visible" },
          scrollSnapType: { xs: "x mandatory", sm: "none" },
          scrollPaddingLeft: { xs: "12px", sm: 0 },
          overscrollBehaviorX: "contain",
          mx: { xs: -1.5, sm: 0 },
          px: { xs: 1.5, sm: 0 },
          pb: { xs: 1, sm: 0 },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          "& > a": {
            flex: { xs: "0 0 66%", sm: "initial" },
            scrollSnapAlign: { xs: "start", sm: "none" },
          },
          "@supports (animation-timeline: view())": {
            "& > a": {
              "@media (max-width: 599.95px)": {
                animation: "ks-card-reveal linear both",
                animationTimeline: "view(inline)",
                animationRange: "entry 0% entry 60%",
              },
            },
          },
          "@media (prefers-reduced-motion: reduce)": { "& > a": { animation: "none !important" } },
        }}
      >
        {loading &&
          [0, 1, 2, 3].map((i) => (
            <ShimmerBox
              key={`skeleton-${i}`}
              sx={{ flex: { xs: "0 0 66%", sm: "initial" }, height: { xs: 330, sm: i === 0 ? 260 : 240, md: 340 }, borderRadius: { xs: 3, md: 4 } }}
            />
          ))}
        {(loading ? [] : filteredItems).map((item, index) => {
          const isLarge = index === 0;
          return (
            <Box
              key={item.id}
              component={Link}
              href={item.link}
              sx={{
                position: "relative",
                display: "block",
                borderRadius: { xs: 3, md: 4 },
                overflow: "hidden",
                textDecoration: "none",
                bgcolor: COLORS.PURPLE_ALPHA_10,
                height: isLarge ? { xs: 330, sm: 260, md: 340 } : { xs: 330, sm: 240, md: 340 },
                boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.06)",
                transition: "transform 180ms ease, box-shadow 180ms ease",
                userSelect: "none",
                WebkitTapHighlightColor: "transparent",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: dark ? "0 12px 30px rgba(0,0,0,0.45)" : "0 12px 30px rgba(105,39,218,0.18)",
                  "& .media-img": { transform: "scale(1.06)" },
                  "& .play-btn": { transform: "translate(-50%, -50%) scale(1.1)" },
                },
                "&:active": {
                  transform: "scale(0.96)",
                },
              }}
            >
              {/* Image */}
              <Box
                component="img"
                className="media-img"
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = HOME_PHOTOS.weddingPortrait.src;
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 500ms cubic-bezier(.2,.7,.2,1)",
                }}
              />

              {/* Gradient Overlay for Bottom Text */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)",
                }}
              />

              {/* Top-Left Pill Badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: 10, md: 14 },
                  left: { xs: 10, md: 14 },
                  px: { xs: 1, md: 1.25 },
                  py: 0.35,
                  borderRadius: 99,
                  bgcolor: "rgba(255,255,255,0.92)",
                  color: "#1c1924",
                  fontSize: { xs: "0.75rem", md: "0.75rem" },
                  fontWeight: 700,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                {item.badge}
              </Box>

              {/* Center Play Button for Reel */}
              {item.isReel && (
                <Box
                  className="play-btn"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: 38, md: 48 },
                    height: { xs: 38, md: 48 },
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.95)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                    transition: "transform 200ms ease",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.8)",
                      animation: "ks-ping 2s ease-out infinite",
                    },
                  }}
                >
                  <PlayArrowRoundedIcon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: { xs: 22, md: 28 }, ml: 0.2 }} />
                </Box>
              )}

              {/* Bottom Text Content */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: { xs: 10, md: 14 },
                  left: { xs: 10, md: 14 },
                  right: { xs: 10, md: 14 },
                }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "0.92rem", md: "1.05rem" },
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                    mb: 0.3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: { xs: "0.76rem", md: "0.78rem" },
                    fontWeight: 500,
                  }}
                  noWrap
                >
                  {item.subtitle}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Mobile only: slide dots + full-width CTA */}
      <Box sx={{ display: { xs: "block", sm: "none" }, mt: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75, mb: 2 }}>
          {filteredItems.map((item, i) => (
            <Box
              key={item.id}
              sx={{
                height: 6,
                width: i === slide ? 18 : 6,
                borderRadius: 3,
                bgcolor: i === slide ? COLORS.PRIMARY_PURPLE : dark ? "rgba(255,255,255,0.25)" : "#d6d0e0",
                transition: "width 250ms ease, background-color 250ms ease",
              }}
            />
          ))}
        </Box>
        <Box
          component={Link}
          href="/cus/reels"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            minHeight: 48,
            borderRadius: 3,
            bgcolor: COLORS.PRIMARY_PURPLE,
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.92rem",
            textDecoration: "none",
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          Watch all reels &amp; posts
          <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Section>
  );
}
