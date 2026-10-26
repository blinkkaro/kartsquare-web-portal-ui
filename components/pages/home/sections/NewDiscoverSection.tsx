"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Box, Typography, Chip, useTheme } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import { COLORS } from "@/constants/colors";
import { useGetInfinitePosts, useGetReels } from "@/hooks/usePosts";
import { Visibility, Posts } from "@/services/post/postInterfaces";
import { Section } from "./shared";
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

const DUMMY_DISCOVER_ITEMS: DiscoverItem[] = [
  {
    id: "disc-1",
    badge: "Portfolio",
    title: "Wedding moments captured",
    subtitle: "Royal Lens Studio · Photography",
    category: "photo",
    image: HOME_PHOTOS.weddingPortrait.src,
    link: "/cus/reels",
  },
  {
    id: "disc-2",
    badge: "Reel",
    title: "Hair spa, start to finish",
    subtitle: "Bliss Beauty Lounge · Beauty & salon",
    category: "reels",
    image: HOME_PHOTOS.salonHairSpa.src,
    isReel: true,
    link: "/cus/reels",
  },
  {
    id: "disc-3",
    badge: "Project",
    title: "Sink trap replaced in under an hour",
    subtitle: "Rapid Plumbing · Plumbing",
    category: "home",
    image: HOME_PHOTOS.plumberSink.src,
    link: "/cus/reels",
  },
  {
    id: "disc-4",
    badge: "Local business",
    title: "Forty years behind the chair",
    subtitle: "Heritage Barber Shop · Barber",
    category: "business",
    image: HOME_PHOTOS.barber.src,
    link: "/cus/reels",
  },
  {
    id: "disc-5",
    badge: "Look",
    title: "Classic red bridal look",
    subtitle: "Shringaar Makeovers · Bridal makeup",
    category: "beauty",
    image: HOME_PHOTOS.bridalRed.src,
    link: "/cus/reels",
  },
  {
    id: "disc-6",
    badge: "Project",
    title: "Panel rewiring, done safely",
    subtitle: "Current Master · Electrician",
    category: "home",
    image: HOME_PHOTOS.electricianPanel.src,
    link: "/cus/reels",
  },
  {
    id: "disc-7",
    badge: "Showcase",
    title: "A calm new studio in town",
    subtitle: "Aura Salon · Salon",
    category: "beauty",
    image: HOME_PHOTOS.salonStudio.src,
    link: "/cus/reels",
  },
  {
    id: "disc-8",
    badge: "Local business",
    title: "Late-night trims in the old market",
    subtitle: "Old City Barbers · Barber",
    category: "business",
    image: HOME_PHOTOS.barbershopLamp.src,
    link: "/cus/reels",
  },
];

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

  const { data: postsData } = useGetInfinitePosts({ limit: 12, visibility: Visibility.PUBLIC });
  const { data: reelsData } = useGetReels();

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

    // Map reels first
    rawReels.forEach((r, idx) => {
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

    // Map image posts
    rawPosts.forEach((p, idx) => {
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

    // If combined has enough items, return them. Otherwise, augment with dummy items
    if (combined.length >= 8) {
      return combined.slice(0, 12);
    }

    // Append dummy items not already covered
    return [...combined, ...DUMMY_DISCOVER_ITEMS].slice(0, 8);
  }, [rawPosts, rawReels]);

  const filteredItems = useMemo(() => {
    if (activeTab === "all") return items;
    const matched = items.filter((item) => item.category === activeTab);
    if (matched.length > 0) return matched;
    // Fallback to dummy items for this tab if API had no matching category posts
    return DUMMY_DISCOVER_ITEMS.filter((item) => item.category === activeTab);
  }, [items, activeTab]);

  return (
    <Section id="discover" sx={{ py: { xs: 4, md: 7 }, px: { xs: 2, md: 0 } }}>
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
            fontWeight: 800,
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
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.45rem", sm: "1.85rem", md: "2.1rem" },
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                color: "text.primary",
                mb: 1,
              }}
            >
              Discover what&apos;s happening around you
            </Typography>
            <Typography sx={{ fontSize: { xs: "0.88rem", md: "0.98rem" }, color: "text.secondary", lineHeight: 1.5 }}>
              Explore local businesses, inspiring projects, and real work from professionals near you.
            </Typography>
          </Box>

          <Box
            component={Link}
            href="/cus/reels"
            sx={{
              display: "inline-flex",
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
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        {filteredItems.map((item, index) => {
          const isLarge = index === 0;
          return (
            <Box
              key={item.id}
              component={Link}
              href={item.link}
              sx={{
                position: "relative",
                display: "block",
                borderRadius: 4,
                overflow: "hidden",
                textDecoration: "none",
                bgcolor: COLORS.PURPLE_ALPHA_10,
                height: isLarge ? { xs: 260, md: 340 } : { xs: 240, md: 340 },
                boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.06)",
                transition: "transform 220ms ease, box-shadow 220ms ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: dark ? "0 12px 30px rgba(0,0,0,0.45)" : "0 12px 30px rgba(105,39,218,0.18)",
                  "& .media-img": { transform: "scale(1.06)" },
                  "& .play-btn": { transform: "translate(-50%, -50%) scale(1.1)" },
                },
              }}
            >
              {/* Image */}
              <Box
                component="img"
                className="media-img"
                src={item.image}
                alt={item.title}
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
                  top: 14,
                  left: 14,
                  px: 1.25,
                  py: 0.4,
                  borderRadius: 99,
                  bgcolor: "rgba(255,255,255,0.92)",
                  color: "#1c1924",
                  fontSize: "0.72rem",
                  fontWeight: 800,
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
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.95)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                    transition: "transform 200ms ease",
                  }}
                >
                  <PlayArrowRoundedIcon sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 28, ml: 0.25 }} />
                </Box>
              )}

              {/* Bottom Text Content */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 14,
                  left: 14,
                  right: 14,
                }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: { xs: "0.98rem", md: "1.08rem" },
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                    mb: 0.4,
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
                    fontSize: "0.78rem",
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
    </Section>
  );
}
