import React from "react";
import {
  Box,
  IconButton,
  Badge,
  Avatar,
  Button,
  Typography,
  styled,
} from "@mui/material";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Search as SearchIcon,
  Login as LoginIcon,
  Business,
} from "@mui/icons-material";
import Image from "next/image";
import { COLORS } from "../../../../constants/colors";
import { secureStorage } from "@/helper/SecureStorage";

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  [theme.breakpoints.up("md")]: {
    gap: "1rem",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color:
    theme.palette.mode === "dark"
      ? COLORS.TEXT.PRIMARY_DARK
      : COLORS.TEXT.PRIMARY_LIGHT,
  padding: "0.5rem",
  transition: "all 0.2s ease-in-out",
  backgroundColor:
    theme.palette.mode === "dark"
      ? COLORS.BACKGROUND.PRIMARY_DARK
      : COLORS.BACKGROUND.PRIMARY_LIGHT,

  "&:hover": {
    backgroundColor: COLORS.PURPLE_ALPHA_10,
    color: COLORS.PRIMARY_PURPLE,
  },
}));

interface NavActionsProps {
  isAuthenticated: boolean;
  isMobile: boolean;
  isTablet: boolean;
  mode: "light" | "dark";
  onThemeToggle: () => void;
  onSearchToggle: () => void;
  profileClick: () => void;
  onLogin: () => void;
  loginText: string;
  onNotificationToggle: () => void;
  onFreeListingClick: () => void;
}

import { useSocket } from "@/contexts/SocketContext";
import { useTranslate } from "@/hooks/useTranslate";

