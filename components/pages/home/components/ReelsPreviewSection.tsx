"use client";
import React, { useState } from "react";
import { Box, Typography, useTheme, Avatar } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { COLORS } from "@/constants/colors";
import { useGetReels } from "@/hooks/usePosts";
import { getMediaUrls } from "@/helper/helper";
import ReelViewModal from "@/components/pages/myAccount/components/post/ReelViewModal";
import SectionCard from "@/components/common/SectionCard";

const ReelsPreviewSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { data, isLoading } = useGetReels();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const reels = data?.pages.flatMap((page) => page.posts) || [];

  if (isLoading) return null;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Live Service Previews
      </Typography>

      {reels.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          No reels to show yet.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 1,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {reels.map((reel, index) => {
            const urls = getMediaUrls(reel.media_urls);
            const thumbUrl = urls[0];
            const providerName = reel.user?.business_name || reel.user?.first_name || "Provider";

            return (
              <SectionCard
                key={reel.id}
                size="md"
                onClick={() => setViewerIndex(index)}
                sx={{
                  position: "relative",
                  flex: "0 0 auto",
                  width: { xs: 140, sm: 170 },
                  aspectRatio: "3/4",
                  overflow: "hidden",
                  cursor: "pointer",
                  p: 0,
                  bgcolor: isDark
                    ? COLORS.BACKGROUND.SECONDARY_DARK
                    : COLORS.BACKGROUND.SECONDARY_LIGHT,
                }}
              >
                {thumbUrl && (
                  <Box
                    component="img"
                    src={thumbUrl}
                    alt={providerName}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.7) 100%)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.85)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PlayArrowIcon sx={{ color: "#111" }} />
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    right: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                  }}
                >
                  <Avatar
                    src={reel.user?.profile_pic || undefined}
                    sx={{ width: 20, height: 20, border: "1px solid rgba(255,255,255,0.8)" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: COLORS.WHITE,
                      fontWeight: 600,
                      textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {providerName}
                  </Typography>
                </Box>
              </SectionCard>
            );
          })}
        </Box>
      )}

      {viewerIndex !== null && (
        <ReelViewModal
          open={viewerIndex !== null}
          onClose={() => setViewerIndex(null)}
          reels={reels}
          initialIndex={viewerIndex}
        />
      )}
    </Box>
  );
};

export default ReelsPreviewSection;
