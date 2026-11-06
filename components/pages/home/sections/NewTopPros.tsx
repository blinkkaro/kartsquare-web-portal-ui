"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Box, ButtonBase, Typography, Button, Skeleton, Tooltip, useTheme } from "@mui/material";
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

/** Neutral photo for the image slot when a listing has none (never a fake listing). */
const FALLBACK_IMAGES = [
  HOME_PHOTOS.electricianHero.src,
  HOME_PHOTOS.homeCleaning.src,
  HOME_PHOTOS.acRepair.src,
  HOME_PHOTOS.beautySalon.src,
];

interface TopProCard {
  id: string;
  name: string;
  category_name: string[];
  provider_id: string;
  provider_first_name?: string;
  provider_last_name?: string;
  /** Shown only when there are real reviews behind it. */
  rating: string | null;
  review_count: number;
  price: string | null;
  city_town: string;
  image_url: string;
  verified: boolean;
  /** Set for a service card: its page (slug or id). Null for a provider-only card. */
  service_route: string | null;
  /** The provider's own picture, for the avatar that opens their profile. */
  provider_image: string;
}

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

/** The provider's own name for the avatar label; the business name if that's all we have. */
function providerLabel(item: TopProCard): string {
  return `${item.provider_first_name || ""} ${item.provider_last_name || ""}`.trim() || item.name;
}

export default function NewTopPros() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const dispatch = useAppDispatch();
  const { location } = useAILocation();
  const { provider, servicer, isLoading } = useTopSuggestions("8");

  const router = useRouter();

  const openProvider = useCallback((userId: string) => {
    dispatch(openDrawer({ userId }));
  }, [dispatch]);

  /** A service card opens the service page; a provider-only card opens the profile. */
  const openCard = useCallback(
    (item: TopProCard) => {
      if (item.service_route) router.push(`/services/${item.service_route}`);
      else openProvider(item.provider_id);
    },
    [router, openProvider],
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const onTrackScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || !el.firstElementChild) return;
    const step = (el.firstElementChild as HTMLElement).offsetWidth + 12;
    setActive(Math.round(el.scrollLeft / step));
  }, []);

  const rawServices: TopService[] = servicer ?? [];

  // Real listings only. With none, the section is hidden rather than filled with examples.
  const services: TopProCard[] = useMemo(() => {
    if (isLoading) return [];
    if (rawServices.length > 0) {
      return rawServices.slice(0, 4).map((s, idx) => {
        const img = Array.isArray(s.image_urls) && s.image_urls.length > 0
          ? s.image_urls[0]
          : (typeof s.image_urls === "string" && s.image_urls ? s.image_urls : FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]);
        const reviews = Number(s.review_count) || 0;
        return {
          id: s.id || `pro-${idx}`,
          name: s.name,
          category_name: s.category_name ?? [],
          provider_id: s.provider_id,
          provider_first_name: s.provider_first_name,
          provider_last_name: s.provider_last_name,
          rating: reviews > 0 && Number(s.rating) > 0 ? Number(s.rating).toFixed(1) : null,
          review_count: reviews,
          price: s.price && Number(s.price) > 0 ? String(s.price) : null,
          city_town: s.city_town || "",
          image_url: img,
          verified: true,
          service_route: s.slug?.trim() || s.id || null,
          provider_image: s.provider_profile_pic || "",
        };
      });
    }
    if (provider && provider.length > 0) {
      return provider.slice(0, 4).map((p, idx) => ({
        id: p.id || `prov-${idx}`,
        name: p.business_name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Service provider",
        category_name: [],
        provider_id: p.id,
        provider_first_name: p.first_name,
        provider_last_name: p.last_name,
        // Bookings are not reviews: no rating is shown for providers here.
        rating: null,
        review_count: 0,
        price: null,
        city_town: p.city || "",
        image_url: p.profile_pic || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
        verified: true,
        service_route: null,
        provider_image: p.profile_pic || "",
      }));
    }
    return [];
  }, [rawServices, provider, isLoading]);

  if (!isLoading && services.length === 0) return null;

  return (
    <Section id="top-pros" sx={{ pb: { xs: 4, md: 6 }, px: 0 }}>
      <SectionHeader
        title="Trusted professionals near you"
        subtitle={location.city ? `Listed on Kartsquare in ${location.city}` : "Listed on Kartsquare"}
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
                  onClick={() => openCard(item)}
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
                    {item.category_name?.[0] ? (
                      <Box
                        sx={{
                          px: 1.25,
                          py: 0.35,
                          borderRadius: 2,
                          bgcolor: "rgba(255,255,255,0.95)",
                          color: COLORS.PRIMARY_PURPLE,
                          fontSize: "0.75rem",
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
                  {/* Provider picture (opens their profile) + business name (opens the service) */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, minWidth: 0 }}>
                  {item.service_route && item.provider_id && (
                    <Tooltip title={`View ${providerLabel(item)}'s profile`}>
                      <ButtonBase
                        onClick={() => openProvider(item.provider_id)}
                        aria-label={`View ${providerLabel(item)}'s profile`}
                        sx={{
                          borderRadius: "50%",
                          flexShrink: 0,
                          "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 },
                        }}
                      >
                        <Avatar
                          src={item.provider_image || undefined}
                          alt={providerLabel(item)}
                          sx={{
                            width: 28,
                            height: 28,
                            fontSize: "0.8rem",
                            fontWeight: 800,
                            bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10,
                            color: dark ? COLORS.NEW_UI.CHIP_TEXT_DARK : COLORS.PRIMARY_PURPLE,
                            border: "1.5px solid",
                            borderColor: dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT,
                            "&:hover": { borderColor: COLORS.PRIMARY_PURPLE },
                          }}
                        >
                          {providerLabel(item).charAt(0).toUpperCase()}
                        </Avatar>
                      </ButtonBase>
                    </Tooltip>
                  )}
                  <Typography
                    component="h3"
                    onClick={() => openCard(item)}
                    sx={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.3,
                      minWidth: 0,
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
                  </Box>

                  {/* Location (only when the listing has one) */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5, color: "text.secondary", minHeight: 20 }}>
                    {item.city_town && (
                      <>
                        <PlaceRoundedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }} noWrap>
                          {item.city_town}
                        </Typography>
                      </>
                    )}
                  </Box>

                  {/* Rating only once there are 3+ real reviews; otherwise a neutral "New" label */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2.5, mt: "auto" }}>
                    {item.rating && Number(item.review_count) >= 3 ? (
                      <>
                        <StarRoundedIcon sx={{ fontSize: 18, color: COLORS.NEW_UI.STAR_AMBER }} />
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

                  {/* Action Buttons: View details (service page) + Enquire */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={() => openCard(item)}
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
                      {item.service_route ? "View details" : "View profile"}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => openCard(item)}
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