const NavActions: React.FC<NavActionsProps> = ({
  isAuthenticated,
  isMobile,
  isTablet,
  mode,
  onThemeToggle,
  onSearchToggle,
  profileClick,
  onLogin,
  loginText,
  onNotificationToggle,
  onFreeListingClick,
}) => {
  const profile = secureStorage.getItem("user_details");
  const { unreadCount } = useSocket();
  const { t } = useTranslate();
  const isDark = mode === "dark";

  if (isAuthenticated) {
    return (
      <ActionsContainer>
        {/* Mobile/Tablet Search Icon */}
        {(isMobile || isTablet) && (
          <StyledIconButton
            size="small"
            aria-label="search"
            onClick={onSearchToggle}
          >
            <SearchIcon fontSize="small" />
          </StyledIconButton>
        )}
        {/* Free Listing */}

        {/* Chat - Hide on mobile */}
        <StyledIconButton
          size="small"
          aria-label="chat"
          onClick={() => window.location.href = "/chat"}
          sx={{ display: { xs: "none", md: "inline-flex" } }}
        >
          <Badge badgeContent={0} color="error">
            <Image
              src={
                mode === "dark" ? "/icons/darkThemeChat.svg" : "/icons/chat.svg"
              }
              alt="Chat"
              width={20}
              height={20}
            />
          </Badge>
        </StyledIconButton>

        {/* Notifications */}
        <StyledIconButton
          size="small"
          aria-label="notifications"
          onClick={onNotificationToggle}
        >
          <Badge badgeContent={unreadCount} color="error">
            <Image
              src={
                mode === "dark" ? "/icons/darkThemwBell.svg" : "/icons/bell.svg"
              }
              alt="Bell"
              width={20}
              height={20}
            />
          </Badge>
        </StyledIconButton>

        {/* Theme Toggle */}
        <StyledIconButton
          size="small"
          onClick={onThemeToggle}
          aria-label="toggle theme"
        >
          {mode === "dark" ? (
            <LightModeIcon fontSize="small" />
          ) : (
            <DarkModeIcon fontSize="small" />
          )}
        </StyledIconButton>

        {/* User Avatar */}
        <Avatar
          sx={{
            width: { xs: 32, md: 36 },
            height: { xs: 32, md: 36 },
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
          alt="User Avatar"
          src={profile?.profile_pic}
          onClick={profileClick}
        />
      </ActionsContainer>
    );
  }

  return (
    <ActionsContainer>
      <style>{`
        @keyframes businessBadgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.35); transform: scale(1); }
          50% { box-shadow: 0 0 12px 2px rgba(211, 47, 47, 0.25); transform: scale(1.03); }
        }
        @keyframes businessBadgeSplash {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
      `}</style>
      {/* Free Listing Button */}
      {(isMobile || isTablet) && (
        <StyledIconButton
          size="small"
          aria-label="business listing"
          onClick={onFreeListingClick}
          sx={{
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "2px",
              right: "2px",
              backgroundColor: "error.main",
              color: "#fff",
              fontSize: "0.45rem",
              fontWeight: 700,
              padding: "0px 3px",
              borderRadius: "4px",
              lineHeight: 1,
              textTransform: "uppercase",
              animation: "businessBadgePulse 2s ease-in-out infinite",
            }}
          >
            {t("business")}
          </Box>
          <Business />
        </StyledIconButton>
      )}

      {/* Free Listing Desktop */}
      <Box
        onClick={onFreeListingClick}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "flex-start",
          cursor: "pointer",
          position: "relative",
          "&:hover .listing-text": {
            color: COLORS.PRIMARY_PURPLE,
          },
          mb: "10px",
        }}
      >
        <Box
          className="business-listing-badge"
          sx={{
            backgroundColor: "error.main",
            color: "#fff",
            fontSize: "0.55rem",
            fontWeight: 700,
            padding: "0px 5px",
            borderRadius: "4px",
            lineHeight: 1.2,
            mb: "2px",
            textTransform: "uppercase",
            position: "relative",
            boxShadow: "0 0 0 0 rgba(211, 47, 47, 0.4)",
            animation: "businessBadgePulse 2s ease-in-out infinite",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: -2,
              borderRadius: "6px",
              border: "1px solid rgba(211, 47, 47, 0.35)",
              animation: "businessBadgeSplash 2s ease-in-out infinite",
              pointerEvents: "none",
            },
          }}
        >
          {t("business")}
        </Box>
        <Typography
          className="listing-text"
          sx={{
            color:
              mode === "dark"
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            textTransform: "none",
            fontSize: "0.85rem",
            fontWeight: 500,
            lineHeight: 1,
            transition: "color 0.2s",
          }}
        >
          {t("businessListing")}
        </Typography>
      </Box>

      {/* Mobile/Tablet Search Icon */}
      {(isMobile || isTablet) && (
        <StyledIconButton
          size="small"
          aria-label="search"
          onClick={onSearchToggle}
        >
          <SearchIcon fontSize="small" />
        </StyledIconButton>
      )}

      {/* Theme Toggle */}
      <StyledIconButton
        size="small"
        onClick={onThemeToggle}
        aria-label="toggle theme"
      >
        {mode === "dark" ? (
          <LightModeIcon fontSize="small" />
        ) : (
          <DarkModeIcon fontSize="small" />
        )}
      </StyledIconButton>

      {/* Login Button */}
      <Button
        variant="outlined"
        size="small"
        aria-label="login"
        onClick={onLogin}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          borderRadius: "20px",
          textTransform: "none",
          fontWeight: 600,
          borderColor: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
          color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
          minWidth: { xs: "auto", md: "64px" },
          padding: { xs: "4px 8px", md: "4px 10px" },
          "&:hover": {
            borderColor: isDark
              ? COLORS.ACCENT_BLUE_DARK
              : COLORS.PRIMARY_PURPLE,
            backgroundColor: COLORS.PURPLE_ALPHA_10,
          },
        }}
      >
        <LoginIcon fontSize="small" />
        <Box component="span" sx={{ display: { xs: "none", md: "block" } }}>
          {loginText}
        </Box>
      </Button>
    </ActionsContainer>
  );
};

export default NavActions;
