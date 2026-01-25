"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Avatar,
  Typography,
  Button,
  IconButton,
  useTheme,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Link,
} from "@mui/material";
import {
  Share,
  ContentCopy,
  Facebook,
  Twitter,
  WhatsApp,
  Email,
  ArrowBack,
  LocationOn,
  Email as EmailIcon,
  Phone,
  Visibility,
  Favorite,
  People,
  BusinessCenter,
} from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useProviderProfileByUsername, useFollowProvider } from "@/hooks/useProviderProfile";
import { useTranslate } from "@/hooks/useTranslate";
import ProfileTabs from "@/components/common/ProfileDrawer/components/ProfileTabs";
import ServiceCard from "@/components/ServiceCard";
import PostFeedGrid from "@/components/pages/myAccount/components/post/PostFeedGrid";
import { Posts } from "@/services/post/postInterfaces";
import { Service } from "@/services/serviceList/listInteraface";
import { UserRole } from "@/utils/auth";

interface ProviderProfilePageProps {
  username: string;
}

const PROFILE_TABS = {
  Posts: "Posts",
  Services: "Services",
}

const ProviderProfilePage: React.FC<ProviderProfilePageProps> = ({ username }) => {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  
  const [activeTab, setActiveTab] = useState(PROFILE_TABS.Services);
  const [shareMenuAnchor, setShareMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { data: profileData, isLoading, error } = useProviderProfileByUsername(username);
  const profile = profileData?.profile;
  const services = profileData?.services || [];
  const posts = profileData?.posts || [];
  
  const followMutation = useFollowProvider(profile?.id || "");

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
      return `${window.location.origin}/${username}`;
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
      `Check out ${profile?.first_name} ${profile?.last_name}'s profile on Kartsquare!`
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

  // Transform posts to match the expected format (media_urls as string)
  const transformedPosts: Posts[] = posts.map((post: any) => ({
    ...post,
    media_urls: Array.isArray(post.media_urls) ? post.media_urls[0] : post.media_urls,
  }));

  const StatRow = ({ icon, label, value, iconColor }: { icon: React.ReactElement, label: string, value: string| number, iconColor: string }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1,
        py: 1.2,
        borderRadius: 2,
        "&:not(:last-child)": {
          mb: 1,
        },
      
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
        <Box
          component="span"
          sx={{
            display: "flex",
            alignItems: "center",
            "& svg": {
              fontSize: 18,
              color: iconColor,
            },
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            fontSize: "0.85rem",
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
          fontSize: "0.95rem",
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
      const parts = [addr.city_town, addr.state, addr.country].filter(Boolean);
      return parts.join(", ");
    }
    return profile?.country || "";
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY_PURPLE }} />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: "error.main" }}>
            {t("profileNotFound") || "Profile not found"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.back()}
            sx={{
              bgcolor: COLORS.PRIMARY_PURPLE,
              "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
            }}
          >
            {t("go_back")}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        // bgcolor: isDark
        //   ? COLORS.BACKGROUND.PRIMARY_DARK
        //   : "#f5f5f5",
        backgroundColor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
      }}
    >
      {/* Full Width Banner */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 200, md: 300 },
          overflow: "hidden",
          bgcolor: COLORS.PRIMARY_PURPLE,
        }}
      >
        {profile.banner_image ? (
          <Image
            src={profile.banner_image}
            alt={`${profile.first_name} ${profile.last_name} banner`}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, ${COLORS.PURPLE_HOVER} 100%)`,
            }}
          />
        )}
        {/* Decorative icon in top-left */}
        <Container maxWidth="xl">
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: { xs: 16, md: 24 },
              color: "rgba(255, 255, 255, 0.3)",
              zIndex: 1,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 12C3 12 6 9 12 9C18 9 21 12 21 12M3 12C3 12 6 15 12 15C18 15 21 12 21 12M3 12L21 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="9" cy="12" r="1" fill="currentColor" />
              <circle cx="15" cy="12" r="1" fill="currentColor" />
            </svg>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: { xs: -8, md: -12 }, position: "relative", zIndex: 1, pb: 4 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar - Profile Details (No Box) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: "relative" }}>
              {/* Avatar - Overlapping Banner */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  // mt: { xs: -6, md: -8 },
                  mb: 3,
                }}
              >
                <Avatar
                  src={profile.profile_pic}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  sx={{
                    width: { xs: 100, md: 120 },
                    height: { xs: 100, md: 120 },
                    border: `4px solid ${COLORS.WHITE}`,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  }}
                />
              </Box>

                  {/* Name and Bio */}
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        mb: 1,
                        fontSize: "1.5rem",
                      }}
                    >
                      {profile.first_name} {profile.last_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 1,
                        color: theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                     {`@${profile?.username || "-"}`}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        fontSize: "0.875rem",
                      }}
                    >
                      {profile.bio || UserRole.SERVICE_PROVIDER}
                    </Typography>
                    
                  </Box>

                  {/* Contact Information */}
                  <Box sx={{ mb: 3 }}>
                    {profile.email && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1.5,
                          color: theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        }}
                      >
                        <EmailIcon sx={{ fontSize: 18, color: "#999" }} />
                        <Typography
                          variant="body2"
                          component={Link}
                          href={`mailto:${profile.email}`}
                          sx={{
                            color: theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                            textDecoration: "none",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            "&:hover": {
                              color: COLORS.PRIMARY_PURPLE,
                            },
                          }}
                        >
                          {profile.email}
                        </Typography>
                      </Box>
                    )}
                    {getLocationString() && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1.5,
                          fontWeight: 600,
                          color: theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        }}
                      >
                        <LocationOn sx={{ fontSize: 18, color: "#999" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                            fontWeight: 600,
                            fontSize: "0.875rem",
                          }}
                        >
                          {getLocationString()}
                        </Typography>
                      </Box>
                    )}
                    {profile.phone_number && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          fontWeight: 600,
                          color: theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        }}
                      >
                        <Phone sx={{ fontSize: 18, color: "#999" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                            fontWeight: 600,
                            fontSize: "0.875rem",
                          }}
                        >
                          {profile.country_code} {profile.phone_number}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
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
                      {profile.is_following ? t("following") : t("follow")}
                    </Button>
                    <IconButton
                      onClick={handleShareClick}
                      sx={{
                        bgcolor: "#f5f5f5",
                        color: "#666",
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          bgcolor: "#eeeeee",
                        },
                      }}
                    >
                      <Share sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

                  {/* Statistics */}
                  <Box
  sx={{
    mb: 3,
    display: "flex",
    flexDirection: "column",
    gap: 0.5,
  }}
>
  <StatRow
    icon={<Visibility />}
    label={t("posts")}
    value={profile?.total_posts || 0}
    iconColor="#999"
  />

  <StatRow
    icon={<Favorite />}
    label={t("followers") || "Followers"}
    value={profile?.followers_count || 0}
    iconColor={COLORS.SECONDARY_ORANGE}
  />

  <StatRow
    icon={<People />}
    label={t("following")}
    value={profile.following_count || 0}
    iconColor={COLORS.PRIMARY_BLUE}
  />

  <StatRow
    icon={<BusinessCenter />}
    label={t("services")}
    value={profile.services_count || 0}
    iconColor={COLORS.PRIMARY_PURPLE}
  />
</Box>

                  <Divider sx={{ my: 3, borderColor: "#e0e0e0" }} />

                  {/* Share Profile Section */}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        fontSize: "0.75rem",
                        display: "block",
                      }}
                    >
                      Share Profile
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <IconButton
                        onClick={() => handleSocialShare("facebook")}
                        sx={{
                          bgcolor: "#f5f5f5",
                          color: COLORS.PRIMARY_BLUE,
                          width: 40,
                          height: 40,
                          "&:hover": {
                            bgcolor: "rgba(24, 119, 242, 0.1)",
                          },
                        }}
                      >
                        <Facebook sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleSocialShare("twitter")}
                        sx={{
                          bgcolor: "#f5f5f5",
                          color: COLORS.PRIMARY_BLUE,
                          width: 40,
                          height: 40,
                          "&:hover": {
                            bgcolor: "rgba(29, 161, 242, 0.1)",
                          },
                        }}
                      >
                        <Twitter sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleSocialShare("whatsapp")}
                        sx={{
                          bgcolor: "#f5f5f5",
                          color: COLORS.SUCCESS_GREEN,
                          width: 40,
                          height: 40,
                          "&:hover": {
                            bgcolor: "rgba(37, 211, 102, 0.1)",
                          },
                        }}
                      >
                        <WhatsApp sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton
                        onClick={handleCopyLink}
                        sx={{
                          bgcolor: "#f5f5f5",
                          color: COLORS.PRIMARY_PURPLE,
                          width: 40,
                          height: 40,
                          "&:hover": {
                            bgcolor: COLORS.PURPLE_ALPHA_10,
                          },
                        }}
                      >
                        <ContentCopy sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Box>
                  </Box>
            </Box>
          </Grid>

          {/* Right Column - Content (No Box) */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Custom Tabs */}
            <Box
              sx={{
                mt: { xs: 6, md: 14 },
                borderBottom: "1px solid #e0e0e0",
                mb: 3,
              }}
            >
                <Box sx={{ display: "flex", gap: 4 }}>
                <Box
                    onClick={() => handleTabChange("Services")}
                    sx={{
                      py: 2,
                      cursor: "pointer",
                      position: "relative",
                      borderBottom: activeTab === "Services" ? `2px solid ${COLORS.PRIMARY_PURPLE}` : "2px solid transparent",
                      mb: -1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: activeTab === "Services" ? 700 : 400,
                        color: activeTab === "Services" ? theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT : theme.palette.mode === "dark" ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        fontSize: "0.9375rem",
                        textTransform: "none",
                      }}
                    >
                      {t("services")}
                    </Typography>
                  </Box>
                  <Box
                    onClick={() => handleTabChange(PROFILE_TABS.Posts)}
                    sx={{
                      py: 2,
                      cursor: "pointer",
                      position: "relative",
                      borderBottom: activeTab === PROFILE_TABS.Posts ? `2px solid ${COLORS.PRIMARY_PURPLE}` : "2px solid transparent",
                      mb: -1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                          fontWeight: activeTab === PROFILE_TABS.Posts ? 700 : 400,
                        color: activeTab === "Posts" ? theme.palette.mode === "dark" ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT : theme.palette.mode === "dark" ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        fontSize: "0.9375rem",
                        textTransform: "none",
                      }}
                    >
                      {t("posts")}
                    </Typography>
                  </Box>
                 
                </Box>
            </Box>

            {/* Content */}
            <Box>
                {activeTab === PROFILE_TABS.Posts && (
                  <Box>
                    {transformedPosts.length === 0 ? (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 8,
                          color: "#666",
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {t("noPostsFound") || "No posts found"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#999" }}>
                          This profile hasn't shared any posts yet.
                        </Typography>
                      </Box>
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
                {activeTab === PROFILE_TABS.Services && (
                  <Box>
                    {services.length === 0 ? (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 8,
                          color: "#666",
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {t("noServicesFound") || "No services found"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#999" }}>
                          This profile hasn't added any services yet.
                        </Typography>
                      </Box>
                    ) : (
                      <Grid container spacing={2}>
                        {services.map((service: Service, index: number) => (
                          <Grid
                            size={{ xs: 12, sm: 5 }}
                            key={`${service.service_id}-${index}`}
                          >
                            <ServiceCard service={service as any} />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )}
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
            bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
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
            bgcolor: COLORS.WHITE,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProviderProfilePage;
