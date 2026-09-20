"use client";
import React from "react";
import { Avatar, Box, Button, Skeleton, Typography, useTheme } from "@mui/material";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useTopSuggestions } from "@/hooks/useTopSuggestions";
import { useAppDispatch } from "@/store/hooks";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { getServiceRouteParam } from "@/utils/serviceRoute";
import { TopProvider, TopService } from "@/services/topSuppliers/topSupplires.interfaces";
import { Section, SectionHeader, scrollRow, tappableCard } from "./shared";

const NEW_WINDOW_DAYS = 30;

const isNew = (createdAt?: string) => {
  const t = createdAt ? Date.parse(createdAt) : NaN;
  return Number.isFinite(t) && Date.now() - t < NEW_WINDOW_DAYS * 86_400_000;
};

const pill = {
  px: 1.1,
  py: 0.35,
  borderRadius: 99,
  fontSize: "0.68rem",
  fontWeight: 800,
  lineHeight: 1.2,
  backdropFilter: "blur(6px)",
} as const;

/**
 * Top services + providers straight from the ranking endpoint. Every detail is a real
 * field: name, description, price (when set), category, city, review count, provider.
 * A rating is shown only when the service has real reviews - otherwise "No reviews yet"
 * (the endpoint's raw average can be a default, so it is never shown on its own).
 */
