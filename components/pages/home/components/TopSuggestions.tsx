import React from "react";
import {
  Box,
  Card,
  Typography,
  useTheme,
  Avatar,
  Button,
  CardMedia,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import Link from "next/link";
import { Star } from "@mui/icons-material";
import { useTranslate } from "@/hooks/useTranslate";

// Interfaces
interface SuggestionItem {
  id: number;
  image: string;
  name: string;
  category: string;
  rating: number;
  collaborationCount?: number; // specific to suppliers/brands
}

interface SectionProps {
  title: string;
  items: SuggestionItem[];
}

// Dummy Data
const TOP_OCTOPUS: SuggestionItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
    name: "Turfa al-Shah",
    category: "Hair stylist",
    rating: 4.8,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    name: "Saood al-Din",
    category: "Digital designer",
    rating: 4.7,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
    name: "Azza al-Massri",
    category: "Fashion designer",
    rating: 4.9,
  },
];

const TOP_SUPPLIERS: SuggestionItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
    name: "Lotus Couture",
    category: "Womens Boutique",
    rating: 4.5,
    collaborationCount: 45,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069&auto=format&fit=crop",
    name: "Shiffa Wellness",
    category: "Health & Beauty",
    rating: 4.8,
    collaborationCount: 32,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=2000&auto=format&fit=crop",
    name: "Hokbyk Modest",
    category: "Modest Fashion",
    rating: 4.6,
    collaborationCount: 28,
  },
];


const SuggestionSection = ({ title, items }: SectionProps) => {
  const theme = useTheme();
  const { t } = useTranslate();

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 4,
        boxShadow: "none",
        backgroundColor:
          theme.palette.mode === "dark"
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PRIMARY_LIGHT,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          component={Link}
          href="#"
          sx={{
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
            fontWeight: 600,
            textDecoration: "underline",
            fontSize: "0.75rem",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          {t("seeall")}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "32%", // approx 1/3
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "1/1",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  style={{
                    width: "100%",
                    height: "7rem",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Rating Badge */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  bgcolor: "#2B2B39",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.2,
                  px: 0.8,
                  py: 0.2,
                  borderRadius: 4,
                  border: "2px solid white",
                  zIndex: 2,
                  boxShadow: 2,
                }}
              >
                <Star sx={{ fontSize: 10, color: "#FFB400" }} />
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 700 }}>
                  {item.rating}
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.8rem",
                textAlign: "center",
                mt: 1.5,
                lineHeight: 1.2,
                color:
                  theme.palette.mode === "dark"
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.65rem",
                color:
                  theme.palette.mode === "dark"
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                textAlign: "center",
                lineHeight: 1.2,
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {item.category}
            </Typography>
            {item.collaborationCount && (
              <Typography
                sx={{
                  fontSize: "0.6rem",
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  textAlign: "center",
                  mt: 0.2,
                }}
              >
                {item.collaborationCount} Collab
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Card>
  );
};

const TopSuggestions = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <SuggestionSection title="Top Octopus" items={TOP_OCTOPUS} />
      <SuggestionSection title="Top Suppliers" items={TOP_SUPPLIERS} />
      {/* <SuggestionSection title="Top Brands" items={TOP_BRANDS} /> */}
    </Box>
  );
};

export default TopSuggestions;
