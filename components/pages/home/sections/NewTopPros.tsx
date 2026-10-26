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
    <Section id="top-pros" sx={{ pb: { xs: 4, md: 6 }, px: { xs: 2, md: 0 } }}>
      <SectionHeader
        title="Trusted professionals near you"
        subtitle={`Listed on Kartsquare in ${location.city || "Jaipur"}`}
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
            const hasReviews = Number(item.review_count) > 0;
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
                <Box sx={{ position: "relative", width: "100%", height: 190, overflow: "hidden", bgcolor: COLORS.PURPLE_ALPHA_10 }}>
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
                    sx={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.3,
                      mb: 0.5,
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

                  {/* Stats Row: Rating + Price */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5, mt: "auto" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <StarRoundedIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
                      <Typography sx={{ fontSize: "0.88rem", fontWeight: 800 }}>
                        {item.rating}
                      </Typography>
                      {hasReviews && (
                        <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
                          ({item.review_count})
                        </Typography>
                      )}
                    </Box>

                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "text.primary" }}>
                      From ₹{item.price}
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
