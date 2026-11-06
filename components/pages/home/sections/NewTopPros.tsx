"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Box, Typography, Button, Skeleton, useTheme } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { COLORS } from "@/constants/colors";
import { useTopSuggestions } from "@/hooks/useTopSuggestions";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { useAppDispatch } from "@/store/hooks";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { TopService } from "@/services/topSuppliers/topSupplires.interfaces";
import { Section, SectionHeader } from "./shared";
import { HOME_PHOTOS } from "./homePhotos";

/** Dummy top pros used when the API returns no results */
const DUMMY_TOP_PROS = [
  {
    id: "dummy-pro-1",
    name: "Sharma Electricals & AC Care",
    category_name: ["Electrician", "AC Repair"],
    provider_id: "prov-1",
    provider_first_name: "Ramesh",
    provider_last_name: "Sharma",
    rating: "4.9",
    review_count: "128",
    price: "299",
    city_town: "Vaishali Nagar, Jaipur",
    image_url: HOME_PHOTOS.electricianHero.src,
    is_new: false,
    verified: true,
  },
  {
    id: "dummy-pro-2",
    name: "Glamour Bride Studio & Salon",
    category_name: ["Beauty & Salon"],
    provider_id: "prov-2",
    provider_first_name: "Pooja",
    provider_last_name: "Verma",
    rating: "4.8",
    review_count: "94",
    price: "999",
    city_town: "C-Scheme, Jaipur",
    image_url: HOME_PHOTOS.bridalMakeup.src,
    is_new: true,
    verified: true,
  },
  {
    id: "dummy-pro-3",
    name: "Sparkle Clean Home Solutions",
    category_name: ["Home Cleaning"],
    provider_id: "prov-3",
    provider_first_name: "Sunil",
    provider_last_name: "Kumar",
    rating: "4.9",
    review_count: "215",
    price: "499",
    city_town: "Mansarovar, Jaipur",
    image_url: HOME_PHOTOS.homeCleaning.src,
    is_new: false,
    verified: true,
  },
  {
    id: "dummy-pro-4",
    name: "Apex Plumbing & Sanitations",
    category_name: ["Plumbing"],
    provider_id: "prov-4",
    provider_first_name: "Mahesh",
    provider_last_name: "Saini",
    rating: "4.7",
    review_count: "76",
    price: "199",
    city_town: "Malviya Nagar, Jaipur",
    image_url: HOME_PHOTOS.plumberSink.src,
    is_new: false,
    verified: true,
  },
];

