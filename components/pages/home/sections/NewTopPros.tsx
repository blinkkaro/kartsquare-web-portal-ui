"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Box, ButtonBase, Typography, Button } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { COLORS } from "@/constants/colors";
import { useTopSuggestions } from "@/hooks/useTopSuggestions";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { useAppDispatch } from "@/store/hooks";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { type TopService } from "@/services/topSuppliers/topSupplires.interfaces";
import { ShimmerBox } from "./HomeLoading";
import { HOME_GUTTER, HOME_MAX_WIDTH, Section, SectionHeader } from "./shared";
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
  /** The listing's own description, if it has one. */
  description: string;
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

/** Whether the provider's own name is known (otherwise the business name is the title and there is no "by" line). */
const hasProviderName = (item: TopProCard) => Boolean(`${item.provider_first_name || ""}${item.provider_last_name || ""}`.trim());

interface ProCardProps {
  item: TopProCard;
  /** Open the service page, or the profile for a provider-only card. */
  onOpen: (item: TopProCard) => void;
  onOpenProvider: (providerId: string) => void;
}

/**
 * One listing. A photo with its category and price on it (and a rating, only with 3+ real reviews), then the
 * service's name, a two-line description, where it is, who runs it, and two actions. It sits on the violet band
 * but is a white card, so it sets its own text colour. Everything shown comes from the listing; a field the
 * listing lacks is left out, never filled in.
 */
