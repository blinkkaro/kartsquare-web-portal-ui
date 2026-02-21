import { COLORS } from "@/constants/colors";
import { profileInterface } from "@/services/profile/profileInterface";
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/common/Button";
import { useTranslate } from "@/hooks/useTranslate";
import { formatCount } from "@/helper/helper";
import FollowListDrawer from "./followListDreawer";
import { secureStorage } from "@/helper/SecureStorage";
import { AppUserType } from "@/services/auth/auth.interface";

function Profile({ profile }: { profile: profileInterface }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [open, setOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslate();
  const handleOpen = () => setOpen((prev) => !prev);
  const role = secureStorage.getItem("role");
  const [copied, setCopied] = useState(false);

  const handleDrawerClick = () => {
    setDrawerOpen((prev) => !prev);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/in/${profile?.username}`
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        border: `1px solid ${
          isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
        }`,
        bgcolor: isDark
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.BACKGROUND.PRIMARY_LIGHT,
        textAlign: "center",
        width: "100%",
        maxWidth: { md: "100%", lg: "40rem" },
        mx: "auto",
      }}
    >
      {/* Gradient Header */}
      <Box
        sx={{
          background:
            theme.palette.mode === "dark"
              ? COLORS.DARK_GRADIENT
              : COLORS.PROFILE_GRADIENT,
          m: 2,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          pt: 10,
          height: 200,
        }}
      />
      
      <Box
        sx={{
          mt: -20,
          background: `linear-gradient(to bottom, transparent, ${
            isDark
              ? COLORS.BACKGROUND.PRIMARY_DARK
              : COLORS.BACKGROUND.PRIMARY_LIGHT
          })`,
          height: 150,
        }}
      />
      <Box sx={{ mt: -20, pb: 5 }}>
        {/* Avatar */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar
            src={profile?.profile_pic}
            sx={{
              width: { xs: 80, sm: 100, md: 120 },
              height: { xs: 80, sm: 100, md: 120 },
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ px: 3, mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            {profile?.first_name} {profile?.last_name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              px: 1,
              lineHeight: 1.6,
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: open ? "unset" : 2,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            {profile?.bio || t("noBioAvailable")}
          </Typography>
          {!open && profile?.bio && profile?.bio.length > 100 && (
            <Typography
              variant="body2"
              onClick={handleOpen}
              sx={{
                textDecoration: "underline",
                cursor: "pointer",
                mb: 3,
                fontWeight: 600,
              }}
            >
              {t("continueReading")}
            </Typography>
          )}
          <Button variant="contained" onClick={handleDrawerClick}>
            {role !== "CUSTOMER"
              ? formatCount(profile?.followers_count)
              : formatCount(profile?.following_count)}{" "}
            {role !== "CUSTOMER" ? t("followers") : t("following")}
          </Button>

          {(role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER) && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <IconButton
                sx={{
                  bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#F5F5F7",
                  //   transform: "scaleX(-1)", // Flipping the reply icon to look like the share arrow
                }}
                onClick={handleCopy}
              >
                <Image
                  src={
                    theme.palette.mode === "dark"
                      ? `/icons/darkThemeShare.svg`
                      : `/icons/share.svg`
                  }
                  width={24}
                  height={24}
                  alt="share"
                />
              </IconButton>
            </Box>
          )}
          {copied && (
            <Typography variant="body2" sx={{ ml: 1 }}>
              {t("copied")}!
            </Typography>
          )}
        </Box>
      </Box>

      {/* Follow List Drawer */}
      <FollowListDrawer
        open={drawerOpen}
        onClose={handleDrawerClick}
        userId={profile?.id || ""}
        userRole={role as AppUserType}
      />
    </Paper>
  );
}

export default Profile;