// Mobile: horizontal snap slider (next card peeks). sm+: regular grid.
const cardTrack = {
  display: { xs: "flex", sm: "grid" },
  gridTemplateColumns: { sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
  gap: { xs: 1.5, md: 2.5 },
  overflowX: { xs: "auto", sm: "visible" },
  scrollSnapType: { xs: "x mandatory", sm: "none" },
  scrollPaddingLeft: { xs: "16px", sm: 0 },
  WebkitOverflowScrolling: "touch",
  overscrollBehaviorX: "contain",
  mx: { xs: -1.5, sm: 0 },
  px: { xs: 1.5, sm: 0 },
  pb: { xs: 1, sm: 0 },
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
  "& > article": {
    flex: { xs: "0 0 80%", sm: "initial" },
    scrollSnapAlign: { xs: "start", sm: "none" },
  },
  // Cards scale/fade in as they slide into view (CSS scroll-driven, no JS; ignored where unsupported)
  "@supports (animation-timeline: view())": {
    "& > article": {
      "@media (max-width: 599.95px)": {
        animation: "ks-card-reveal linear both",
        animationTimeline: "view(inline)",
        animationRange: "entry 0% entry 60%",
      },
    },
  },
  "@media (prefers-reduced-motion: reduce)": {
    "& > article": { animation: "none !important" },
  },
} as const;

export default function NewTopPros() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const dispatch = useAppDispatch();
  const { location } = useAILocation();
  const { provider, servicer, isLoading } = useTopSuggestions("8");

  const openProvider = useCallback((userId: string) => {
    dispatch(openDrawer({ userId }));
  }, [dispatch]);

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const onTrackScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || !el.firstElementChild) return;
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 12;
    setActive(Math.round(el.scrollLeft / step));
  }, []);

  const rawServices: TopService[] = servicer ?? [];

  // When API has items use them (services first, then providers), otherwise fallback to rich dummy data
  const services = useMemo(() => {
    if (isLoading) return [];
    if (rawServices.length > 0) {
      return rawServices.slice(0, 4).map((s, idx) => {
        const img = Array.isArray(s.image_urls) && s.image_urls.length > 0
          ? s.image_urls[0]
          : (typeof s.image_urls === "string" ? s.image_urls : DUMMY_TOP_PROS[idx % DUMMY_TOP_PROS.length].image_url);
        return {
          id: s.id || `pro-${idx}`,
          name: s.name,
          category_name: s.category_name ?? ["Service"],
          provider_id: s.provider_id,
          provider_first_name: s.provider_first_name,
          provider_last_name: s.provider_last_name,
          rating: s.rating && Number(s.rating) > 0 ? String(s.rating) : "4.8",
          review_count: s.review_count && Number(s.review_count) > 0 ? String(s.review_count) : "24",
          price: s.price && Number(s.price) > 0 ? String(s.price) : "499",
          city_town: s.city_town || `${location.city || "Jaipur"}`,
          image_url: img,
          is_new: idx === 1,
          verified: true,
        };
      });
    }
    if (provider && provider.length > 0) {
      return provider.slice(0, 4).map((p, idx) => ({
        id: p.id || `prov-${idx}`,
        name: p.business_name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Service Expert",
        category_name: ["Verified Pro"],
        provider_id: p.id,
        provider_first_name: p.first_name,
        provider_last_name: p.last_name,
        rating: p.rating && Number(p.rating) > 0 ? String(p.rating) : "4.9",
        review_count: p.total_bookings && Number(p.total_bookings) > 0 ? String(p.total_bookings) : "32",
        price: "399",
        city_town: p.city || `${location.city || "Jaipur"}`,
        image_url: p.profile_pic || DUMMY_TOP_PROS[idx % DUMMY_TOP_PROS.length].image_url,
        is_new: false,
        verified: true,
      }));
    }
    return DUMMY_TOP_PROS;
  }, [rawServices, provider, isLoading, location.city]);

  return (
    <Section id="top-pros" sx={{ pb: { xs: 4, md: 6 }, px: 0 }}>
      <SectionHeader
        title="Trusted professionals near you"
        subtitle={`Listed on Kartsquare in ${location.city || "Jaipur"}`}
        action={
          <Box
            component={Link}
            href="/cus/services-list"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              minHeight: 44,
              whiteSpace: "nowrap",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            See all <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
          </Box>
        }
      />

      {isLoading ? (
        <Box sx={cardTrack}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" sx={{ height: 380, borderRadius: 4, flex: { xs: "0 0 80%", sm: "initial" } }} />
          ))}
        </Box>
      ) : (
        <>
        <Box sx={cardTrack} ref={trackRef} onScroll={onTrackScroll}>
          {services.map((item) => {
            return (
              <Box
                key={item.id}
                component="article"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
                  boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)",
                  transition: "transform 200ms ease, box-shadow 200ms ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: dark ? "0 12px 30px rgba(0,0,0,0.35)" : "0 12px 30px rgba(105,39,218,0.12)",
                  },
                }}
              >
                {/* Media Image */}
                <Box
                  onClick={() => openProvider(item.provider_id)}
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 180, sm: 190, md: 200, lg: 215, xl: 230 },
                    overflow: "hidden",
                    bgcolor: COLORS.PURPLE_ALPHA_10,
                    cursor: "pointer",
                  }}
                >
                  <Box
                    component="img"
                    src={item.image_url}
                    alt={item.name}
                    loading="lazy"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 400ms ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  />

                  {/* Badges on image */}
                  <Box sx={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 0.75 }}>
                    {item.is_new ? (
                      <Box
                        sx={{
                          px: 1.25,
                          py: 0.35,
                          borderRadius: 2,
                          bgcolor: "#fff",
                          color: "#ea580c",
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        New on Kartsquare
                      </Box>
                    ) : item.category_name?.[0] ? (
                      <Box
                        sx={{
                          px: 1.25,
                          py: 0.35,
                          borderRadius: 2,
                          bgcolor: "rgba(255,255,255,0.95)",
                          color: COLORS.PRIMARY_PURPLE,
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        {item.category_name[0]}
                      </Box>
                    ) : null}
                  </Box>

                </Box>

                {/* Content */}
                <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1 }}>
                  {/* Business Name */}
                  <Typography
                    component="h3"
                    onClick={() => openProvider(item.provider_id)}
                    sx={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.3,
                      mb: 0.5,
                      cursor: "pointer",
                      "&:hover": { color: COLORS.PRIMARY_PURPLE },
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.name}
                  </Typography>

                  {/* Location */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5, color: "text.secondary" }}>
                    <PlaceRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }} noWrap>
                      {item.city_town}
                    </Typography>
                  </Box>

                  {/* Rating only once there are 3+ reviews; otherwise a neutral "New" label */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2.5, mt: "auto" }}>
                    {Number(item.review_count) >= 3 ? (
                      <>
                        <StarRoundedIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
                        <Typography sx={{ fontSize: "0.88rem", fontWeight: 700 }}>
                          {item.rating}
                        </Typography>
                        <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
                          ({item.review_count})
                        </Typography>
                      </>
                    ) : (
                      <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "text.secondary" }}>
                        New on Kartsquare
                      </Typography>
                    )}
                  </Box>

                  {/* Action Buttons: View profile + Enquire */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => openProvider(item.provider_id)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.84rem",
                        py: 0.9,
                        borderRadius: 2.5,
                        bgcolor: COLORS.PRIMARY_PURPLE,
                        color: "#fff",
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: COLORS.PURPLE_HOVER,
                          boxShadow: "0 4px 12px rgba(105,39,218,0.3)",
                        },
                        "&:active": { transform: "scale(0.96)" },
                      }}
                    >
                      View profile
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => openProvider(item.provider_id)}
                      startIcon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: "16px !important" }} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.84rem",
                        py: 0.9,
                        borderRadius: 2.5,
                        borderColor: dark ? "rgba(255,255,255,0.2)" : "#d6d0e0",
                        color: "text.primary",
                        "&:hover": {
                          borderColor: COLORS.PRIMARY_PURPLE,
                          bgcolor: COLORS.PURPLE_ALPHA_04,
                        },
                        "&:active": { transform: "scale(0.96)" },
                      }}
                    >
                      Enquire
                    </Button>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
        {/* Mobile slide indicator */}
        <Box sx={{ display: { xs: "flex", sm: "none" }, justifyContent: "center", gap: 0.75, mt: 1.5 }}>
          {services.map((item, i) => (
            <Box
              key={item.id}
              sx={{
                height: 6,
                width: i === active ? 18 : 6,
                borderRadius: 3,
                bgcolor: i === active ? COLORS.PRIMARY_PURPLE : dark ? "rgba(255,255,255,0.25)" : "#d6d0e0",
                transition: "width 250ms ease, background-color 250ms ease",
              }}
            />
          ))}
        </Box>
        </>
      )}
    </Section>
  );
}
