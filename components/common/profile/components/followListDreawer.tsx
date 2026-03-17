"use client";

import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import {
  useFollowersList,
  useFollowList,
  useFollowUser,
  useUnfollowUser,
} from "@/hooks/useFollow";
import Button from "@/components/common/Button";
import { IFollow } from "@/services/follow/followInterface";
import { formatCount } from "@/helper/helper";
import RightDrawer from "../../RightDrawer";
import { AppUserType } from "@/services/auth/auth.interface";

interface FollowListDrawerProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  userRole: AppUserType;
}

const FollowListDrawer: React.FC<FollowListDrawerProps> = ({
  open,
  onClose,
  userId,
  userRole,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Determine which list to fetch based on user role
  const isServiceProvider = userRole === AppUserType.SERVICE_PROVIDER || userRole === AppUserType.SUPPLIER;

  const {
    data: followersData,
    fetchNextPage: fetchNextFollowers,
    hasNextPage: hasNextFollowers,
    isFetchingNextPage: isFetchingNextFollowers,
    isLoading: isLoadingFollowers,
  } = useFollowersList(userId, 10);

  const {
    data: followingData,
    fetchNextPage: fetchNextFollowing,
    hasNextPage: hasNextFollowing,
    isFetchingNextPage: isFetchingNextFollowing,
    isLoading: isLoadingFollowing,
  } = useFollowList(userId, 10);

  const { mutate: followUser, isPending: isFollowing } = useFollowUser(userId);
  const { mutate: unfollowUser, isPending: isUnfollowing } =
    useUnfollowUser(userId);

  // Use appropriate data based on role
  const data = isServiceProvider ? followersData : followingData;
  const fetchNextPage = isServiceProvider
    ? fetchNextFollowers
    : fetchNextFollowing;
  const hasNextPage = isServiceProvider ? hasNextFollowers : hasNextFollowing;
  const isFetchingNextPage = isServiceProvider
    ? isFetchingNextFollowers
    : isFetchingNextFollowing;
  const isLoading = isServiceProvider ? isLoadingFollowers : isLoadingFollowing;

  // Flatten all pages of data
  const users: IFollow[] =
    data?.pages?.flatMap((page) =>
      isServiceProvider ? page.followers || [] : page.following || [],
    ) || [];

  // Infinite scroll observer
  useEffect(() => {
    if (!observerTarget.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFollowToggle = (user: IFollow) => {
    if (isServiceProvider && user.is_following) {
      unfollowUser(user.id);
    } else if (!isServiceProvider) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
    }
  };

  const getButtonLabel = (user: IFollow) => {
    // console.log(user);
    if (isServiceProvider && user.is_following) {
      return t("unfollow");
    }
    if (isServiceProvider && !user.is_following) {
      return t("followBack");
    }
    return t("unfollow");
  };

  const title = isServiceProvider ? t("followers") : t("following");
  const emptyMessage = isServiceProvider
    ? t("noFollowersYet")
    : t("noFollowingYet");
  const loadingMessage = isServiceProvider
    ? t("loadingFollowers")
    : t("loadingFollowing");

  return (
    <RightDrawer open={open} onClose={onClose} title={title} width={500}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 2,
              }}
            >
              <CircularProgress size={40} />
              <Typography variant="body2" color="text.secondary">
                {loadingMessage}
              </Typography>
            </Box>
          ) : users.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                {emptyMessage}
              </Typography>
            </Box>
          ) : (
            <>
              {users.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                    pb: 2,
                    borderBottom: `1px solid ${
                      isDark
                        ? COLORS.BORDER.DEFAULT_DARK
                        : COLORS.BORDER.DEFAULT_LIGHT
                    }`,
                  }}
                >
                  <Avatar
                    src={user.profile_pic}
                    alt={`${user.first_name} ${user.last_name}`}
                    sx={{ width: 48, height: 48 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: isDark
                          ? COLORS.TEXT.PRIMARY_DARK
                          : COLORS.TEXT.PRIMARY_LIGHT,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.bio || user.email}
                    </Typography>
                  </Box>
                  <Button
                    variant={
                      isServiceProvider
                        ? user.is_following
                          ? "outlined"
                          : "contained"
                        : "outlined"
                    }
                    onClick={() => handleFollowToggle(user)}
                    disabled={isFollowing || isUnfollowing}
                    sx={{
                      minWidth: 100,
                      textTransform: "none",
                      fontSize: "0.875rem",
                      ...(user.is_following && {
                        borderColor: isDark
                          ? COLORS.BORDER.DEFAULT_DARK
                          : COLORS.BORDER.DEFAULT_LIGHT,
                        color: isDark
                          ? COLORS.TEXT.PRIMARY_DARK
                          : COLORS.TEXT.PRIMARY_LIGHT,
                      }),
                    }}
                  >
                    {getButtonLabel(user)}
                  </Button>
                </Box>
              ))}

              {/* Loading indicator for pagination */}
              {isFetchingNextPage && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}

              {/* Intersection observer target */}
              <div ref={observerTarget} style={{ height: 1 }} />
            </>
          )}
        </Box>
      </Box>
    </RightDrawer>
  );
};

export default FollowListDrawer;
