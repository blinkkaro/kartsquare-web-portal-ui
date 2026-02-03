import React from "react";
import { Box, Typography, Card, CardMedia, useTheme } from "@mui/material";
import { Star } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { truncateHTML } from "@/helper/helper";

interface TopRankedItemProps {
  rank: number;
  image: string;
  name: string;
  rating: number;
  bookings?: number;
  desc?: string;
}

const TopRankedItem: React.FC<TopRankedItemProps> = ({
  rank,
  image,
  name,
  rating,
  bookings,
  desc,
}) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        mb: 2,
        borderRadius: 3,
        boxShadow: 1,
        backgroundColor: COLORS.BACKGROUND.PRIMARY_LIGHT,
      }}
    >
      {/* Rank */}
      <Box sx={{ width: 40, textAlign: "center", mr: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {rank}
        </Typography>
      </Box>
      {/* Image */}
      <CardMedia
        component="img"
        src={image || undefined}
        alt={name}
        sx={{
          width: 60,
          height: 60,
          borderRadius: 2,
          objectFit: "cover",
          mr: 2,
        }}
      />
      {/* Info */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
          {name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Star sx={{ fontSize: 18, color: "#FFB400" }} />
            <Typography sx={{ fontWeight: 600 }}>{rating}</Typography>
          </Box>
          {bookings && (
            <Typography
              sx={{ fontSize: "0.9rem", color: COLORS.TEXT.SECONDARY_LIGHT }}
            >
              {bookings} bookings
            </Typography>
          )}
        </Box>
        {desc && (
          <Typography
            sx={{ fontSize: "0.85rem", color: COLORS.TEXT.SECONDARY_LIGHT }}
            dangerouslySetInnerHTML={{
              __html: truncateHTML(desc, 40),
            }}
          />
        )}
      </Box>
    </Card>
  );
};

export default TopRankedItem;
