"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Collapse,
  Dialog,
  IconButton,
  useTheme,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { COLORS } from "@/constants/colors";
import { EnrichedServiceItem, ProviderRecentWork } from "../servicesSampleData";
import { HOME_PHOTOS } from "@/components/pages/home/sections/homePhotos";

interface ServiceCardHorizontalProps {
  service: EnrichedServiceItem;
  onOpenQuickView: (service: EnrichedServiceItem) => void;
  onViewProfile: (service: EnrichedServiceItem) => void;
  onEnquire?: (service: EnrichedServiceItem) => void;
}

export default function ServiceCardHorizontal({
  service,
  onOpenQuickView,
  onViewProfile,
  onEnquire,
}: ServiceCardHorizontalProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const [showWorkPreview, setShowWorkPreview] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Parse media
  const primaryImg =
    Array.isArray(service.image_urls) && service.image_urls.length > 0
      ? service.image_urls[0]
      : typeof service.image_urls === "string"
      ? (service.image_urls as string)
      : service.provider_image_url ||
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80";

  const displayName = service.business_name || service.service_name || service.provider_name || "Service Expert";
  const categoryLabel = Array.isArray(service.category_name) ? service.category_name[0] : (service.category_name || "Service");

  // Sub-services text line
  const subServicesList =
    service.sub_services ||
    (Array.isArray(service.sub_category_name) ? service.sub_category_name : null) ||
    ["Professional service", "Verified standards"];
  const subServicesText = subServicesList.join(" · ");

  // Location string
  const locCity = service.service_address?.city_town || "Jaipur";
  const locArea = service.area_name || service.service_address?.landmark || service.service_address?.address || "";
  const locationString = locArea ? `${locArea}, ${locCity}` : locCity;

  // Rating
  const ratingNum = Number(service.avg_service_rating) || 4.8;
  const reviewCount = Number(service.review_count) || 0;
  const hasReviews = reviewCount > 0;

  // Price label
  const hasPrice = typeof service.price === "number" && service.price > 0;

  // Recent work thumbnails (purely from real provider recent works)
  const recentWorks: ProviderRecentWork[] =
    service.recent_works && service.recent_works.length > 0
      ? service.recent_works
      : primaryImg
      ? [{ id: `${service.service_id}-w1`, title: displayName, image: primaryImg, type: "image" }]
      : [];

  return (
    <Box
      component="article"
      sx={{
        borderRadius: "16px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
        boxShadow: dark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.03)",
        transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        overflow: "hidden",
        mb: 2.5,
        "&:hover": {
          borderColor: dark ? "rgba(130,72,247,0.4)" : "#d6cbef",
          boxShadow: dark ? "0 8px 24px rgba(0,0,0,0.35)" : "0 8px 24px rgba(105,39,218,0.08)",
        },
      }}
    >
      {/* Card Content Row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          p: { xs: 2, sm: 2.25 },
          gap: { xs: 2, sm: 2.5 },
          alignItems: { xs: "stretch", sm: "flex-start" },
        }}
      >
        {/* 1. Left: Main Photo */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", sm: 220, md: 240 },
            height: { xs: 190, sm: 160 },
            borderRadius: "12px",
            overflow: "hidden",
            flexShrink: 0,
            bgcolor: dark ? "rgba(255,255,255,0.05)" : "#f2edf8",
            cursor: "pointer",
          }}
          onClick={() => onViewProfile(service)}
        >
          <Box
            component="img"
            src={primaryImg}
            alt={displayName}
            onError={(e: any) => {
              e.currentTarget.src = HOME_PHOTOS.electricianHero.src;
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 300ms ease",
              "&:hover": { transform: "scale(1.04)" },
            }}
          />

          {/* Mobile-only Verified Badge Overlay */}
          <Box
            sx={{
              display: { xs: "inline-flex", sm: "none" },
              position: "absolute",
              top: 10,
              left: 10,
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.35,
              borderRadius: "999px",
              bgcolor: "rgba(255,255,255,0.92)",
              color: "#166534",
              fontSize: "0.72rem",
              fontWeight: 800,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <CheckCircleRoundedIcon sx={{ fontSize: 13, color: "#16a34a" }} />
            Verified
          </Box>
        </Box>

        {/* 2. Middle: Identity, Details, Tags & Recent Work */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Mobile Category Tag */}
          <Box sx={{ display: { xs: "block", sm: "none" }, mb: 0.5 }}>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: COLORS.PRIMARY_PURPLE,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              {categoryLabel}
            </Typography>
          </Box>

          {/* Title & Verified Badge */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", mb: 0.5 }}>
            <Typography
              component="h2"
              onClick={() => onViewProfile(service)}
              sx={{
                fontSize: { xs: "1.05rem", sm: "1.15rem" },
                fontWeight: 800,
                color: "text.primary",
                cursor: "pointer",
                "&:hover": { color: COLORS.PRIMARY_PURPLE },
              }}
            >
              {displayName}
            </Typography>
            <CheckCircleRoundedIcon
              sx={{
                fontSize: 18,
                color: "#16a34a",
                display: { xs: "none", sm: "inline-block" },
              }}
              titleAccess="Verified professional"
            />
          </Box>

          {/* Rating & Location */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.35 }}>
              <StarRoundedIcon sx={{ color: "#f59e0b", fontSize: 19 }} />
              <Typography sx={{ fontSize: "0.86rem", fontWeight: 700, color: "text.primary" }}>
                {ratingNum.toFixed(1)}
              </Typography>
              {hasReviews ? (
                <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                  ({reviewCount} reviews)
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
                  · New
                </Typography>
              )}
            </Box>
            <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>·</Typography>
            <Typography sx={{ fontSize: "0.84rem", color: "text.secondary" }}>
              {locationString}
            </Typography>
          </Box>

          {/* Sub-services tags */}
          <Typography
            sx={{
              fontSize: "0.84rem",
              color: "text.secondary",
              lineHeight: 1.45,
              mb: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {subServicesText}
          </Typography>

          {/* Recent Work Thumbnails + Preview Toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              {recentWorks.slice(0, 3).map((work, idx) => (
                <Box
                  key={work.id || idx}
                  onClick={() => setLightboxImage(work.image)}
                  sx={{
                    position: "relative",
                    width: 42,
                    height: 42,
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: dark ? "rgba(255,255,255,0.15)" : "#e2deea",
                    "&:hover": { transform: "scale(1.08)" },
                    transition: "transform 150ms ease",
                  }}
                >
                  <Box
                    component="img"
                    src={work.image}
                    alt={work.title}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {work.type === "reel" && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ color: "#fff", fontSize: 16 }} />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            <Button
              onClick={() => setShowWorkPreview((prev) => !prev)}
              endIcon={
                showWorkPreview ? (
                  <KeyboardArrowUpRoundedIcon sx={{ fontSize: 18 }} />
                ) : (
                  <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />
                )
              }
              sx={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: dark ? "#c4a3ff" : COLORS.PRIMARY_PURPLE,
                textTransform: "none",
                p: 0,
                minWidth: 0,
                "&:hover": { textDecoration: "underline", bgcolor: "transparent" },
              }}
            >
              Preview work
            </Button>
          </Box>
        </Box>

        {/* 3. Right: Price & Action Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "stretch", sm: "flex-end" },
            justifyContent: "space-between",
            minWidth: { sm: 160 },
            pt: { xs: 1.5, sm: 0 },
            borderTop: { xs: "1px solid", sm: "none" },
            borderColor: dark ? "rgba(255,255,255,0.06)" : "#ede9f2",
            gap: 1.5,
          }}
        >
          {/* Price */}
          <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
            {hasPrice ? (
              <>
                <Typography sx={{ fontSize: "0.74rem", color: "text.secondary", fontWeight: 500 }}>
                  Starting from
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    color: "text.primary",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ₹{service.price}
                </Typography>
              </>
            ) : (
              <>
                <Typography sx={{ fontSize: "0.74rem", color: "text.secondary", fontWeight: 500 }}>
                  Pricing
                </Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: "text.primary" }}>
                  Contact for price
                </Typography>
              </>
            )}
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              alignItems: "stretch",
              width: "100%",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              onClick={() => onViewProfile(service)}
              sx={{
                flex: { xs: 1, sm: "none" },
                bgcolor: COLORS.PRIMARY_PURPLE,
                color: "#ffffff",
                borderRadius: "10px",
                py: 0.9,
                px: 2.25,
                fontSize: "0.86rem",
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: COLORS.PURPLE_HOVER,
                  boxShadow: "0 4px 14px rgba(105,39,218,0.25)",
                },
              }}
            >
              View profile
            </Button>

            <Button
              variant="text"
              onClick={() => onOpenQuickView(service)}
              sx={{
                flex: { xs: 1, sm: "none" },
                color: "text.secondary",
                fontSize: "0.82rem",
                fontWeight: 600,
                textTransform: "none",
                py: 0.5,
                "&:hover": {
                  color: COLORS.PRIMARY_PURPLE,
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              Quick view
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Expanded Work Preview Drawer (Inline) */}
      <Collapse in={showWorkPreview} timeout="auto" unmountOnExit>
        <Box
          sx={{
            p: 2.5,
            borderTop: "1px solid",
            borderColor: dark ? "rgba(255,255,255,0.06)" : "#ede9f2",
            bgcolor: dark ? "rgba(255,255,255,0.02)" : "#faf8fc",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography sx={{ fontSize: "0.86rem", fontWeight: 700, color: "text.primary" }}>
              Recent work by {displayName}
            </Typography>
            <Button
              size="small"
              onClick={() => onOpenQuickView(service)}
              sx={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: COLORS.PRIMARY_PURPLE,
                textTransform: "none",
                p: 0,
              }}
            >
              View all work in drawer →
            </Button>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(3, 1fr)" },
              gap: 1.5,
            }}
          >
            {recentWorks.map((work) => (
              <Box
                key={work.id}
                onClick={() => setLightboxImage(work.image)}
                sx={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: dark ? "rgba(255,255,255,0.08)" : "#e8e3ef",
                  cursor: "pointer",
                  transition: "transform 180ms ease",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: 120,
                    bgcolor: dark ? "rgba(255,255,255,0.04)" : "#eee8f5",
                  }}
                >
                  <Box
                    component="img"
                    src={work.image}
                    alt={work.title}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  {work.type === "reel" && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        px: 0.75,
                        py: 0.25,
                        borderRadius: "999px",
                        bgcolor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.25,
                        color: "#fff",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                      }}
                    >
                      <PlayArrowRoundedIcon sx={{ fontSize: 13 }} />
                      Reel
                    </Box>
                  )}
                </Box>
                <Box sx={{ p: 1.25 }}>
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "text.primary" }}>
                    {work.title}
                  </Typography>
                  {work.caption && (
                    <Typography
                      sx={{
                        fontSize: "0.74rem",
                        color: "text.secondary",
                        mt: 0.25,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {work.caption}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>

      {/* Lightbox Modal */}
      <Dialog
        open={Boolean(lightboxImage)}
        onClose={() => setLightboxImage(null)}
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
      >
        {lightboxImage && (
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={() => setLightboxImage(null)}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Box
              component="img"
              src={lightboxImage}
              alt="Work preview"
              sx={{
                maxWidth: "100%",
                maxHeight: "80vh",
                display: "block",
                borderRadius: "16px",
              }}
            />
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
