"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Box, Button, ButtonBase, Skeleton, Typography, useTheme } from "@mui/material";
import toast from "react-hot-toast";
import { COLORS } from "@/constants/colors";
import { useTopSuggestions } from "@/hooks/useTopSuggestions";
import { useCategories } from "@/hooks/useCategories";
import { useFollow } from "@/hooks/useFollow";
import { selectIsAuthenticated } from "@/features/ui/authSlice";
import { openLoginModal } from "@/features/ui/loginModalSlice";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { AppUserType } from "@/services/auth/auth.interface";

const YEAR = new Date().getFullYear();

interface FeedSidebarProps {
  currentUser: { id?: string; first_name?: string; last_name?: string; business_name?: string; profile_pic?: string | null; username?: string; role?: string } | null;
}

/** Desktop right rail: you, providers to follow, and a way back into services. */
export default function FeedSidebar({ currentUser }: FeedSidebarProps) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { provider, isLoading } = useTopSuggestions("8");
  const { data: categories } = useCategories();
  const follow = useFollow();
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  const border = dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT;
  const accent = dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE;
  const cardSx = {
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: border,
    borderRadius: "16px",
    boxShadow: dark ? COLORS.NEW_UI.CARD_SHADOW_DARK : COLORS.NEW_UI.CARD_SHADOW_LIGHT,
    p: 2,
  };
  const avatarSx = { fontWeight: 800, bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10, color: dark ? COLORS.NEW_UI.CHIP_TEXT_DARK : COLORS.PRIMARY_PURPLE };

  const suggestions = (provider ?? []).filter((p) => p.id !== currentUser?.id).slice(0, 5);
  const meName = currentUser?.business_name?.trim() || `${currentUser?.first_name ?? ""} ${currentUser?.last_name ?? ""}`.trim();

  const doFollow = (id: string) => {
    if (!isAuthenticated) {
      dispatch(openLoginModal());
      return;
    }
    setFollowed((prev) => new Set(prev).add(id));
    follow.mutate(id, {
      onError: () => {
        setFollowed((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.error("Couldn't follow. Please try again.");
      },
    });
  };

  return (
    <Box component="aside" aria-label="Suggestions" sx={{ position: "sticky", top: 96, display: "flex", flexDirection: "column", gap: 2 }}>
      {isAuthenticated && currentUser && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 0.5 }}>
          <Avatar src={currentUser.profile_pic || undefined} alt={meName} sx={{ width: 44, height: 44, ...avatarSx }}>
            {(meName || "Y").charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: "0.88rem", fontWeight: 800, color: "text.primary" }} noWrap>
              {meName || "Your profile"}
            </Typography>
            {currentUser.username && (
              <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }} noWrap>
                @{currentUser.username}
              </Typography>
            )}
          </Box>
          <Box component={Link} href="/myAccount" sx={{ fontSize: "0.8rem", fontWeight: 700, color: accent, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
            Profile
          </Box>
        </Box>
      )}

      <Box sx={cardSx}>
        <Typography component="h2" sx={{ fontSize: "0.9rem", fontWeight: 800, color: "text.primary", mb: 1 }}>
          Suggested for you
        </Typography>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 1 }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="45%" />
                </Box>
              </Box>
            ))
          : suggestions.length === 0
          ? (
              <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>No suggestions right now.</Typography>
            )
          : suggestions.map((p) => {
              const name = p.business_name?.trim() || `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Provider";
              const isFollowed = followed.has(p.id);
              return (
                <Box key={p.id} sx={{ display: "flex", alignItems: "center", gap: 1.25, py: 1 }}>
                  <ButtonBase
                    onClick={() => dispatch(openDrawer({ userId: p.id, role: AppUserType.SERVICE_PROVIDER }))}
                    aria-label={`View ${name}'s profile`}
                    sx={{ display: "flex", alignItems: "center", gap: 1.25, flex: 1, minWidth: 0, justifyContent: "flex-start", textAlign: "left", borderRadius: "10px" }}
                  >
                    <Avatar src={p.profile_pic || undefined} alt={name} sx={{ width: 36, height: 36, ...avatarSx }}>
                      {name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: "text.primary" }} noWrap>
                        {name}
                      </Typography>
                      {p.city && (
                        <Typography sx={{ fontSize: "0.76rem", color: "text.secondary" }} noWrap>
                          {p.city}
                        </Typography>
                      )}
                    </Box>
                  </ButtonBase>
                  <Button
                    size="small"
                    onClick={() => doFollow(p.id)}
                    disabled={isFollowed}
                    sx={{ minWidth: 0, px: 1, fontSize: "0.8rem", fontWeight: 700, textTransform: "none", color: accent, "&.Mui-disabled": { color: "text.secondary" } }}
                  >
                    {isFollowed ? "Following" : "Follow"}
                  </Button>
                </Box>
              );
            })}
      </Box>

      {categories && categories.length > 0 && (
        <Box sx={cardSx}>
          <Typography component="h2" sx={{ fontSize: "0.9rem", fontWeight: 800, color: "text.primary", mb: 1.25 }}>
            Explore services
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {categories.slice(0, 8).map((c) => (
              <Box
                key={c.id}
                component={Link}
                href={`/cus/services-list?category=${encodeURIComponent(c.id)}`}
                sx={{
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "999px",
                  border: "1px solid",
                  borderColor: dark ? COLORS.NEW_UI.DIVIDER_DARK : COLORS.NEW_UI.DIVIDER_LIGHT,
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "text.primary",
                  textDecoration: "none",
                  "&:hover": { borderColor: COLORS.PRIMARY_PURPLE, color: COLORS.PRIMARY_PURPLE },
                }}
              >
                {c.name}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", px: 0.5, lineHeight: 1.8 }}>
        <Box component={Link} href="/about-us" sx={{ color: "inherit", textDecoration: "none" }}>About</Box> ·{" "}
        <Box component={Link} href="/contact-us" sx={{ color: "inherit", textDecoration: "none" }}>Help</Box> ·{" "}
        <Box component={Link} href="/privacy-policy" sx={{ color: "inherit", textDecoration: "none" }}>Privacy</Box> ·{" "}
        <Box component={Link} href="/terms-conditions" sx={{ color: "inherit", textDecoration: "none" }}>Terms</Box>
        <br />© {YEAR} kartsquare
      </Typography>
    </Box>
  );
}