function ProCard({ item, onOpen, onOpenProvider }: ProCardProps) {
  const hasRating = Boolean(item.rating) && Number(item.review_count) >= 3;
  const category = item.category_name?.[0];
  const price = item.price ? Number(item.price) : 0;
  const provider = providerLabel(item);

  return (
    <Box
      component="article"
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        bgcolor: COLORS.WHITE,
        // the band around the card sets white text; the card is white, so it sets its own
        color: "text.primary",
        boxShadow: "0 16px 40px rgba(20, 5, 47, 0.4)",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 0 0 2px ${COLORS.SECONDARY_ORANGE}, 0 20px 44px rgba(20, 5, 47, 0.5)`,
        },
        "&:hover .pro-photo": { transform: "scale(1.05)" },
        "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" }, "&:hover .pro-photo": { transform: "none" } },
      }}
    >
      {/* Photo, with the facts that help you choose laid over it */}
      <Box
        onClick={() => onOpen(item)}
        sx={{ position: "relative", width: "100%", height: { xs: 180, sm: 190, md: 200, lg: 215, xl: 230 }, overflow: "hidden", bgcolor: COLORS.PURPLE_ALPHA_10, cursor: "pointer" }}
      >
        <Box
          className="pro-photo"
          component="img"
          src={item.image_url}
          alt={item.name}
          loading="lazy"
          sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 400ms ease" }}
        />
        {/* a soft shade at the bottom so the rating chip reads on any photo */}
        <Box aria-hidden sx={{ position: "absolute", inset: "auto 0 0 0", height: "45%", background: "linear-gradient(to top, rgba(20,5,47,0.55), transparent)", pointerEvents: "none" }} />

        {category && (
          <Box sx={{ position: "absolute", top: 12, left: 12, maxWidth: "70%", px: 1.25, py: 0.4, borderRadius: 2, bgcolor: "rgba(255,255,255,0.95)", color: COLORS.PRIMARY_PURPLE, fontSize: "0.75rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {category}
          </Box>
        )}
        {price > 0 && (
          <Box sx={{ position: "absolute", top: 12, right: 12, px: 1.25, py: 0.4, borderRadius: 2, bgcolor: COLORS.PRIMARY_PURPLE, color: COLORS.WHITE, fontSize: "0.78rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}>
            ₹{price.toLocaleString("en-IN")}
          </Box>
        )}
        {hasRating && (
          <Box sx={{ position: "absolute", left: 12, bottom: 12, display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.35, borderRadius: 2, bgcolor: COLORS.WHITE, color: "text.primary", fontSize: "0.8rem", fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <StarRoundedIcon sx={{ fontSize: 16, color: COLORS.NEW_UI.STAR_AMBER }} />
            {item.rating}
            <Box component="span" sx={{ fontWeight: 500, color: "text.secondary" }}>
              ({item.review_count})
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1, gap: 1 }}>
        {/* Who runs it: their picture opens their profile */}
        {item.service_route && item.provider_id && hasProviderName(item) && (
          <ButtonBase
            onClick={() => onOpenProvider(item.provider_id)}
            aria-label={`View ${provider}'s profile`}
            sx={{ alignSelf: "flex-start", gap: 0.75, minHeight: 28, borderRadius: 999, pr: 1, "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 } }}
          >
            <Avatar src={item.provider_image || undefined} alt="" sx={{ width: 24, height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE }}>
              {provider.charAt(0).toUpperCase()}
            </Avatar>
            <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }} noWrap>
              by {provider}
            </Typography>
          </ButtonBase>
        )}

        {/* The service's name: the first thing to read */}
        <Typography
          component="h3"
          onClick={() => onOpen(item)}
          sx={{
            fontSize: "1.08rem",
            fontWeight: 700,
            lineHeight: 1.3,
            minHeight: "2.6em",
            color: "text.primary",
            cursor: "pointer",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            "&:hover": { color: COLORS.PRIMARY_PURPLE },
          }}
        >
          {item.name}
        </Typography>

        {/* What they offer, in the listing's own words */}
        <Typography
          sx={{
            fontSize: "0.84rem",
            lineHeight: 1.45,
            minHeight: "2.9em",
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description}
        </Typography>

        {/* Where (only when the listing has a place) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", minHeight: 20, mt: "auto" }}>
          {item.city_town && (
            <>
              <PlaceRoundedIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }} noWrap>
                {item.city_town}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 0.5 }}>
          <Button
            variant="contained"
            onClick={() => onOpen(item)}
            sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.84rem", py: 0.9, minHeight: 44, borderRadius: 2.5, bgcolor: COLORS.PRIMARY_PURPLE, color: COLORS.WHITE, boxShadow: "none", "&:hover": { bgcolor: COLORS.PURPLE_HOVER, boxShadow: "0 4px 12px rgba(105,39,218,0.3)" }, "&:active": { transform: "scale(0.96)" } }}
          >
            {item.service_route ? "View details" : "View profile"}
          </Button>
          <Button
            variant="outlined"
            onClick={() => onOpen(item)}
            startIcon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: "16px !important" }} />}
            sx={{ textTransform: "none", fontWeight: 700, fontSize: "0.84rem", py: 0.9, minHeight: 44, borderRadius: 2.5, borderColor: COLORS.BORDER.HOVER_LIGHT, color: "text.primary", "&:hover": { borderColor: COLORS.PRIMARY_PURPLE, bgcolor: COLORS.PURPLE_ALPHA_04 }, "&:active": { transform: "scale(0.96)" } }}
          >
            Enquire
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default function NewTopPros() {
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

  const rawServices: TopService[] = useMemo(() => servicer ?? [], [servicer]);

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
          description: (s.description ?? "").trim(),
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
        description: "",
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
    // A full-width violet band, in the hero's colours, so this section reads as part of the same page.
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        color: COLORS.WHITE,
        my: { xs: 2, md: 3 },
        background: `linear-gradient(160deg, ${COLORS.PURPLE_HOVER} 0%, ${COLORS.PURPLE_DEEP} 100%)`,
      }}
    >
      {/* one soft warm glow, as in the hero; decoration only */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: { xs: -120, md: -160 },
          right: { xs: -120, md: "6%" },
          width: { xs: 300, md: 480 },
          height: { xs: 300, md: 480 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.SECONDARY_ORANGE}40 0%, transparent 68%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <Box sx={{ position: "relative", maxWidth: HOME_MAX_WIDTH, mx: "auto", px: HOME_GUTTER, py: { xs: 4, md: 6 } }}>
    <Section id="top-pros" sx={{ py: 0, px: 0 }}>
      <SectionHeader
        onDark
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
              color: COLORS.WHITE,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
              "&:focus-visible": { outline: `3px solid ${COLORS.SECONDARY_ORANGE}`, outlineOffset: 2, borderRadius: 1 },
            }}
          >
            See all <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
          </Box>
        }
      />

      {isLoading ? (
        <Box sx={cardTrack}>
          {[0, 1, 2, 3].map((i) => (
            <ShimmerBox key={i} tone="onDark" sx={{ height: { xs: 420, md: 450 }, borderRadius: 4, flex: { xs: "0 0 80%", sm: "initial" } }} />
          ))}
        </Box>
      ) : (
        <>
        <Box sx={cardTrack} ref={trackRef} onScroll={onTrackScroll}>
          {services.map((item) => (
            <ProCard key={item.id} item={item} onOpen={openCard} onOpenProvider={openProvider} />
          ))}
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
                bgcolor: i === active ? COLORS.SECONDARY_ORANGE : "rgba(255,255,255,0.4)",
                transition: "width 250ms ease, background-color 250ms ease",
              }}
            />
          ))}
        </Box>
        </>
      )}
    </Section>
      </Box>
    </Box>
  );
}