export default function TopPros() {
  const dark = useTheme().palette.mode === "dark";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { provider, servicer, isLoading } = useTopSuggestions("8");

  const services: TopService[] = servicer ?? [];
  const providers: TopProvider[] = provider ?? [];

  if (!isLoading && services.length === 0 && providers.length === 0) return null;

  return (
    <Section id="top-pros">
      <SectionHeader
        eyebrow="Trending"
        title="Popular on Kartsquare"
        subtitle="Top-ranked services and providers right now"
        action={
          <Button
            onClick={() => router.push("/cus/servicesList")}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ minHeight: 44, textTransform: "none", fontWeight: 700, color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE, flexShrink: 0 }}
          >
            See all
          </Button>
        }
      />

      {isLoading ? (
        <Box sx={scrollRow}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" width={280} height={340} sx={{ flexShrink: 0, borderRadius: 5 }} />
          ))}
        </Box>
      ) : (
        <>
          {services.length > 0 && (
            <Box sx={scrollRow}>
              {services.map((s) => {
                const category = s.category_name?.[0];
                const providerName = [s.provider_first_name, s.provider_last_name].filter(Boolean).join(" ");
                const reviews = Number(s.review_count ?? 0);
                const rating = reviews > 0 && Number(s.rating) > 0 ? Number(s.rating) : null;
                const fresh = isNew(s.created_at);
                const open = () => router.push(`/services/${getServiceRouteParam(s)}`);
                return (
                  <Box
                    key={s.id}
                    component="article"
                    role="link"
                    tabIndex={0}
                    aria-label={`${s.name} by ${providerName}`}
                    onClick={open}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        open();
                      }
                    }}
                    sx={{
                      ...tappableCard,
                      cursor: "pointer",
                      flexShrink: 0,
                      width: { xs: 272, md: 292 },
                      overflow: "hidden",
                      scrollSnapAlign: "start",
                      borderRadius: 5,
                      display: "flex",
                      flexDirection: "column",
                      "&:hover .go": { bgcolor: COLORS.PRIMARY_PURPLE, color: "#fff" },
                      "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 },
                    }}
                  >
                    {/* image + overlay tags */}
                    <Box
                      sx={{
                        position: "relative",
                        height: 152,
                        bgcolor: COLORS.PURPLE_ALPHA_10,
                        backgroundImage: s.image_urls?.[0] ? `url(${s.image_urls[0]})` : `linear-gradient(135deg, ${COLORS.PURPLE_ALPHA_20}, ${COLORS.PURPLE_ALPHA_04})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      role="img"
                      aria-label={s.name}
                    >
                      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)" }} />
                      <Box sx={{ position: "absolute", top: 10, left: 10, right: 10, display: "flex", justifyContent: "space-between", gap: 1 }}>
                        {category ? (
                          <Box sx={{ ...pill, maxWidth: "70%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", bgcolor: "rgba(255,255,255,0.92)", color: "#3b1a8a" }}>{category}</Box>
                        ) : (
                          <span />
                        )}
                        {fresh && <Box sx={{ ...pill, bgcolor: "#16a34a", color: "#fff" }}>New</Box>}
                      </Box>
                      {Number(s.price) > 0 && (
                        <Box sx={{ position: "absolute", left: 10, bottom: 10, px: 1.25, py: 0.4, borderRadius: 99, bgcolor: "rgba(255,255,255,0.95)", color: "#21172e", fontSize: "0.74rem", fontWeight: 800 }}>
                          Starts at ₹{s.price}
                        </Box>
                      )}
                    </Box>

                    {/* details */}
                    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 0.9, flex: 1 }}>
                      <Typography noWrap sx={{ fontWeight: 800, fontSize: "1rem", lineHeight: 1.25 }}>{s.name}</Typography>

                      {s.description && (
                        <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {s.description}
                        </Typography>
                      )}

                      {/* rating / place */}
                      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.25 }}>
                        {rating != null ? (
                          <Typography sx={{ display: "flex", alignItems: "center", fontSize: "0.78rem", fontWeight: 700 }}>
                            <StarRoundedIcon sx={{ fontSize: 17, color: "#f5a623", mr: 0.25 }} />
                            {rating.toFixed(1)}
                            <Box component="span" sx={{ ml: 0.5, fontWeight: 400, color: "text.secondary" }}>
                              ({reviews} {reviews === 1 ? "review" : "reviews"})
                            </Box>
                          </Typography>
                        ) : (
                          <Typography sx={{ fontSize: "0.74rem", color: "text.disabled" }}>No reviews yet</Typography>
                        )}
                        {s.city_town && (
                          <Typography sx={{ display: "flex", alignItems: "center", fontSize: "0.76rem", color: "text.secondary" }}>
                            <PlaceRoundedIcon sx={{ fontSize: 15, mr: 0.25 }} />
                            {s.city_town}
                          </Typography>
                        )}
                      </Box>

                      {/* provider + CTA */}
                      <Box sx={{ mt: "auto", pt: 1, borderTop: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar src={s.provider_profile_pic || undefined} alt="" sx={{ width: 28, height: 28, fontSize: 12 }}>
                          {s.provider_first_name?.[0]}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontSize: "0.66rem", color: "text.disabled", lineHeight: 1.1 }}>Offered by</Typography>
                          <Typography noWrap sx={{ fontSize: "0.8rem", fontWeight: 700, lineHeight: 1.25 }}>{providerName}</Typography>
                        </Box>
                        <Box
                          className="go"
                          aria-hidden
                          sx={{ height: 34, px: 1.25, flexShrink: 0, borderRadius: 99, display: "flex", alignItems: "center", gap: 0.4, fontSize: "0.76rem", fontWeight: 800, bgcolor: COLORS.PURPLE_ALPHA_10, color: dark ? "#d6b8ff" : COLORS.PRIMARY_PURPLE, transition: "background-color 160ms ease, color 160ms ease", "@media (prefers-reduced-motion: reduce)": { transition: "none" } }}
                        >
                          View <ArrowOutwardRoundedIcon sx={{ fontSize: 16 }} />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {providers.length > 0 && (
            <>
              <Typography sx={{ mt: 2, mb: 0.75, fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary" }}>
                Top providers
              </Typography>
              <Box sx={scrollRow}>
                {providers.map((p) => {
                  const name = p.business_name || [p.first_name, p.last_name].filter(Boolean).join(" ");
                  const bookings = Number(p.total_bookings);
                  return (
                    <Box
                      key={p.id}
                      component="article"
                      role="button"
                      tabIndex={0}
                      aria-label={`View ${name}`}
                      onClick={() => dispatch(openDrawer({ userId: p.id }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          dispatch(openDrawer({ userId: p.id }));
                        }
                      }}
                      sx={{ ...tappableCard, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", gap: 1.25, p: 1.25, pr: 1.25, minHeight: 68, minWidth: 236, scrollSnapAlign: "start", "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 } }}
                    >
                      <Avatar src={p.profile_pic || undefined} alt="" sx={{ width: 46, height: 46 }}>{name?.[0]}</Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography noWrap sx={{ fontWeight: 800, fontSize: "0.88rem", maxWidth: 160 }}>{name}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", color: "text.secondary", fontSize: "0.72rem" }}>
                          {p.city && (
                            <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                              <PlaceRoundedIcon sx={{ fontSize: 14, mr: 0.15 }} />
                              {p.city}
                            </Box>
                          )}
                          {bookings > 0 && <span>{bookings} bookings</span>}
                        </Box>
                      </Box>
                      <ChevronRightRoundedIcon sx={{ color: "text.disabled" }} />
                    </Box>
                  );
                })}
              </Box>
            </>
          )}
        </>
      )}
    </Section>
  );
}
