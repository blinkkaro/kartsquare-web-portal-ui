"use client";
import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { COLORS } from "@/constants/colors";
import { EnrichedServiceItem } from "../servicesSampleData";
import { HOME_PHOTOS } from "@/components/pages/home/sections/homePhotos";

interface ServiceQuickViewDrawerProps {
  open: boolean;
  onClose: () => void;
  service: EnrichedServiceItem | null;
  onViewFullProfile: (service: EnrichedServiceItem) => void;
  onBookService?: (service: EnrichedServiceItem) => void;
}

export default function ServiceQuickViewDrawer({
  open,
  onClose,
  service,
  onViewFullProfile,
  onBookService,
}: ServiceQuickViewDrawerProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  if (!service) return null;

  const displayName = service.business_name || service.service_name || service.provider_name || "Service Expert";
  const categoryLabel = Array.isArray(service.category_name) ? service.category_name[0] : (service.category_name || "Service");
  const ratingNum = Number(service.avg_service_rating) || 4.8;
  const reviewCount = Number(service.review_count) || 24;

  const primaryImg =
    Array.isArray(service.image_urls) && service.image_urls.length > 0
      ? service.image_urls[0]
      : typeof service.image_urls === "string"
      ? (service.image_urls as string)
      : HOME_PHOTOS.electricianHero.src;

  const locCity = service.service_address?.city_town || "Jaipur";
  const locArea = service.area_name || service.service_address?.address || service.service_address?.landmark || "City Center";
  const phone = service.provider_phone_number || "+91 98290 12345";
  const whatsappNum = service.provider_whatsapp_number || phone.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    `Hi ${displayName}, I found your listing on Kartsquare for ${categoryLabel} services and would like an enquiry.`
  )}`;

  const recentWorks = service.recent_works || [];
  const subServices = service.sub_services || (Array.isArray(service.sub_category_name) ? service.sub_category_name : []) || [];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 460, md: 500 },
          bgcolor: "background.paper",
          backgroundImage: "none",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header Hero Image */}
        <Box
          sx={{
            position: "relative",
            height: 180,
            bgcolor: dark ? "#1c1924" : "#f0ecf6",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={primaryImg}
            alt={displayName}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)",
            }}
          />

          {/* Close button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Quick badge on hero */}
          <Box
            sx={{
              position: "absolute",
              bottom: 14,
              left: 18,
              right: 18,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1,
                  py: 0.25,
                  borderRadius: "999px",
                  bgcolor: "rgba(255,255,255,0.92)",
                  color: "#166534",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  mb: 0.5,
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 13, color: "#16a34a" }} />
                Verified Partner
              </Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {displayName}
              </Typography>
            </Box>

            {service.price && (
              <Box sx={{ textAlign: "right", bgcolor: "rgba(0,0,0,0.6)", px: 1.25, py: 0.5, borderRadius: "8px" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.68rem" }}>
                  Starting from
                </Typography>
                <Typography sx={{ color: "#fff", fontSize: "1.1rem", fontWeight: 800 }}>
                  ₹{service.price}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: { xs: 2.5, sm: 3 } }}>
          {/* Rating, Reviews & Area */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
              <StarRoundedIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
              <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: "text.primary" }}>
                {ratingNum.toFixed(1)}
              </Typography>
              <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                ({reviewCount} reviews)
              </Typography>
            </Box>
            <Typography sx={{ color: "text.secondary" }}>·</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, color: "text.secondary" }}>
              <PlaceRoundedIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: "0.84rem" }}>
                {locArea}, {locCity}
              </Typography>
            </Box>
          </Box>

          {/* Quick Connect Action Buttons */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, mb: 3 }}>
            <Button
              component="a"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<WhatsAppIcon sx={{ fontSize: 18 }} />}
              sx={{
                bgcolor: "#25D366",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                borderRadius: "10px",
                py: 1,
                boxShadow: "none",
                textTransform: "none",
                "&:hover": { bgcolor: "#20bd5a" },
              }}
            >
              WhatsApp
            </Button>
            <Button
              component="a"
              href={`tel:${phone}`}
              variant="outlined"
              startIcon={<CallRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderColor: dark ? "rgba(255,255,255,0.2)" : "#d6d0e0",
                color: "text.primary",
                fontWeight: 700,
                fontSize: "0.85rem",
                borderRadius: "10px",
                py: 1,
                textTransform: "none",
                "&:hover": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                  color: COLORS.PRIMARY_PURPLE,
                },
              }}
            >
              Call Provider
            </Button>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {/* About / Description */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: "text.primary", mb: 0.75 }}>
              About this professional
            </Typography>
            <Typography sx={{ fontSize: "0.86rem", color: "text.secondary", lineHeight: 1.6 }}>
              {service.service_desc ||
                `${displayName} is a verified ${categoryLabel.toLowerCase()} expert serving ${locCity} with top quality craftsmanship, quick response times, and upfront pricing.`}
            </Typography>
          </Box>

          {/* Services & Specializations */}
          {subServices.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: "text.primary", mb: 1.25 }}>
                Specialized in
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {subServices.map((sub, i) => (
                  <Chip
                    key={i}
                    label={sub}
                    size="small"
                    sx={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      bgcolor: dark ? "rgba(130,72,247,0.12)" : COLORS.PURPLE_ALPHA_10,
                      color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE,
                      borderRadius: "6px",
                      py: 0.5,
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Recent Work Portfolio */}
          {recentWorks.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: "0.92rem", fontWeight: 800, color: "text.primary", mb: 1.25 }}>
                Recent work & projects
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {recentWorks.map((work) => (
                  <Box
                    key={work.id}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      p: 1.25,
                      borderRadius: "10px",
                      bgcolor: dark ? "rgba(255,255,255,0.03)" : "#f8f6fb",
                      border: "1px solid",
                      borderColor: dark ? "rgba(255,255,255,0.06)" : "#ede8f4",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: 70,
                        height: 70,
                        borderRadius: "8px",
                        overflow: "hidden",
                        flexShrink: 0,
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
                            bgcolor: "rgba(0,0,0,0.35)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <PlayArrowRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: "text.primary" }}>
                        {work.title}
                      </Typography>
                      {work.caption && (
                        <Typography
                          sx={{
                            fontSize: "0.76rem",
                            color: "text.secondary",
                            mt: 0.3,
                            lineHeight: 1.4,
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
          )}
        </Box>

        {/* Sticky Drawer Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
            bgcolor: "background.paper",
            display: "flex",
            gap: 1.5,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              onClose();
              onViewFullProfile(service);
            }}
            sx={{
              bgcolor: COLORS.PRIMARY_PURPLE,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.88rem",
              borderRadius: "10px",
              py: 1.1,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
            }}
          >
            View Full Profile
          </Button>
          {onBookService && (
            <Button
              variant="outlined"
              onClick={() => {
                onClose();
                onBookService(service);
              }}
              startIcon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderColor: COLORS.PRIMARY_PURPLE,
                color: COLORS.PRIMARY_PURPLE,
                fontWeight: 700,
                fontSize: "0.88rem",
                borderRadius: "10px",
                py: 1.1,
                px: 2,
                textTransform: "none",
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_10 },
              }}
            >
              Book
            </Button>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
