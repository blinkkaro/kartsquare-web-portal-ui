"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Card,
  CardMedia,
  CardContent,
  Rating,
  useTheme,
  Divider,
  Paper,
} from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { Star, Person, Business, Search as SearchIcon } from "@mui/icons-material";
import { useSearchParams, useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { searchService } from "@/services/search/searchService";
import { SearchUser, SearchService as SearchServiceType, SearchService } from "@/services/search/searchInterface";
import ServiceCard from "@/components/ServiceCard";
import { Service } from "@/services/serviceList/listInteraface";
import { useDispatch } from "react-redux";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import PageHeading from "@/components/common/PageHeading";

const SearchResultsView: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [services, setServices] = useState<SearchServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
    setPage(1);
    setUsers([]);
    setServices([]);
    setHasMore(true);
    
    if (query.trim()) {
      performSearch(query, 1, true);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const performSearch = async (query: string, pageNum: number, reset: boolean = false) => {
    try {
      setLoading(reset);
      const response = await searchService.search(query, 20, pageNum);
      
      if (response.status === "success") {
        if (reset) {
          setUsers(response.data.users || []);
          setServices(response.data.services || []);
        } else {
          setUsers((prev) => [...prev, ...(response.data.users || [])]);
          setServices((prev) => [...prev, ...(response.data.services || [])]);
        }
        
        const totalResults = (response.data.users?.length || 0) + (response.data.services?.length || 0);
        setHasMore(totalResults >= 20);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && searchQuery.trim()) {
          const nextPage = page + 1;
          setPage(nextPage);
          performSearch(searchQuery, nextPage, false);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, searchQuery, page]);

  const handleUserClick = (userId: string) => {
    // Open profile drawer instead of navigating
    dispatch(openDrawer({ userId }));
  };

  const convertToServiceCard = (service:SearchService) : any => {
    return {
      service_id: service.id,
      service_name: service.name,
      price: service.price,
      avg_service_rating: service.rating,
      image_urls: [service.image],
      provider_id: "",
      provider_name: service.provider_name,
      provider_image_url: null,
      category_id: "",
      category_name: "",
      subcategory_id: "",
      subcategory_name: "",
      description: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      latitude: null,
      longitude: null,
      service_provider_latitude: null,
      service_provider_longitude: null,
      is_active: true,
      created_at: "",
      updated_at: "",
    };
  };

  if (loading && users.length === 0 && services.length === 0) {
    return <CenteredLoader minHeight="400px" size={60} />;
  }

  if (!searchQuery.trim()) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
          px: 2,
        }}
      >
        <SearchIcon
          sx={{
            fontSize: 64,
            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
            mb: 2,
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
            mb: 1,
          }}
        >
          {t("searchResults")}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          {t("enterSearchQuery")}
        </Typography>
      </Box>
    );
  }

  const hasResults = users.length > 0 || services.length > 0;

  return (
    <Box sx={{ py: 3 , backgroundColor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT , padding: 3 , height: "100%" }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <PageHeading
          title={t("searchResults")}
          subtitle={
            hasResults
              ? `${t("searchResultsFor")} "${searchQuery}"`
              : `${t("noResultsFound")} "${searchQuery}"`
          }
        />
      </Box>

      {!hasResults && !loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
            px: 2,
          }}
        >
          <SearchIcon
            sx={{
              fontSize: 64,
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
              mb: 1,
            }}
          >
            {t("noResultsFound")} "{searchQuery}"
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
            }}
          >
            {t("tryDifferentSearch")}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Users Section */}
          {users.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <Person
                    sx={{
                      fontSize: 24,
                      color: COLORS.PRIMARY_PURPLE,
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: isDark
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                  >
                    {t("users")} ({users.length})
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {users.map((user) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
                      <Paper
                        onClick={() => handleUserClick(user.id)}
                        sx={{
                          p: 2,
                          borderRadius: "16px",
                          cursor: "pointer",
                          border: `1px solid ${
                            isDark
                              ? COLORS.BORDER.DEFAULT_DARK
                              : COLORS.BORDER.DEFAULT_LIGHT
                          }`,
                          bgcolor: isDark
                            ? COLORS.BACKGROUND.PAPER_DARK
                            : COLORS.BACKGROUND.PAPER_LIGHT,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: isDark
                              ? "0px 8px 30px rgba(94, 24, 233, 0.3)"
                              : "0px 8px 25px rgba(94, 24, 233, 0.15)",
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Avatar
                            src={user.profile_pic || undefined}
                            sx={{
                              width: 64,
                              height: 64,
                              border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
                            }}
                          >
                            {user.first_name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: isDark
                                  ? COLORS.TEXT.PRIMARY_DARK
                                  : COLORS.TEXT.PRIMARY_LIGHT,
                                mb: 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {user.first_name} {user.last_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: isDark
                                  ? COLORS.TEXT.SECONDARY_DARK
                                  : COLORS.TEXT.SECONDARY_LIGHT,
                                mb: 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              @{user.username}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Star
                                sx={{
                                  fontSize: 16,
                                  color: "#FFC107",
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
                                {user.rating.toFixed(1)} • {user.city}
                              </Typography>
                            </Box>
                          </Box>
                          {user.type === "SERVICE_PROVIDER" && (
                            <Business
                              sx={{
                                fontSize: 24,
                                color: COLORS.PRIMARY_PURPLE,
                              }}
                            />
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          )}

          {/* Services Section */}
          {services.length > 0 && (
            <Grid size={{ xs: 12 }}>
              {users.length > 0 && <Divider sx={{ my: 4 }} />}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <Business
                    sx={{
                      fontSize: 24,
                      color: COLORS.PRIMARY_PURPLE,
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: isDark
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                  >
                    {t("services")} ({services.length})
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  {services.map((service) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={service.id}>
                      <ServiceCard service={convertToServiceCard(service)} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          )}

          {/* Load More Indicator */}
          {hasMore && (
            <Grid size={{ xs: 12 }}>
              <Box
                ref={loadMoreRef}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 4,
                }}
              >
                {loading && (
                  <LogoLoader size={40} />
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default SearchResultsView;
