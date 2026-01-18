import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";

interface SavedCardProps {
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  title: string;
  description: string;
  price: number;
  providerName: string;
  providerAvatar: string;
}

const SavedCard: React.FC<SavedCardProps> = ({
  image,
  rating,
  reviewCount,
  category,
  title,
  description,
  price,
  providerName,
  providerAvatar,
}) => {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "none",
        border: "none",
        backgroundColor: "transparent",
        maxWidth: 345,
        position: "relative",
      }}
    >
      <Box
        sx={{ position: "relative", borderRadius: "16px", overflow: "hidden" }}
      >
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={title}
          sx={{ objectFit: "cover" }}
        />
        {/* Rating Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            borderRadius: "20px",
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: "0.75rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <StarIcon sx={{ fontSize: "1rem", color: "#FFD700" }} />
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            {rating}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            ({reviewCount})
          </Typography>
        </Box>

        {/* Category Chip */}
        <Chip
          label={category}
          sx={{
            position: "absolute",
            bottom: 12,
            left: 12,
            backgroundColor: "white",
            color: "black",
            fontWeight: "bold",
            borderRadius: "20px",
            height: "24px",
            fontSize: "0.75rem",
          }}
        />

        {/* Like Button */}
        <IconButton
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(4px)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
            width: 32,
            height: 32,
          }}
        >
          <FavoriteIcon sx={{ fontSize: "1.2rem", color: "#FF4081" }} />
        </IconButton>
      </Box>

      <CardContent sx={{ px: 0, pt: 2, "&:last-child": { pb: 0 } }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              overflow: "hidden",
              mr: 1,
              position: "relative",
            }}
          >
            <CardMedia
              component="img"
              image={providerAvatar}
              alt={providerName}
              sx={{ objectFit: "cover" }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
            by
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            {providerName}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
            BHD
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {price.toFixed(2)}
          </Typography>
        </Box>

        <Typography
          gutterBottom
          variant="subtitle1"
          component="div"
          sx={{ fontWeight: "bold", lineHeight: 1.2 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            fontSize: "0.8rem",
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SavedCard;
