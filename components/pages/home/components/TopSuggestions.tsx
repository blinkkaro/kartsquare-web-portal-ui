import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  useTheme,
  CardMedia,
  IconButton,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
// import Link from "next/link";
import { Star } from "@mui/icons-material";
import { useTranslate } from "@/hooks/useTranslate";
import { useTopSuggestions } from "@/hooks/useTopSuggestions";
import {
  TopProvider,
  TopService,
} from "@/services/topSuppliers/topSupplires.interfaces";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import RightDrawer from "@/components/common/RightDrawer";
import TopRankedItem from "./TopRankedItem";
import { truncateHTML } from "@/helper/helper";

interface SectionProps {
  title: string;
  items: TopService[] | TopProvider[];
  onSeeAll: () => void;
}

const SuggestionSection = ({ title, items, onSeeAll }: SectionProps) => {
  const theme = useTheme();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleOnCardClick = (item: TopService | TopProvider) => {
    if ("profile_pic" in item) {
      dispatch(openDrawer({ userId: item.id }));
    } else {
      router.push(`/services/${item.id}`);
    }
  };

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
          onClick={onSeeAll}
        >
          {t("seeall")}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        {items
          .filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.id === item.id),
          )
          .slice(0, 3)
          .map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: { xs: "30%", sm: "32%" }, // responsive width
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={(e) => {
                handleOnCardClick(item);
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
                    src={
                      // Type guard for TopProvider
                      "profile_pic" in item && item.profile_pic
                        ? item.profile_pic
                        : "image_urls" in item &&
                            Array.isArray(item.image_urls) &&
                            item.image_urls.length > 0
                          ? item.image_urls[0]
                          : undefined
                    }
                    alt={"name" in item ? item.name : "Image"}
                    width={100}
                    height={100}
                    style={{
                      width: "100%",
                      height: "100%", // Fit container
                      aspectRatio: "1/1",
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
                {"name" in item
                  ? item.name
                  : `${item.first_name} ${item.last_name}`}
              </Typography>
              {"description" in item && item.description && (
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
                  dangerouslySetInnerHTML={{
                    __html: truncateHTML(item.description, 30),
                  }}
                />
              )}
            </Box>
          ))}
      </Box>
    </Card>
  );
};

const TopSuggestions = () => {
  const { provider, servicer, isLoading } = useTopSuggestions("10");
  const { t } = useTranslate();
  const theme = useTheme();

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<"provider" | "service" | null>(
    null,
  );

  // Handler for See All
  const handleSeeAll = (type: "provider" | "service") => {
    setDrawerType(type);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setDrawerType(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 4,
          boxShadow: "none",
          backgroundColor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PRIMARY_DARK
              : COLORS.BACKGROUND.PRIMARY_LIGHT,
          height: "5rem",
        }}
      >
        {t("loading")}
      </Box>
    );
  }

  if (!provider?.length && !servicer?.length) {
    return (
      <Box
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
        {t("noSuggestionsAvailable")}
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {provider && (
          <SuggestionSection
            title={t("topProviders")}
            items={provider || []}
            onSeeAll={() => handleSeeAll("provider")}
          />
        )}
        {servicer && (
          <SuggestionSection
            title={t("topServices")}
            items={servicer || []}
            onSeeAll={() => handleSeeAll("service")}
          />
        )}
      </Box>
      <RightDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        title={drawerType === "provider" ? t("topProviders") : t("topServices")}
        width={500}
      >
        <Box sx={{ p: 2 }}>
          {drawerType === "provider" &&
            provider &&
            [...provider]
              .sort((a, b) => b.rating - a.rating)
              .map((item, index) => (
                <TopRankedItem
                  key={item.id}
                  rank={index + 1}
                  image={item.profile_pic}
                  name={`${item.first_name} ${item.last_name}`}
                  rating={item.rating}
                  bookings={parseInt(item.total_bookings)}
                  desc={`${item.city}, ${item.country}`}
                />
              ))}
          {drawerType === "service" &&
            servicer &&
            [...servicer]
              .sort((a, b) => b.rating - a.rating)
              .map((item, index) => (
                <TopRankedItem
                  key={item.id}
                  rank={index + 1}
                  image={item.image_urls[0] || ""}
                  name={item.name}
                  rating={item.rating}
                  desc={item.description}
                />
              ))}
        </Box>
      </RightDrawer>
    </>
  );
};

export default TopSuggestions;
