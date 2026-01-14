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
} from "@mui/icons-material";
import Image from "next/image";
import { COLORS } from "../../../../constants/colors";
import { useAppSelector } from "@/store/hooks";
import { selectCurrentUser } from "@/features/ui/authSlice";
import { useProfile } from "@/hooks/useProfile";

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
}

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
}) => {
  const { data: profile } = useProfile();
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

        {/* Chat - Hide on mobile */}
        <StyledIconButton
          size="small"
          aria-label="chat"
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
        <StyledIconButton size="small" aria-label="notifications">
          <Badge badgeContent={0} color="error">
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

      {/* Login */}
      <Button
        size="small"
        aria-label="login"
        onClick={onLogin}
        sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        <LoginIcon fontSize="small" />
        <Typography variant="body2">{loginText}</Typography>
      </Button>
    </ActionsContainer>
  );
};

export default NavActions;
