"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Avatar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Link,
  Paper,
  Chip,
  Collapse,
} from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import {
  Share,
  ContentCopy,
  Facebook,
  Twitter,
  WhatsApp,
  Email,
  LocationOn,
  Email as EmailIcon,
  Phone,
  Visibility,
  Favorite,
  People,
  BusinessCenter,
  Work as WorkIcon,
  Article as ArticleIcon,
  ExpandMore,
  ExpandLess,
  MovieFilter,
} from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import {
  useProviderProfileByUsername,
  useFollowProvider,
  useProviderReels,
} from "@/hooks/useProviderProfile";
import { useTranslate } from "@/hooks/useTranslate";
import ServiceCard from "@/components/ServiceCard";
import PostFeedGrid from "@/components/pages/myAccount/components/post/PostFeedGrid";
import { Posts } from "@/services/post/postInterfaces";
import { Service } from "@/services/serviceList/listInteraface";
import { UserRole } from "@/utils/auth";
import ContactUsSection from "./components/ContactUsSection";
import ProviderMapSection from "./components/ProviderMapSection";
import ProfileNotFound from "./components/ProfileNotFound";
import ProviderReviews from "./components/ProviderReviews";
import { AppUserType } from "@/services/auth/auth.interface";
import {
  ISupplierProfile,
  ISupplierProfileResponse,
  ProductListItem,
} from "@/services/profile/profileInterface";
import ProfileProducts from "../../common/ProfileDrawer/components/ProfileProducts";
import ReelFeedGrid from "@/components/pages/myAccount/components/post/ReelFeedGrid";
import ReelViewModal from "@/components/pages/myAccount/components/post/ReelViewModal";

interface ProviderProfilePageProps {
  username: string;
}

const PROFILE_TABS = {
  Posts: "Posts",
  Services: "Services",
  Products: "Products",
  Reels: "Reels",
};

