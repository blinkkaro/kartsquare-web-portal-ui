"use client";
import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import { Box, Typography, Button, Skeleton, useTheme } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
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
}

const cardTrack = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(1, minmax(0, 1fr))", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
  gap: { xs: 2, md: 2.5 },
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
            href="/cus/servicesList"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
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
            <Skeleton key={i} variant="rounded" sx={{ height: 380, borderRadius: 4 }} />
          ))}
        </Box>
      ) : (
        <Box sx={cardTrack}>
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
                    {item.category_name?.[0] ? (
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

                  {item.verified && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: "rgba(255,255,255,0.92)",
                        borderRadius: "50%",
                        p: 0.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                      }}
                      title="Verified Partner"
                    >
                      <VerifiedRoundedIcon sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }} />
                    </Box>
                  )}
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

                  {/* Stats Row: Rating + Price */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5, mt: "auto" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <StarRoundedIcon sx={{ fontSize: 18, color: COLORS.NEW_UI.STAR_AMBER }} />
                      {item.rating ? (
                        <>
                          <Typography sx={{ fontSize: "0.88rem", fontWeight: 800 }}>
                            {item.rating}
                          </Typography>
                          <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
                            ({item.review_count})
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>New</Typography>
                      )}
                    </Box>

                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "text.primary" }}>
                      {item.price ? `From ₹${item.price}` : "Contact for price"}
                    </Typography>
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
      )}
    </Section>
  );
}
