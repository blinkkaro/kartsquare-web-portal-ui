"use client";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { COLORS } from "@/constants/colors";
import { getServiceRouteParam } from "@/utils/serviceRoute";
import { TopService } from "@/services/topSuppliers/topSupplires.interfaces";

const NEW_WINDOW_DAYS = 30;
const CYCLE_MS = 1200;

const isNew = (createdAt?: string) => {
  const t = createdAt ? Date.parse(createdAt) : NaN;
  return Number.isFinite(t) && Date.now() - t < NEW_WINDOW_DAYS * 86_400_000;
};

const pill = { px: 1.1, py: 0.35, borderRadius: 99, fontSize: "0.68rem", fontWeight: 800, lineHeight: 1.2 } as const;
const glass = { bgcolor: "rgba(255,255,255,0.94)", color: "#21172e", boxShadow: "0 2px 8px rgba(32,27,44,0.12)" } as const;

interface Props {
  service: TopService;
  /** Opens the provider profile drawer. Kept out of the card link so both actions work. */
  onOpenProvider: (providerId: string) => void;
}

/**
 * Service card. The title is the real link; its ::after stretches over the card so the whole card
 * is clickable while the provider chip and share button stay independent controls (no nested links).
 * Hovering (or focusing) cycles through the service's photos.
 */
