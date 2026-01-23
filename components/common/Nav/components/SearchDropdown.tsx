"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
  Divider,
  useTheme,
  Card,
  CardMedia,
  CardContent,
  Rating,
  useMediaQuery,
} from "@mui/material";
import { Star, Person, Business } from "@mui/icons-material";
import { COLORS } from "../../../../constants/colors";
import { SearchUser, SearchService } from "../../../../services/search/searchInterface";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { useDispatch } from "react-redux";
import { openDrawer } from "@/features/ui/profileDrawerSlice";

interface SearchDropdownProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  users: SearchUser[];
  services: SearchService[];
  loading: boolean;
  searchQuery: string;
  onClose: () => void;
  onSeeAll: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  open,
  anchorEl,
  users,
  services,
  loading,
  searchQuery,
  onClose,
  onSeeAll,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [viewportHeight, setViewportHeight] = useState(0);

  // Get viewport height on mount and resize
  useEffect(() => {
    if (typeof window !== "undefined") {
      setViewportHeight(window.innerHeight);
      
      const handleResize = () => {
        setViewportHeight(window.innerHeight);
      };
      
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  if (!open || !anchorEl) return null;

  const handleUserClick = (userId: string) => {
    // Open profile drawer instead of navigating
    dispatch(openDrawer({ userId }));
    onClose();
  };

  const handleServiceClick = (serviceId: string) => {
    // Navigate to service details page
    router.push(`/services/${serviceId}`);
    onClose();
  };

  const hasResults = users.length > 0 || services.length > 0;
  const showSeeAll = hasResults && searchQuery.trim().length > 0;

  // Calculate max height based on viewport height for mobile devices
  // iPhone SE has ~568px viewport height, so we need to be careful
  const maxHeight = useMemo(() => {
    if (typeof window === "undefined" || !anchorEl) return 600;
    
    const searchBarTop = anchorEl.getBoundingClientRect().top;
    const searchBarHeight = anchorEl.offsetHeight;
    const bottomPadding = 16; // Padding from bottom
    const topPadding = 8; // Gap between search bar and dropdown
    
    // Calculate available height
    const availableHeight = viewportHeight - searchBarTop - searchBarHeight - topPadding - bottomPadding;
    
    // For very small screens (iPhone SE ~568px), use more conservative limits
    if (viewportHeight <= 667) {
      // iPhone SE and similar small devices - use 70% of available or 350px max
      return Math.min(availableHeight * 0.7, 350);
    } else if (viewportHeight <= 812) {
      // iPhone X/11/12 - use 75% of available or 500px max
      return Math.min(availableHeight * 0.75, 500);
    } else {
      // Larger screens - use 600px max
      return Math.min(availableHeight, 600);
    }
  }, [viewportHeight, anchorEl]);

  return (
    <Paper
      elevation={8}
      sx={{
        position: "absolute",
        top: anchorEl.offsetHeight + 8,
        left: 0,
        width: anchorEl.offsetWidth,
        maxHeight: `${maxHeight}px`,
        height: "auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: isDark
          ? COLORS.BACKGROUND.PAPER_DARK
          : COLORS.BACKGROUND.PAPER_LIGHT,
        border: `1px solid ${
          isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
        }`,
        borderRadius: "16px",
        zIndex: 1300,
        boxShadow: isDark
          ? "0px 8px 32px rgba(0, 0, 0, 0.4)"
          : "0px 8px 32px rgba(0, 0, 0, 0.12)",
        // On mobile, ensure it doesn't overflow viewport
        ...(isMobile && {
          maxWidth: "calc(100vw - 48px)", // Account for padding on mobile
        }),
      }}
    >
      <Box
        sx={{
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: `${maxHeight}px`,
          // Always show scrollbar for better UX, especially on mobile
          scrollbarWidth: "thin", // Firefox
          scrollbarColor: isDark
            ? `${COLORS.PRIMARY_PURPLE}80 ${COLORS.BACKGROUND.SECONDARY_DARK}`
            : `${COLORS.PRIMARY_PURPLE}80 ${COLORS.BACKGROUND.SECONDARY_LIGHT}`,
          "&::-webkit-scrollbar": {
            width: isMobile ? "8px" : "6px",
            display: "block",
            WebkitAppearance: "none",
          },
          "&::-webkit-scrollbar-track": {
            background: isDark
              ? COLORS.BACKGROUND.SECONDARY_DARK
              : COLORS.BACKGROUND.SECONDARY_LIGHT,
            borderRadius: "4px",
            border: `1px solid ${
              isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
            }`,
          },
          "&::-webkit-scrollbar-thumb": {
            background: isDark
              ? `${COLORS.PRIMARY_PURPLE}CC`
              : `${COLORS.PRIMARY_PURPLE}CC`,
            borderRadius: "4px",
            border: `1px solid ${
              isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT
            }`,
            "&:hover": {
              background: isDark
                ? COLORS.PRIMARY_PURPLE
                : COLORS.PRIMARY_PURPLE,
            },
            "&:active": {
              background: isDark
                ? `${COLORS.PRIMARY_PURPLE}FF`
                : `${COLORS.PRIMARY_PURPLE}FF`,
            },
          },
          // Ensure smooth scrolling on iOS
          WebkitOverflowScrolling: "touch",
          // Force scrollbar to be more visible on iOS
          ...(isMobile && {
            scrollbarGutter: "stable",
          }),
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress size={32} sx={{ color: COLORS.PRIMARY_PURPLE }} />
          </Box>
        ) : !hasResults && searchQuery.trim().length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              px: 2,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              No results found for "{searchQuery}"
            </Typography>
          </Box>
        ) : (
          <>
            {/* Users Section */}
            {users?.length > 0 && (
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Person
                    sx={{
                      fontSize: 18,
                      color: COLORS.PRIMARY_PURPLE,
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: isDark
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                  >
                    Users
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {users.map((user) => (
                    <Box
                      key={user.id}
                      onClick={() => handleUserClick(user.id)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        bgcolor: "transparent",
                        "&:hover": {
                          bgcolor: isDark
                            ? COLORS.BACKGROUND.SECONDARY_DARK
                            : COLORS.BACKGROUND.SECONDARY_LIGHT,
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <Avatar
                        src={user.profile_pic || undefined}
                        sx={{
                          width: 48,
                          height: 48,
                          border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
                        }}
                      >
                        {user.first_name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
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
                          variant="caption"
                          sx={{
                            color: isDark
                              ? COLORS.TEXT.SECONDARY_DARK
                              : COLORS.TEXT.SECONDARY_LIGHT,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Star
                            sx={{
                              fontSize: 12,
                              color: "#FFC107",
                            }}
                          />
                          {user.rating.toFixed(1)} • {user.city}
                        </Typography>
                      </Box>
                      {user.type === "SERVICE_PROVIDER" && (
                        <Business
                          sx={{
                            fontSize: 18,
                            color: COLORS.PRIMARY_PURPLE,
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Services Section */}
            {services.length > 0 && (
              <Box sx={{ p: 2 }}>
                {users.length > 0 && <Divider sx={{ my: 1 }} />}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Business
                    sx={{
                      fontSize: 18,
                      color: COLORS.PRIMARY_PURPLE,
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: isDark
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                  >
                    Services
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      sx={{
                        cursor: "pointer",
                        borderRadius: "12px",
                        border: `1px solid ${
                          isDark
                            ? COLORS.BORDER.DEFAULT_DARK
                            : COLORS.BORDER.DEFAULT_LIGHT
                        }`,
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.SECONDARY_DARK
                          : COLORS.BACKGROUND.SECONDARY_LIGHT,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: isDark
                            ? "0px 4px 16px rgba(94, 24, 233, 0.3)"
                            : "0px 4px 16px rgba(94, 24, 233, 0.15)",
                          borderColor: COLORS.PRIMARY_PURPLE,
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1.5 }}>
                        <CardMedia
                          component="img"
                          image={
                            service.image ||
                            "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                          }
                          alt={service.name}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: "8px",
                            bgcolor: isDark
                              ? COLORS.BACKGROUND.SECONDARY_DARK
                              : COLORS.BACKGROUND.SECONDARY_LIGHT,
                          }}
                        />
                        <CardContent
                          sx={{
                            flex: 1,
                            p: "12px !important",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: isDark
                                  ? COLORS.TEXT.PRIMARY_DARK
                                  : COLORS.TEXT.PRIMARY_LIGHT,
                                mb: 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {service.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: isDark
                                  ? COLORS.TEXT.SECONDARY_DARK
                                  : COLORS.TEXT.SECONDARY_LIGHT,
                              }}
                            >
                              by {service.provider_name}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              mt: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Rating
                                value={service.rating}
                                readOnly
                                size="small"
                                sx={{
                                  "& .MuiRating-iconFilled": {
                                    color: "#FFC107",
                                  },
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: isDark
                                    ? COLORS.TEXT.SECONDARY_DARK
                                    : COLORS.TEXT.SECONDARY_LIGHT,
                                }}
                              >
                                {service.rating.toFixed(1)}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color: COLORS.PRIMARY_PURPLE,
                              }}
                            >
                              ₹{service.price}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* See All Button */}
      {showSeeAll && (
        <>
          <Divider />
          <Box
            onClick={onSeeAll}
            sx={{
              p: 1.5,
              cursor: "pointer",
              textAlign: "center",
              bgcolor: isDark
                ? COLORS.BACKGROUND.SECONDARY_DARK
                : COLORS.BACKGROUND.SECONDARY_LIGHT,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: isDark
                  ? COLORS.BACKGROUND.PRIMARY_DARK
                  : COLORS.BACKGROUND.PRIMARY_LIGHT,
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: COLORS.PRIMARY_PURPLE,
              }}
            >
              {t("seeAllResults")} "{searchQuery}"
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default SearchDropdown;
