import React, { forwardRef } from "react";
import { Avatar, Box, Button, Chip, Typography } from "@mui/material";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { COLORS } from "@/constants/colors";
import { AIService } from "@/services/ai/aiInterface";
import { fadeUp, MIN_TOUCH } from "./motion";

interface Props {
  service: AIService;
  selected?: boolean;
  compact?: boolean;
  /** Locality the user asked for, shown only when this provider's address really matches it */
  requestedLocality?: string | null;
  onSelect?: () => void;
  onViewProfile: () => void;
}

const digits = (s?: string | null) => (s || "").replace(/\D/g, "");

/**
 * Provider result. Shows only data the backend actually has: no default
 * ratings, no invented distances, no unsupported badges. ("Pay After Service"
 * has no backing field yet, so it is intentionally not rendered.)
 */
const AIProviderCard = forwardRef<HTMLDivElement, Props>(function AIProviderCard(
  { service, selected, compact, requestedLocality, onSelect, onViewProfile },
  ref
) {
  const m = service.match;
  const name = service.business_name || service.provider_name || service.service_name;
  const phone = digits(service.provider_phone_number);
  const wa = digits(`${service.provider_whatsapp_country_code || ""}${service.provider_whatsapp_number || ""}`);
  const address = service.service_address;
  const place =
    m?.localityMatch && requestedLocality
      ? `${requestedLocality}${address?.city_town ? `, ${address.city_town}` : ""}`
      : address?.city_town || null;
  const visiting = Number(service.visiting_charge || 0);
  const category = [service.category_name?.[0], service.sub_category_name?.[0]].filter(Boolean).join(" · ");

  const contactBtn = {
    minWidth: MIN_TOUCH,
    minHeight: MIN_TOUCH,
    borderRadius: 2,
    textTransform: "none" as const,
    fontWeight: 600,
    fontSize: "0.8rem",
  };

  return (
    <Box
      ref={ref}
      onClick={onSelect}
      data-selected={selected ? "true" : "false"}
      sx={{
        ...fadeUp,
        p: 1.5,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: `1.5px solid ${selected ? COLORS.PRIMARY_PURPLE : COLORS.PURPLE_ALPHA_10}`,
        boxShadow: selected ? `0 4px 16px ${COLORS.PURPLE_ALPHA_20}` : "0 1px 6px rgba(0,0,0,0.05)",
        transition: "border-color 160ms ease, box-shadow 160ms ease",
        width: compact ? 290 : "100%",
        minWidth: compact ? 290 : 0,
        scrollSnapAlign: "start",
        cursor: onSelect ? "pointer" : "default",
      }}
    >
      <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
        <Avatar
          src={service.provider_image_url || service.image_urls?.[0] || undefined}
          alt=""
          variant="rounded"
          sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: COLORS.PURPLE_ALPHA_10, color: COLORS.PRIMARY_PURPLE }}
        >
          {name?.[0]}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography noWrap sx={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.25 }}>
            {name}
          </Typography>
          <Typography noWrap sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
            {service.service_name}
          </Typography>
          {category && (
            <Typography noWrap sx={{ fontSize: "0.72rem", color: "text.disabled" }}>
              {category}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.75, mt: 1 }}>
        {/* Services are only listed after Kartsquare approval - same meaning as the badge on ServiceCard */}
        <Chip
          size="small"
          icon={<VerifiedRoundedIcon sx={{ fontSize: "14px !important" }} />}
          label="Verified"
          sx={{ height: 24, fontWeight: 600, bgcolor: "rgba(51,207,77,0.12)", color: "#1f9d37", "& .MuiChip-icon": { color: "#1f9d37" } }}
        />
        {m?.rating != null ? (
          <Typography sx={{ display: "flex", alignItems: "center", fontSize: "0.8rem", fontWeight: 600 }}>
            <StarRoundedIcon sx={{ fontSize: 16, color: "#f5a623", mr: 0.25 }} />
            {m.rating.toFixed(1)}
            <Box component="span" sx={{ ml: 0.5, fontWeight: 400, color: "text.secondary" }}>
              ({m.reviewCount} {m.reviewCount === 1 ? "review" : "reviews"})
            </Box>
          </Typography>
        ) : (
          <Typography sx={{ fontSize: "0.75rem", color: "text.disabled" }}>No reviews yet</Typography>
        )}
        {m?.kind === "related" && (
          <Chip size="small" label="Multi-appliance service" sx={{ height: 24, fontSize: "0.7rem" }} />
        )}
      </Box>

      {(place || m?.distanceKm != null || visiting > 0) && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25, mt: 0.75, color: "text.secondary" }}>
          {(place || m?.distanceKm != null) && (
            <Typography sx={{ display: "flex", alignItems: "center", fontSize: "0.78rem" }}>
              <LocationOnRoundedIcon sx={{ fontSize: 15, mr: 0.25 }} />
              {[place, m?.distanceKm != null ? `${m.distanceKm} km away` : null].filter(Boolean).join(" · ")}
            </Typography>
          )}
          {visiting > 0 && (
            <Typography sx={{ fontSize: "0.78rem" }}>Visiting charge ₹{visiting}</Typography>
          )}
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 1, mt: 1.25 }}>
        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile();
          }}
          sx={{ ...contactBtn, flex: 1, bgcolor: COLORS.PRIMARY_PURPLE, "&:hover": { bgcolor: COLORS.PURPLE_HOVER } }}
        >
          View Profile
        </Button>
        {phone && (
          <Button
            variant="outlined"
            component="a"
            href={`tel:+${phone}`}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            aria-label={`Call ${name}`}
            sx={contactBtn}
          >
            <PhoneRoundedIcon sx={{ fontSize: 20 }} />
          </Button>
        )}
        {wa && (
          <Button
            variant="outlined"
            component="a"
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            aria-label={`WhatsApp ${name}`}
            sx={{ ...contactBtn, color: "#1f9d37", borderColor: "rgba(31,157,55,0.5)" }}
          >
            <WhatsAppIcon sx={{ fontSize: 20 }} />
          </Button>
        )}
      </Box>
    </Box>
  );
});

export default AIProviderCard;
