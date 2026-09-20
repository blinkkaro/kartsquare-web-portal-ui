"use client";
import React, { useMemo } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useGetInfinitePosts } from "@/hooks/usePosts";
import { Visibility } from "@/services/post/postInterfaces";
import { Section, SectionHeader } from "./shared";

/** Real public posts (image type) from providers; views shown only when the count is > 0. */
export default function WorkProof() {
  const router = useRouter();
  const { data } = useGetInfinitePosts({ limit: 12, visibility: Visibility.PUBLIC });

  const posts = useMemo(
    () =>
      (data?.pages.flatMap((p) => p.posts) ?? [])
        .filter((p) => p.post_type === "image" && !!p.media_urls)
        .slice(0, 3),
    [data]
  );

  if (posts.length === 0) return null;

  return (
    <Section>
      <SectionHeader
        title="Recent work"
        subtitle="Posts from providers on Kartsquare"
        action={
          <Button onClick={() => router.push("/cus/reels")} endIcon={<ArrowForwardRoundedIcon />} sx={{ minHeight: 44, textTransform: "none", fontWeight: 700, color: COLORS.PRIMARY_PURPLE, flexShrink: 0 }}>
            Reels
          </Button>
        }
      />
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: { xs: 1, md: 2 } }}>
        {posts.map((p) => {
          const views = Number(p.views_count);
          return (
            <Box
              key={p.id}
              component="article"
              onClick={() => router.push("/cus/reels")}
              sx={{ position: "relative", aspectRatio: "9 / 14", borderRadius: 4, overflow: "hidden", cursor: "pointer", backgroundColor: COLORS.PURPLE_ALPHA_10, backgroundImage: `url(${p.media_urls})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <Box sx={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", p: 1, color: "#fff", background: "linear-gradient(to top, rgba(0,0,0,0.78), transparent 60%)" }}>
                {views > 0 && (
                  <Typography sx={{ display: "flex", alignItems: "center", gap: 0.4, fontSize: "0.65rem", fontWeight: 700 }}>
                    <VisibilityRoundedIcon sx={{ fontSize: 12 }} /> {views}
                  </Typography>
                )}
                {p.caption && (
                  <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {p.caption}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Section>
  );
}