const ProviderProfilePage: React.FC<ProviderProfilePageProps> = ({
  username,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";

  const [activeTab, setActiveTab] = useState(PROFILE_TABS.Services);
  const [shareMenuAnchor, setShareMenuAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    data: profileData,
    isLoading,
    error,
  } = useProviderProfileByUsername(username);

  const isSupplier = profileData?.profile?.role === AppUserType.SUPPLIER;
  const profile = profileData?.profile;

  // Type-safe data extraction
  const services =
    profileData && "services" in profileData ? profileData.services : [];
  const posts = profileData && "posts" in profileData ? profileData.posts : [];
  const products =
    profileData && "products" in profileData ? profileData.products : [];
  
  const {
      data: reelsData,
      isLoading: reelsLoading,
      fetchNextPage: fetchNextReels,
      hasNextPage: hasNextReels,
      isFetchingNextPage: isFetchingNextReels,
    } = useProviderReels(profile?.id || "");

  const followMutation = useFollowProvider(profile?.id || "");

  React.useEffect(() => {
    if (profileData) {
      if (isSupplier) {
        setActiveTab(PROFILE_TABS.Products);
      } else {
        setActiveTab(PROFILE_TABS.Services);
      }
    }
  }, [profileData, isSupplier]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
    setShareMenuAnchor(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareMenuAnchor(null);
  };

  const getProfileUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/in/${username}`;
    }
    return "";
  };

  const handleCopyLink = async () => {
    try {
      const url = getProfileUrl();
      await navigator.clipboard.writeText(url);
      setSnackbarMessage(t("copiedToClipboard") || "Link copied to clipboard!");
      setSnackbarOpen(true);
      handleShareClose();
    } catch (err) {
      setSnackbarMessage(t("copyFailed") || "Failed to copy link");
      setSnackbarOpen(true);
    }
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(getProfileUrl());
    const text = encodeURIComponent(
      `Check out ${profile?.first_name} ${profile?.last_name}'s profile on Kartsquare!`,
    );

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent("Check out this profile")}&body=${text}%20${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
    handleShareClose();
  };

  const handleFollow = () => {
    if (profile) {
      followMutation.mutate(profile.is_following || false);
    }
  };

  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [selectedReelIndex, setSelectedReelIndex] = useState(0);

  const allReels = reelsData?.pages.flatMap((page) => page.posts) || [];

  const handleReelClick = (reel: Posts, index: number) => {
    setSelectedReelIndex(index);
    setIsReelModalOpen(true);
  };

  // Transform posts to match the expected format (media_urls as string)
  const transformedPosts: Posts[] = posts.map((post: any) => ({
    ...post,
    media_urls: Array.isArray(post.media_urls)
      ? post.media_urls[0]
      : post.media_urls,
  }));

  const StatRow = ({
    icon,
    label,
    value,
    iconColor,
    compact = false,
  }: {
    icon: React.ReactElement;
    label: string;
    value: string | number;
    iconColor: string;
    compact?: boolean;
  }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: compact ? 0.75 : 1,
        py: compact ? 0.6 : 1.2,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: compact ? 0.75 : 1.2,
        }}
      >
        <Box
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            "& svg": { fontSize: compact ? 16 : 18, color: iconColor },
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: compact ? "0.8rem" : "0.85rem",
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 700,
          fontSize: compact ? "0.875rem" : "0.95rem",
          color:
            theme.palette.mode === "dark"
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  // Format location from default_address
  const getLocationString = () => {
    if (profile?.default_address) {
      const addr = profile.default_address;
      const parts = [
        addr.building_no,
        addr.address,
        addr.city_town,
        addr.pincode,
        addr.state,
        addr.country,
      ].filter(Boolean);
      return parts.join(", ");
    }
    return profile?.country || "";
  };

  if (isLoading) {
    return <CenteredLoader minHeight="60vh" />;
  }

  if (error || !profile) {
    return <ProfileNotFound />;
  }

  const textPrimary = isDark
    ? COLORS.TEXT.PRIMARY_DARK
    : COLORS.TEXT.PRIMARY_LIGHT;
  const textSecondary = isDark
    ? COLORS.TEXT.SECONDARY_DARK
    : COLORS.TEXT.SECONDARY_LIGHT;
  const borderColorMui = isDark
    ? COLORS.BORDER.DEFAULT_DARK
    : COLORS.BORDER.DEFAULT_LIGHT;
  const cardBg = isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.WHITE;
  const surfaceBg = isDark
    ? COLORS.BACKGROUND.PRIMARY_DARK
    : COLORS.BACKGROUND.SECONDARY_LIGHT;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: surfaceBg }}>
      {/* Hero — business website style cover */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 220, sm: 280, md: 320 },
          overflow: "hidden",
          bgcolor: COLORS.PRIMARY_PURPLE,
        }}
      >
        {profile.banner_image ? (
          <>
            <Image
              src={profile.banner_image}
              alt={`${profile.first_name} ${profile.last_name} — Business`}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to bottom, transparent 30%, ${isDark ? "rgba(23, 32, 35, 0.9)" : "rgba(0,0,0,0.5)"} 100%)`,
              }}
            />
          </>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, ${COLORS.PURPLE_HOVER} 50%, #2d1b69 100%)`,
            }}
          />
        )}
        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            pb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={
                isSupplier
                  ? (profile as ISupplierProfile).logo_url
                  : profile.profile_pic
              }
              alt={
                isSupplier
                  ? (profile as ISupplierProfile).store_name
                  : `${profile.first_name} ${profile.last_name}`
              }
              sx={{
                width: { xs: 72, sm: 88 },
                height: { xs: 72, sm: 88 },
                border: `3px solid ${COLORS.WHITE}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            />
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: COLORS.WHITE,
                  fontSize: { xs: "1.35rem", sm: "1.6rem", md: "1.75rem" },
                  lineHeight: 1.2,
                }}
              >
                {isSupplier
                  ? (profile as ISupplierProfile).store_name
                  : `${profile.first_name} ${profile.last_name}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                @{profile?.username || "-"} ·{" "}
                {isSupplier
                  ? `${t("products")}`
                  : `${t("services")} & ${t("posts")} & ${t("reels")}`}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth="xl"
        sx={{ position: "relative", mt: -2, zIndex: 1, pb: 6 }}
      >
        <Grid container spacing={3}>
          {/* Left Sidebar — Business card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                position: "sticky",
                top: 100,
                alignSelf: "start",
                borderRadius: 3,
                overflow: "hidden",
                border: `1px solid ${borderColorMui}`,
                bgcolor: cardBg,
                boxShadow: isDark
                  ? "0 4px 24px rgba(0,0,0,0.2)"
                  : "0 4px 24px rgba(94, 24, 233, 0.06)",
              }}
            >
              <Box sx={{ p: 3 }}>
                {/* Business / provider name — prominent at top of card */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: textPrimary,
                    textAlign: "center",
                    mb: 1,
                    fontSize: { xs: "1.1rem", sm: "1.2rem" },
                    lineHeight: 1.3,
                  }}
                >
                  {isSupplier
                    ? (profile as ISupplierProfile).store_name
                    : `${profile.first_name} ${profile.last_name}`}
                </Typography>
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Chip
                    icon={<BusinessCenter sx={{ fontSize: 16 }} />}
                    label={isSupplier ? t("products") : t("services")}
                    size="small"
                    sx={{
                      mb: 1.5,
                      fontWeight: 600,
                      bgcolor: COLORS.PURPLE_ALPHA_10,
                      color: COLORS.PRIMARY_PURPLE,
                      border: `1px solid ${COLORS.PURPLE_ALPHA_20}`,
                      "& .MuiChip-icon": { color: COLORS.PRIMARY_PURPLE },
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: textSecondary,
                    fontSize: "0.875rem",
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  {(() => {
                    const bioText =
                      profile.bio ||
                      (isSupplier
                        ? (profile as ISupplierProfile).description
                        : "") ||
                      "Professional service provider on Kartsquare.";
                    const words = bioText.split(" ");
                    const WORD_LIMIT = 12;
                    const isLongBio = words.length > WORD_LIMIT;
                    if (!isLongBio || isBioExpanded) {
                      return (
                        <>
                          {bioText}
                          {isLongBio && (
                            <Typography
                              component="span"
                              onClick={() => setIsBioExpanded(false)}
                              sx={{
                                color: COLORS.PRIMARY_PURPLE,
                                cursor: "pointer",
                                ml: 0.5,
                                fontWeight: 600,
                                fontSize: "0.8rem",
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              Show less
                            </Typography>
                          )}
                        </>
                      );
                    }
                    return (
                      <>
                        {words.slice(0, WORD_LIMIT).join(" ")}...
                        <Typography
                          component="span"
                          onClick={() => setIsBioExpanded(true)}
                          sx={{
                            color: COLORS.PRIMARY_PURPLE,
                            cursor: "pointer",
                            ml: 0.5,
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          Read more
                        </Typography>
                      </>
                    );
                  })()}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  {profile.email && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <EmailIcon sx={{ fontSize: 20, color: textSecondary }} />
                      <Typography
                        variant="body2"
                        component={Link}
                        href={`mailto:${profile.email}`}
                        sx={{
                          color: textPrimary,
                          textDecoration: "none",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          "&:hover": { color: COLORS.PRIMARY_PURPLE },
                        }}
                      >
                        {profile.email}
                      </Typography>
                    </Box>
                  )}
                  {getLocationString() && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <LocationOn sx={{ fontSize: 20, color: textSecondary }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: textPrimary,
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
                      >
                        {getLocationString()}
                      </Typography>
                    </Box>
                  )}
                  {profile.phone_number && (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Phone sx={{ fontSize: 20, color: textSecondary }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: textPrimary,
                          fontWeight: 500,
                          fontSize: "0.875rem",
                        }}
                      >
                        {profile.country_code} {profile.phone_number}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleFollow}
                    disabled={followMutation.isPending || !profile.id}
                    fullWidth
                    sx={{
                      bgcolor: COLORS.PRIMARY_PURPLE,
                      color: COLORS.WHITE,
                      textTransform: "none",
                      fontWeight: 600,
                      py: 1.25,
                      borderRadius: 2,
                      fontSize: "0.9375rem",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: COLORS.PURPLE_HOVER,
                        boxShadow: "0 4px 12px rgba(94, 24, 233, 0.3)",
                      },
                      "&.Mui-disabled": {
                        bgcolor: COLORS.PRIMARY_PURPLE,
                        opacity: 0.6,
                      },
                    }}
                  >
                    Get in touch
                  </Button>
                  <IconButton
                    onClick={handleShareClick}
                    sx={{
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PRIMARY_DARK
                        : COLORS.BACKGROUND.SECONDARY_LIGHT,
                      color: textPrimary,
                      border: `1px solid ${borderColorMui}`,
                      "&:hover": {
                        bgcolor: COLORS.PURPLE_ALPHA_10,
                        borderColor: COLORS.PRIMARY_PURPLE,
                      },
                    }}
                  >
                    <Share sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 2, borderColor: borderColorMui }} />

                {/* Stats — 2x2 grid on mobile to save height */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr 1fr", md: "1fr" },
                    gap: { xs: 1, md: 0.5 },
                  }}
                >
                  {isSupplier ? (
                    <StatRow
                      icon={<BusinessCenter />}
                      label={t("products")}
                      value={(profile as ISupplierProfile).products_count || 0}
                      iconColor={COLORS.PRIMARY_PURPLE}
                      compact={isMobile}
                    />
                  ) : (
                    <StatRow
                      icon={<BusinessCenter />}
                      label={t("services")}
                      value={(profile as any)?.services_count || 0}
                      iconColor={COLORS.PRIMARY_PURPLE}
                      compact={isMobile}
                    />
                  )}
                  {!isSupplier && (
                    <>
                    <StatRow
                      icon={<Visibility />}
                      label={t("posts")}
                      value={(profile as any)?.total_posts || 0}
                      iconColor={textSecondary}
                      compact={isMobile}
                    />
                    <StatRow
                      icon={<Visibility />}
                      label={t("reels")}
                      value={(profile as any)?.total_reels || 0}
                      iconColor={textSecondary}
                      compact={isMobile}
                    />
                    </>
                  )}
                  <StatRow
                    icon={<Favorite />}
                    label={t("followers") || "Followers"}
                    value={profile?.followers_count || 0}
                    iconColor={COLORS.SECONDARY_ORANGE}
                    compact={isMobile}
                  />
                  <StatRow
                    icon={<People />}
                    label={t("following")}
                    value={profile?.following_count || 0}
                    iconColor={COLORS.PRIMARY_BLUE}
                    compact={isMobile}
                  />
                </Box>

                <Divider sx={{ my: 2, borderColor: borderColorMui }} />

                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontSize: "0.7rem",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Share this page
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <IconButton
                    onClick={() => handleSocialShare("facebook")}
                    sx={{
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PRIMARY_DARK
                        : COLORS.BACKGROUND.SECONDARY_LIGHT,
                      color: COLORS.PRIMARY_BLUE,
                      width: 40,
                      height: 40,
                      border: `1px solid ${borderColorMui}`,
                      "&:hover": { bgcolor: "rgba(24, 119, 242, 0.1)" },
                    }}
                  >
                    <Facebook sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleSocialShare("twitter")}
                    sx={{
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PRIMARY_DARK
                        : COLORS.BACKGROUND.SECONDARY_LIGHT,
                      color: COLORS.PRIMARY_BLUE,
                      width: 40,
                      height: 40,
                      border: `1px solid ${borderColorMui}`,
                      "&:hover": { bgcolor: "rgba(29, 161, 242, 0.1)" },
                    }}
                  >
                    <Twitter sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton
                    onClick={() => handleSocialShare("whatsapp")}
                    sx={{
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PRIMARY_DARK
                        : COLORS.BACKGROUND.SECONDARY_LIGHT,
                      color: COLORS.SUCCESS_GREEN,
                      width: 40,
                      height: 40,
                      border: `1px solid ${borderColorMui}`,
                      "&:hover": { bgcolor: "rgba(37, 211, 102, 0.1)" },
                    }}
                  >
                    <WhatsApp sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton
                    onClick={handleCopyLink}
                    sx={{
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PRIMARY_DARK
                        : COLORS.BACKGROUND.SECONDARY_LIGHT,
                      color: COLORS.PRIMARY_PURPLE,
                      width: 40,
                      height: 40,
                      border: `1px solid ${borderColorMui}`,
                      "&:hover": { bgcolor: COLORS.PURPLE_ALPHA_10 },
                    }}
                  >
                    <ContentCopy sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 2, borderColor: borderColorMui }} />

                {/* Reviews — collapsible on mobile */}
                {isMobile ? (
                  <Box>
                    <Box
                      onClick={() => setReviewsExpanded((prev) => !prev)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1,
                        cursor: "pointer",
                        "&:hover": { opacity: 0.85 },
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: textPrimary }}
                      >
                        {t("reviews" as any)} of {profile?.first_name}{" "}
                        {profile?.last_name}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ color: textPrimary, p: 0.5 }}
                      >
                        {reviewsExpanded ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                    <Collapse in={reviewsExpanded}>
                      <ProviderReviews
                        providerId={profile?.id || ""}
                        providerName={
                          profile?.first_name + " " + profile?.last_name
                        }
                        hideTitle
                      />
                    </Collapse>
                  </Box>
                ) : (
                  <ProviderReviews
                    providerId={profile?.id || ""}
                    providerName={
                      profile?.first_name + " " + profile?.last_name
                    }
                  />
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Right Column — Main content (business website sections) */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ mt: { xs: 4, md: 6 }, mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: textPrimary,
                  mb: 0.5,
                  fontSize: "1.35rem",
                }}
              >
                {isSupplier
                  ? `Our ${t("products")}`
                  : `Our ${t("services")} & ${t("posts")}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: textSecondary, fontSize: "0.9rem" }}
              >
                {isSupplier
                  ? "Explore our range of quality products."
                  : "Explore what we offer and our latest updates."}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "inline-flex",
                gap: 0,
                p: 0.5,
                borderRadius: 2,
                bgcolor: isDark
                  ? COLORS.BACKGROUND.SECONDARY_DARK
                  : COLORS.BACKGROUND.PAPER_LIGHT,
                border: `1px solid ${borderColorMui}`,
                mb: 3,
              }}
            >
              {isSupplier ? (
                <Box
                  onClick={() => handleTabChange(PROFILE_TABS.Products)}
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    borderRadius: 1.5,
                    cursor: "pointer",
                    bgcolor:
                      activeTab === PROFILE_TABS.Products
                        ? COLORS.PRIMARY_PURPLE
                        : "transparent",
                    color:
                      activeTab === PROFILE_TABS.Products
                        ? COLORS.WHITE
                        : textSecondary,
                    fontWeight: activeTab === PROFILE_TABS.Products ? 700 : 500,
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor:
                        activeTab === PROFILE_TABS.Products
                          ? COLORS.PURPLE_HOVER
                          : isDark
                            ? COLORS.PURPLE_ALPHA_10
                            : COLORS.PURPLE_ALPHA_04,
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WorkIcon sx={{ fontSize: 20 }} />
                    {t("products")}
                  </Box>
                </Box>
              ) : (
                <>
                  <Box
                    onClick={() => handleTabChange(PROFILE_TABS.Services)}
                    sx={{
                      px: 2.5,
                      py: 1.25,
                      borderRadius: 1.5,
                      cursor: "pointer",
                      bgcolor:
                        activeTab === PROFILE_TABS.Services
                          ? COLORS.PRIMARY_PURPLE
                          : "transparent",
                      color:
                        activeTab === PROFILE_TABS.Services
                          ? COLORS.WHITE
                          : textSecondary,
                      fontWeight:
                        activeTab === PROFILE_TABS.Services ? 700 : 500,
                      fontSize: "0.95rem",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor:
                          activeTab === PROFILE_TABS.Services
                            ? COLORS.PURPLE_HOVER
                            : isDark
                              ? COLORS.PURPLE_ALPHA_10
                              : COLORS.PURPLE_ALPHA_04,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <WorkIcon sx={{ fontSize: 20 }} />
                      {t("services")}
                    </Box>
                  </Box>
                  <Box
                    onClick={() => handleTabChange(PROFILE_TABS.Posts)}
                    sx={{
                      px: 2.5,
                      py: 1.25,
                      borderRadius: 1.5,
                      cursor: "pointer",
                      bgcolor:
                        activeTab === PROFILE_TABS.Posts
                          ? COLORS.PRIMARY_PURPLE
                          : "transparent",
                      color:
                        activeTab === PROFILE_TABS.Posts
                          ? COLORS.WHITE
                          : textSecondary,
                      fontWeight: activeTab === PROFILE_TABS.Posts ? 700 : 500,
                      fontSize: "0.95rem",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor:
                          activeTab === PROFILE_TABS.Posts
                            ? COLORS.PURPLE_HOVER
                            : isDark
                              ? COLORS.PURPLE_ALPHA_10
                              : COLORS.PURPLE_ALPHA_04,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ArticleIcon sx={{ fontSize: 20 }} />
                      {t("posts")}
                    </Box>
                  </Box>
                  <Box
                    onClick={() => handleTabChange(PROFILE_TABS.Reels)}
                    sx={{
                      px: 2.5,
                      py: 1.25,
                      borderRadius: 1.5,
                      cursor: "pointer",
                      bgcolor:
                        activeTab === PROFILE_TABS.Reels
                          ? COLORS.PRIMARY_PURPLE
                          : "transparent",
                      color:
                        activeTab === PROFILE_TABS.Reels
                          ? COLORS.WHITE
                          : textSecondary,
                      fontWeight: activeTab === PROFILE_TABS.Reels ? 700 : 500,
                      fontSize: "0.95rem",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor:
                          activeTab === PROFILE_TABS.Reels
                            ? COLORS.PURPLE_HOVER
                            : isDark
                              ? COLORS.PURPLE_ALPHA_10
                              : COLORS.PURPLE_ALPHA_04,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MovieFilter sx={{ fontSize: 20 }} />
                      {t("reels")}
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            <Box>
              {activeTab === PROFILE_TABS.Products && isSupplier && (
                <ProfileProducts products={products} isLoading={isLoading} />
              )}
              {activeTab === PROFILE_TABS.Posts && !isSupplier && (
                <Box>
                  {transformedPosts.length === 0 ? (
                    <Paper
                      elevation={0}
                      sx={{
                        textAlign: "center",
                        py: 8,
                        px: 3,
                        borderRadius: 3,
                        border: `1px dashed ${borderColorMui}`,
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.SECONDARY_DARK
                          : COLORS.BACKGROUND.PAPER_LIGHT,
                      }}
                    >
                      <ArticleIcon
                        sx={{
                          fontSize: 48,
                          color: textSecondary,
                          mb: 1.5,
                          opacity: 0.7,
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 1, color: textPrimary }}
                      >
                        {t("noPostsFound") || "No posts yet"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: textSecondary, maxWidth: 360, mx: "auto" }}
                      >
                        Updates and posts from this business will appear here.
                      </Typography>
                    </Paper>
                  ) : (
                    <PostFeedGrid
                      posts={transformedPosts}
                      isLoading={false}
                      fetchNextPage={() => {}}
                      hasNextPage={false}
                      isFetchingNextPage={false}
                      onPostClick={() => {}}
                    />
                  )}
                </Box>
              )}
              {activeTab === PROFILE_TABS.Services && !isSupplier && (
                <Box>
                  {services.length === 0 ? (
                    <Paper
                      elevation={0}
                      sx={{
                        textAlign: "center",
                        py: 8,
                        px: 3,
                        borderRadius: 3,
                        border: `1px dashed ${borderColorMui}`,
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.SECONDARY_DARK
                          : COLORS.BACKGROUND.PAPER_LIGHT,
                      }}
                    >
                      <BusinessCenter
                        sx={{
                          fontSize: 48,
                          color: textSecondary,
                          mb: 1.5,
                          opacity: 0.7,
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 1, color: textPrimary }}
                      >
                        {t("noServicesFound") || "No services yet"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: textSecondary, maxWidth: 360, mx: "auto" }}
                      >
                        Services offered by this provider will be listed here.
                      </Typography>
                    </Paper>
                  ) : (
                    <Grid container spacing={2}>
                      {services.map((service: Service, index: number) => (
                        <Grid
                          size={{ xs: 12, sm: 6, md: 4 }}
                          key={`${service.service_id}-${index}`}
                        >
                          <ServiceCard service={service as any} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              )}
              {activeTab === PROFILE_TABS.Reels && !isSupplier && (
                <ReelFeedGrid
                  reels={allReels}
                  isLoading={reelsLoading}
                  fetchNextPage={fetchNextReels}
                  hasNextPage={hasNextReels ?? false}
                  isFetchingNextPage={isFetchingNextReels}
                  onReelClick={handleReelClick}
                />
              )}
            </Box>

            {/* Location & Contact — business website sections, compact on mobile */}
            <Box
              sx={{
                mt: { xs: 5, md: 8 },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 4, md: 6 },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  border: `1px solid ${borderColorMui}`,
                  bgcolor: cardBg,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    mb: { xs: 2, md: 3 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: COLORS.PURPLE_ALPHA_10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LocationOn
                      sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 24 }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: textPrimary,
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                      }}
                    >
                      Our location
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: textSecondary,
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      Find us on the map and plan your visit.
                    </Typography>
                  </Box>
                </Box>
                <ProviderMapSection
                  latitude={profile.default_address?.latitude}
                  longitude={profile.default_address?.longitude}
                  providerImage={profile.profile_pic}
                  address={getLocationString()}
                />
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  border: `1px solid ${borderColorMui}`,
                  bgcolor: cardBg,
                }}
              >
                <Box
                  sx={{
                    mb: { xs: 2, md: 3 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: COLORS.PURPLE_ALPHA_10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <EmailIcon
                      sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 24 }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: textPrimary,
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                      }}
                    >
                      {t("contactUs") || "Contact us"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: textSecondary,
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      Get in touch — we&apos;ll respond as soon as we can.
                    </Typography>
                  </Box>
                </Box>
                <ContactUsSection profile={profile} />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Share Menu */}
      <Menu
        anchorEl={shareMenuAnchor}
        open={Boolean(shareMenuAnchor)}
        onClose={handleShareClose}
        PaperProps={{
          sx: {
            bgcolor: isDark
              ? COLORS.BACKGROUND.PRIMARY_DARK
              : COLORS.BACKGROUND.PRIMARY_LIGHT,
            minWidth: 220,
            mt: 1,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
          },
        }}
      >
        <MenuItem
          onClick={handleCopyLink}
          sx={{
            "&:hover": {
              bgcolor: "#f5f5f5",
            },
          }}
        >
          <ContentCopy sx={{ mr: 2, fontSize: 20 }} />
          {t("copyLink") || "Copy Link"}
        </MenuItem>
        <MenuItem
          onClick={() => handleSocialShare("facebook")}
          sx={{
            "&:hover": {
              bgcolor: "rgba(24, 119, 242, 0.1)",
            },
          }}
        >
          <Facebook sx={{ mr: 2, fontSize: 20, color: "#1877F2" }} />
          {t("shareOnFacebook") || "Share on Facebook"}
        </MenuItem>
        <MenuItem
          onClick={() => handleSocialShare("twitter")}
          sx={{
            "&:hover": {
              bgcolor: "rgba(29, 161, 242, 0.1)",
            },
          }}
        >
          <Twitter sx={{ mr: 2, fontSize: 20, color: "#1DA1F2" }} />
          {t("shareOnTwitter") || "Share on Twitter"}
        </MenuItem>
        <MenuItem
          onClick={() => handleSocialShare("whatsapp")}
          sx={{
            "&:hover": {
              bgcolor: "rgba(37, 211, 102, 0.1)",
            },
          }}
        >
          <WhatsApp sx={{ mr: 2, fontSize: 20, color: "#25D366" }} />
          {t("shareOnWhatsApp") || "Share on WhatsApp"}
        </MenuItem>
        <MenuItem
          onClick={() => handleSocialShare("email")}
          sx={{
            "&:hover": {
              bgcolor: "#f5f5f5",
            },
          }}
        >
          <Email sx={{ mr: 2, fontSize: 20 }} />
          {t("shareViaEmail") || "Share via Email"}
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            width: "100%",
            borderRadius: 2,
            bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.WHITE,
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Reel View Modal */}
      <ReelViewModal
        open={isReelModalOpen}
        onClose={() => setIsReelModalOpen(false)}
        reels={allReels}
        initialIndex={selectedReelIndex}
      />
    </Box>
  );
};

export default ProviderProfilePage;