function ServiceCard({ service: s, onOpenProvider }: Props) {
  const dark = useTheme().palette.mode === "dark";
  const images = s.image_urls?.filter(Boolean) ?? [];
  const [idx, setIdx] = useState(0);
  const [shared, setShared] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const category = s.category_name?.[0];
  const providerName = [s.provider_first_name, s.provider_last_name].filter(Boolean).join(" ");
  const reviews = Number(s.review_count ?? 0);
  const rating = reviews > 0 && Number(s.rating) > 0 ? Number(s.rating) : null;
  const price = Number(s.price) > 0 ? Number(s.price) : null;
  const href = `/services/${getServiceRouteParam(s)}`;
  const lift = dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE;

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setIdx(0);
  }, []);
  const start = useCallback(() => {
    if (images.length < 2 || timer.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setIdx((i) => (i + 1) % images.length), CYCLE_MS);
  }, [images.length]);
  useEffect(() => stop, [stop]);

  const share = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${href}`;
    try {
      if (navigator.share) await navigator.share({ title: s.name, url });
      else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 1800);
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <Box
      component="article"
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocusCapture={start}
      onBlurCapture={stop}
      sx={{
        position: "relative",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 4.5,
        bgcolor: "background.paper",
        boxShadow: `0 2px 12px ${COLORS.PURPLE_ALPHA_04}, 0 1px 2px rgba(32,27,44,0.06)`,
        transition: "transform 220ms cubic-bezier(.2,.7,.2,1), box-shadow 220ms ease, border-color 220ms ease",
        "&:hover, &:focus-within": { transform: "translateY(-4px)", boxShadow: `0 16px 36px ${COLORS.PURPLE_ALPHA_20}` },
        "&:active": { transform: "scale(0.99)" },
        "&:hover .media img": { transform: "scale(1.06)" },
        "&:hover .cta, &:focus-within .cta": { bgcolor: COLORS.PRIMARY_PURPLE, color: "#fff" },
        "&:hover .cta-arrow": { transform: "translateX(3px)" },
        "&:hover .share, &:focus-within .share": { opacity: 1 },
        "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover, &:focus-within": { transform: "none" }, "& .media img, & .cta-arrow": { transition: "none" }, "&:hover .media img, &:hover .cta-arrow": { transform: "none" } },
      }}
    >
      <Box className="media" sx={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", bgcolor: COLORS.PURPLE_ALPHA_10 }}>
        {images.length > 0 && (
          <Box
            component="img"
            src={images[idx]}
            alt=""
            loading="lazy"
            decoding="async"
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 600ms cubic-bezier(.2,.7,.2,1)" }}
          />
        )}

        <Box sx={{ position: "absolute", top: 10, left: 10, right: 52, display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          {category && <Box sx={{ ...pill, ...glass, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#3b1a8a" }}>{category}</Box>}
          {isNew(s.created_at) && <Box sx={{ ...pill, bgcolor: "#16a34a", color: "#fff" }}>New</Box>}
        </Box>

        <Box
          component="button"
          type="button"
          className="share"
          onClick={share}
          aria-label={shared ? "Link copied" : `Share ${s.name}`}
          sx={{ position: "absolute", top: 6, right: 6, zIndex: 2, width: 44, height: 44, border: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: { xs: 1, md: 0 }, transition: "opacity 160ms ease, transform 160ms ease", ...glass, "&:hover": { transform: "scale(1.08)" }, "&:focus-visible": { opacity: 1, outline: `3px solid ${COLORS.PRIMARY_PURPLE}` } }}
        >
          {shared ? <CheckRoundedIcon sx={{ fontSize: 18, color: "#16a34a" }} /> : <IosShareRoundedIcon sx={{ fontSize: 18 }} />}
        </Box>

        {price && <Box sx={{ ...pill, ...glass, position: "absolute", left: 10, bottom: 10, fontSize: "0.74rem" }}>From ₹{price.toLocaleString("en-IN")}</Box>}

        {images.length > 1 && (
          <Box aria-hidden sx={{ position: "absolute", right: 10, bottom: 14, display: "flex", gap: 0.5 }}>
            {images.slice(0, 5).map((_, i) => (
              <Box key={i} sx={{ width: i === idx ? 14 : 6, height: 6, borderRadius: 3, bgcolor: i === idx ? "#fff" : "rgba(255,255,255,0.6)", boxShadow: "0 1px 3px rgba(0,0,0,0.3)", transition: "width 200ms ease" }} />
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 0.75, flex: 1 }}>
        <Typography
          component="h3"
          sx={{ m: 0, fontSize: "1.02rem", fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.015em", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          <Link
            href={href}
            prefetch={false}
            style={{ color: "inherit", textDecoration: "none" }}
            className="service-link"
          >
            {s.name}
            {/* stretch the link hit-area over the whole card */}
            <span aria-hidden style={{ position: "absolute", inset: 0, zIndex: 1 }} />
          </Link>
        </Typography>

        {s.description && (
          <Typography sx={{ fontSize: "0.82rem", color: "text.secondary", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {s.description}
          </Typography>
        )}

        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 12px", minHeight: 22 }}>
          {rating != null ? (
            <Typography sx={{ display: "flex", alignItems: "center", fontSize: "0.8rem", fontWeight: 700 }}>
              <StarRoundedIcon sx={{ fontSize: 17, color: "#f5a623", mr: 0.25 }} />
              {rating.toFixed(1)}
              <Box component="span" sx={{ ml: 0.5, fontWeight: 400, color: "text.secondary" }}>({reviews})</Box>
            </Typography>
          ) : (
            <Typography sx={{ fontSize: "0.76rem", color: "text.secondary" }}>No reviews yet</Typography>
          )}
          {s.city_town && (
            <Typography sx={{ display: "flex", alignItems: "center", fontSize: "0.78rem", color: "text.secondary" }}>
              <PlaceRoundedIcon sx={{ fontSize: 15, mr: 0.25 }} />
              {s.city_town}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: "auto", pt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="button"
            type="button"
            onClick={() => onOpenProvider(s.provider_id)}
            aria-label={`View profile of ${providerName}`}
            sx={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1, minHeight: 44, p: 0, border: 0, bgcolor: "transparent", cursor: "pointer", textAlign: "left", font: "inherit", color: "inherit", borderRadius: 3, "&:hover .pname": { color: lift }, "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 } }}
          >
            <Avatar src={s.provider_profile_pic || undefined} alt="" sx={{ width: 32, height: 32, fontSize: 13 }}>{s.provider_first_name?.[0]}</Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: "0.66rem", color: "text.secondary", lineHeight: 1.1 }}>Offered by</Typography>
              <Typography className="pname" noWrap sx={{ fontSize: "0.82rem", fontWeight: 700, lineHeight: 1.3, transition: "color 150ms ease" }}>{providerName}</Typography>
            </Box>
          </Box>
          <Box
            className="cta"
            aria-hidden
            sx={{ height: 40, px: 1.75, flexShrink: 0, borderRadius: 3, display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.82rem", fontWeight: 800, bgcolor: COLORS.PURPLE_ALPHA_10, color: lift, transition: "background-color 180ms ease, color 180ms ease" }}
          >
            View <ArrowForwardRoundedIcon className="cta-arrow" sx={{ fontSize: 16, transition: "transform 180ms ease" }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default memo(ServiceCard);
