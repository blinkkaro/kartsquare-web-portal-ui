import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Typography,
  useTheme,
  Chip,
} from "@mui/material";
import { AdvertiseActiveAd } from "@/services/advertise/advertise.intreface";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";
import { advertiseService } from "@/services/advertise/advertiseServies";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { useDispatch } from "react-redux";

interface AdCardProps {
  ad: AdvertiseActiveAd;
}

const AdCard = ({ ad }: AdCardProps) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAdClick = async () => {
    try {
      await advertiseService.AdvertiseClicked(ad.advertise_id);
      router.push(`/services/${ad.service_id}`);
    } catch (error) {
      console.error("Error tracking ad click:", error);
      router.push(`/services/${ad.service_id}`);
    }
  };

  return (
    <Card sx={{ boxShadow: "none", background: "transparent" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          m: 2,
        }}
        onClick={() => dispatch(openDrawer({ userId: ad.provider_id }))}
      >
        <Avatar
          sx={{
            cursor: "pointer",
            width: 40,
            height: 40,
            border: "2px solid white",
          }}
          src={ad.provider_profile_url || ""}
          alt={ad.provider_business_name}
        />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {ad.provider_business_name}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: { md: 1 },
          minWidth: { md: 0 },
          borderRadius: 5,
        }}
      >
        {/* Ad Image */}
        <Box
          onClick={handleAdClick}
          sx={{
            width: "100%",
            height: { xs: "50vh", md: "60vh" },
            backgroundColor: "#000",
            borderRadius: 5,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(0.99)",
            },
          }}
        >
          {/* Blurred background image */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${ad.image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(20px)",
              transform: "scale(1.1)",
              opacity: 0.6,
            }}
          />
          {/* Dark overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
          />
          {/* Main image */}
          <CardMedia
            component="img"
            image={ad.image_url}
            loading="lazy"
            alt={ad.title || "Advertisement"}
            sx={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
              maxHeight: "100%",
              position: "relative",
              zIndex: 1,
            }}
          />

          {/* Title and Description overlay */}
          {(ad.title || ad.description) && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)",
                padding: { xs: 2, sm: 3 },
                zIndex: 2,
              }}
            >
              {ad.title && (
                <Typography
                  variant="h6"
                  sx={{
                    color: COLORS.TEXT.PRIMARY_DARK,
                    fontWeight: 600,
                    mb: ad.description ? 0.5 : 0,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  {ad.title}
                </Typography>
              )}
              {ad.description && (
                <Typography
                  variant="body2"
                  sx={{
                    color: COLORS.TEXT.PRIMARY_DARK,
                    opacity: 0.9,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {ad.description}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default AdCard;
