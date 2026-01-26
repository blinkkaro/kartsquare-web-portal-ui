"use client";

import React from "react";
import {
  Drawer,
  IconButton,
  useTheme,
  Tooltip,
  Box,
  Badge,
  Avatar,
  Typography,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { Close, LocationOn, BookmarkBorder, Verified } from "@mui/icons-material";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import Image from "next/image";
import ProfileHeader from "./ProfileHeader";
import { providerProfileInterface } from "@/services/profile/profileInterface";

interface ProfileDrawerWrapperProps {
  open: boolean;
  profile: providerProfileInterface | undefined;
  onClose: () => void;
  onChatClick?: () => void;
  onLocationClick?: () => void;
  onBookmarkClick?: () => void;
  children: React.ReactNode;
  width?: number;
}

const ProfileDrawerWrapper: React.FC<ProfileDrawerWrapperProps> = ({
  open,
  profile,
  onClose,
  onChatClick,
  onLocationClick,
  onBookmarkClick,
  children,
  width = 700,
}) => {
  const theme = useTheme();
  const { t } = useTranslationContext();

  const iconButtonStyle = {
    backgroundColor:
      theme.palette.mode === "dark"
        ? COLORS.BACKGROUND.PAPER_DARK
        : COLORS.WHITE,
    boxShadow: COLORS.SHADOW.DEFAULT,
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? COLORS.BACKGROUND.PRIMARY_DARK
          : COLORS.LIGHT_GRAY,
    },
  };

  const iconStyle = {
    color:
      theme.palette.mode === "dark"
        ? COLORS.TEXT.PRIMARY_DARK
        : COLORS.TEXT.PRIMARY_LIGHT,
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", md: width },
          bgcolor:
            theme.palette.mode === "dark"
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PAPER_LIGHT,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
      }}
    >
      {/* Custom Header with Icons */}
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mt: { xs: 0, md: 1 },
        }}
      >
        {/* LEFT SIDE: Avatar + Username */}
        {profile?.username && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              src={profile.profile_pic}
              alt={profile.first_name}
              sx={{
                width: { xs: 48, md: 56 },
                height: { xs: 48, md: 56 },
                border: `3px solid ${COLORS.WHITE}`,
                boxShadow: COLORS.SHADOW.DEFAULT,
              }}
            />
            <Typography
              sx={{
                fontWeight: "bold",
                color:
                  theme.palette.mode === "dark"
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                lineHeight: 1.2,
                fontSize: "clamp(0.9rem, 2.5vw, 1.25rem)",
              }}
            >
              @{profile.username}
            </Typography>

            <Box
              sx={{ color: COLORS.PRIMARY_PURPLE, display: "flex", alignItems: "center" }}
            >
              <Verified sx={{ fontSize: "20px" }} />
            </Box>
          </Box>
        )}

        {/* RIGHT SIDE: Action Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* {onChatClick && (
      <Tooltip title={t("chatTooltip")} arrow>
        <IconButton onClick={onChatClick} size="small" sx={iconButtonStyle}>
          <Badge badgeContent={0} color="error">
            <Image
              src={
                theme.palette.mode === "dark"
                  ? "/icons/darkThemeChat.svg"
                  : "/icons/chat.svg"
              }
              alt="Chat"
              width={20}
              height={20}
            />
          </Badge>
        </IconButton>
      </Tooltip>
    )} */}

          {/* {onLocationClick && (
      <Tooltip title={t("locationTooltip")} arrow>
        <IconButton onClick={onLocationClick} size="small" sx={iconButtonStyle}>
          <LocationOn fontSize="small" sx={iconStyle} />
        </IconButton>
      </Tooltip>
    )} */}

          {/* {onBookmarkClick && (
      <Tooltip title={t("bookmarkTooltip")} arrow>
        <IconButton onClick={onBookmarkClick} size="small" sx={iconButtonStyle}>
          <BookmarkBorder fontSize="small" sx={iconStyle} />
        </IconButton>
      </Tooltip>
    )} */}

          <Tooltip title={t("closeDrawer")} arrow>
            <IconButton onClick={onClose} size="small" sx={iconButtonStyle}>
              <Close fontSize="small" sx={iconStyle} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Drawer Content */}
      {children}
    </Drawer>
  );
};

export default ProfileDrawerWrapper;
