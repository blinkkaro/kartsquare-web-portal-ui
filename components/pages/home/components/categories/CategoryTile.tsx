"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { COLORS } from "@/constants/colors";
import SectionCard from "@/components/common/SectionCard";
import { getCategoryIconComponent, getCategoryTileColor } from "@/components/common/categoryIcons";

export interface HomeCategory {
  id: string;
  name: string;
}

const tileSx = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  gap: 1,
  p: 1,
  // Fixed square, same for every tile regardless of label length —
  // the text below is clamped instead of stretching the box.
  aspectRatio: "1 / 1",
  width: "100%",
  cursor: "pointer",
  transition: "transform 0.15s, box-shadow 0.15s",
  "&:hover": { transform: "translateY(-2px)" },
};

const iconCircleSx = {
  width: { xs: 36, sm: 42, md: 46 },
  height: { xs: 36, sm: 42, md: 46 },
  flexShrink: 0,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const labelSx = {
  fontWeight: 600,
  textAlign: "center" as const,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
  lineHeight: 1.25,
  fontSize: { xs: "0.7rem", sm: "0.74rem", md: "0.78rem" },
};

export const CategoryTile = ({
  category,
  index,
  onClick,
}: {
  category: HomeCategory;
  index: number;
  onClick: () => void;
}) => {
  const palette = getCategoryTileColor(index);
  const Icon = getCategoryIconComponent(category.name);
  return (
    <SectionCard size="md" onClick={onClick} sx={tileSx}>
      <Box sx={{ ...iconCircleSx, bgcolor: palette.bg, color: palette.fg }}>
        <Icon fontSize="small" />
      </Box>
      <Typography variant="caption" color="text.primary" sx={labelSx}>
        {category.name}
      </Typography>
    </SectionCard>
  );
};

export const MoreCategoriesTile = ({ onClick }: { onClick: () => void }) => (
  <SectionCard size="md" onClick={onClick} sx={tileSx}>
    <Box
      sx={{
        ...iconCircleSx,
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "#f1f0fe"),
        color: COLORS.PRIMARY_PURPLE,
      }}
    >
      <MoreHorizIcon fontSize="small" />
    </Box>
    <Typography variant="caption" color="text.primary" sx={labelSx}>
      More
    </Typography>
  </SectionCard>
);
