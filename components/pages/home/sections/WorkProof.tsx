"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { Box, useTheme } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { COLORS } from "@/constants/colors";
import { useGetInfinitePosts } from "@/hooks/usePosts";
import { Visibility } from "@/services/post/postInterfaces";
import { PANEL_PX, Section, SectionHeader } from "./shared";

const POST_LIMIT = 8;

/** Mosaic spans (first tile large, then a tall one) so the grid reads like the design without any fixed content. */
const SPANS: ReadonlyArray<object> = [
  { gridColumn: { md: "span 2" }, gridRow: { md: "span 2" } },
  { gridRow: { md: "span 2" } },
];

/**
 * "Discover what's happening around you": real public image posts from providers.
 * Views are shown only when the count is > 0. Renders nothing without posts.
 */
export default function WorkProof() {
  const dark = useTheme().palette.mode === "dark";
  const { data } = useGetInfinitePosts({ limit: 12, visibility: Visibility.PUBLIC });

  const posts = useMemo(
    () =>
      (data?.pages.flatMap((p) => p.posts) ?? [])
        .filter((p) => p.post_type === "image" && !!p.media_urls)
        .slice(0, POST_LIMIT),
    [data]
  );

  if (posts.length === 0) return null;

  return (
    <Section
      sx={{
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 5 },
        borderRadius: { xs: 0, md: 7 },
        bgcolor: dark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
      }}
    >
      <SectionHeader
        title="Discover what's happening around you"
        subtitle="Real work posted by providers on Kartsquare."
        action={
          <Box
            component={Link}
            href="/cus/reels"
            sx={{ display: "inline-flex", alignItems: "center", gap: 1, minHeight: 46, px: 2.5, borderRadius: 3, bgcolor: "background.paper", color: "text.primary", fontWeight: 700, fontSize: "0.92rem", textDecoration: "none", boxShadow: `0 2px 10px ${COLORS.PURPLE_ALPHA_10}`, transition: "background-color 160ms ease", "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_10 } }}
          >
            Explore more <ArrowForwardRoundedIcon sx={{ fontSize: 17 }} />
          </Box>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
          gridAutoRows: { xs: 180, md: 210 },
          gridAutoFlow: "dense",
          gap: 1.25,
        }}
      >
        {posts.map((p, i) => {
          return (
            <Box
              key={p.id}
              component={Link}
              href="/cus/reels"
              aria-label="View post"
              sx={{
                position: "relative",
                display: "block",
                borderRadius: 2.5,
                overflow: "hidden",
                textDecoration: "none",
                backgroundColor: COLORS.PURPLE_ALPHA_10,
                backgroundImage: `url(${p.media_urls})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 220ms cubic-bezier(.2,.7,.2,1), box-shadow 220ms ease",
                "&:hover": { transform: "translateY(-3px)", boxShadow: `0 14px 30px ${COLORS.PURPLE_ALPHA_20}` },
                "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } },
                ...(SPANS[i] ?? {}),
                "&:focus-visible": { outline: `3px solid ${COLORS.PRIMARY_PURPLE}`, outlineOffset: 2 },
              }}
            >
            </Box>
          );
        })}
      </Box>
    </Section>
  );
}
