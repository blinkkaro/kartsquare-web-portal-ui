"use client";
import React from "react";
import Link from "next/link";
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { COLORS } from "@/constants/colors";
import { Posts } from "@/services/post/postInterfaces";
import { isVideoUrl, postMedia } from "./FeedPostCard";

const reelHref = (reel: Posts) => `/cus/reels?reel=${encodeURIComponent(reel.id)}`;
const reelName = (reel: Posts) =>
  reel.user?.business_name?.trim() || `${reel.user?.first_name ?? ""} ${reel.user?.last_name ?? ""}`.trim() || "Reel";
/** "1.2k" style view count; null when there are no views yet. */
const views = (reel: Posts) => {
  const n = Number(reel.views_count) || 0;
  if (n <= 0) return null;
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
};

/** One reel tile: the first frame of the video, the creator and the view count. */
function ReelTile({ reel, width }: { reel: Posts; width: number | string | { xs: number; sm: number } }) {
  // Reels carry a thumbnail image before the video file: show the image.
  const urls = postMedia(reel);
  const thumb = urls.find((u) => !isVideoUrl(u));
  const video = urls.find(isVideoUrl);
  const name = reelName(reel);
  const viewCount = views(reel);
  return (
    <Box
      component={Link}
      href={reelHref(reel)}
      aria-label={`Watch reel by ${name}`}
      sx={{
        position: "relative",
        display: "block",
        flexShrink: 0,
        width,
        aspectRatio: "9 / 16",
        borderRadius: "12px",
        overflow: "hidden",
        bgcolor: "#1c1924",
        color: COLORS.WHITE,
        textDecoration: "none",
        "&:focus-visible": { outline: `2px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 },
      }}
    >
      {thumb ? (
        <Box
          component="img"
          src={thumb}
          alt=""
          loading="lazy"
          sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 250ms ease", "a:hover &": { transform: "scale(1.04)" } }}
        />
      ) : video ? (
        <Box
          component="video"
          src={`${video}#t=0.5`}
          muted
          playsInline
          preload="metadata"
          sx={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
        />
      ) : null}
      <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 45%)" }} />
      <Box sx={{ position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 0.25, fontSize: "0.72rem", fontWeight: 700 }}>
        <PlayArrowRoundedIcon sx={{ fontSize: 16 }} />
        {viewCount}
      </Box>
      <Typography sx={{ position: "absolute", left: 8, right: 8, bottom: 8, fontSize: "0.76rem", fontWeight: 700 }} noWrap>
        {name}
      </Typography>
    </Box>
  );
}

/** "Reels for you" strip shown between posts. */
export function FeedReelsStrip({ reels }: { reels: Posts[] }) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  if (reels.length === 0) return null;
  const border = dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT;
  return (
    <Box
      component="section"
      aria-label="Reels for you"
      sx={{
        bgcolor: "background.paper",
        mb: { xs: 1.25, sm: 2.25 },
        p: { xs: 1.5, sm: 2 },
        // Edge-to-edge band on phones, a card from tablet up.
        // Each border names its colour: a bare "1px solid" inside a breakpoint
        // would reset it to the text colour.
        border: { xs: "none", sm: `1px solid ${border}` },
        borderTop: `1px solid ${border}`,
        borderBottom: `1px solid ${border}`,
        borderRadius: { xs: 0, sm: "16px" },
        boxShadow: { xs: "none", sm: dark ? COLORS.NEW_UI.CARD_SHADOW_DARK : COLORS.NEW_UI.CARD_SHADOW_LIGHT },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography component="h2" sx={{ fontSize: "0.95rem", fontWeight: 800, color: "text.primary" }}>
          Reels for you
        </Typography>
        <Box component={Link} href="/cus/reels" sx={{ fontSize: "0.84rem", fontWeight: 700, color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
          See all
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 1.25, overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        {reels.slice(0, 8).map((reel) => (
          <ReelTile key={reel.id} reel={reel} width={{ xs: 112, sm: 132 }} />
        ))}
      </Box>
    </Box>
  );
}

/** The Reels tab: a 3-column grid of reel tiles. */
export function FeedReelsGrid({ reels, loading }: { reels: Posts[]; loading: boolean }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: { xs: 0.5, sm: 1.25 }, px: { xs: 0.5, sm: 0 } }}>
      {loading
        ? Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" sx={{ width: "100%", aspectRatio: "9 / 16", height: "auto", borderRadius: "12px" }} />
          ))
        : reels.map((reel) => <ReelTile key={reel.id} reel={reel} width="100%" />)}
    </Box>
  );
}
