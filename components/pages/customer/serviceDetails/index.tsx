"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  useTheme,
  Divider,
} from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Bookmark, Share } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import ServiceImageCarousel from "../../../ServiceImageCarousel";
import ProviderInfoCard from "../../../ProviderInfoCard";
import ServiceCard from "../../../ServiceCard";
import { COLORS } from "../../../../constants/colors";
import CustomerServiceBreadcrumb from "./CustomerServiceBreadcrumb";
import CustomerServiceHeader from "./CustomerServiceHeader";
import CustomerServiceInfo from "./CustomerServiceInfo";
import CustomerServiceActions from "./CustomerServiceActions";
import CustomerServiceDetailsGrid from "./CustomerServiceDetailsGrid";
import CustomerServicePricing from "../../../common/CustomerServicePricing";
import DescriptionDialog from "../../provider/serviceDetails/DescriptionDialog";
import ReviewsSection from "../../provider/serviceDetails/ReviewsSection";
import ServiceLocation from "../../provider/serviceDetails/ServiceLocation";
import MainLayout from "@/app/mainLayout";
import {
  useServiceDetails,
  useProviderServices,
} from "@/hooks/useServiceDetails";
import { useGetReviews } from "@/hooks/useReview";
import EmptyState from "@/components/common/EmptyState";
import { useTranslate } from "@/hooks/useTranslate";
import { secureStorage } from "@/helper/SecureStorage";
import { useDispatch } from "react-redux";
import { openLoginModal } from "@/features/ui/loginModalSlice";
import RightDrawer from "@/components/common/RightDrawer";
import ReviewDrawerContent from "./ReviewDrawerContent";
import { review_type } from "@/services/providerDashboard/providerDashboard.interface";
import ServiceDetailsMap from "../../map/components/ServiceDetailsMap";

const CustomerServiceDetails = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = params.id as string;
  const actions = searchParams.get("action");
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const dispatch = useDispatch();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);

  const handleBookNow = () => {
    const token = secureStorage.getItem("token");
    if (!token) {
      dispatch(openLoginModal());
    } else {
      router.push(`/services/${serviceId}/book`);
    }
  };

  const handleWriteReview = () => {
    const token = secureStorage.getItem("token");
    if (!token) {
      dispatch(openLoginModal());
    } else {
      setReviewModalOpen(true);
    }
  };

  // Use TanStack Query hooks - prevents duplicate API calls
  const {
    data: service,
    isLoading: loading,
    error: serviceError,
  } = useServiceDetails(serviceId);

  // Fetch related services only if service has provider_id
  const { data: providerServices = [], isLoading: relatedServicesLoading } =
    useProviderServices(service?.provider_id, 10, !!service?.provider_id);

  // Filter out current service from related services
  const relatedServices = useMemo(() => {
    return providerServices.filter((s) => s.service_id !== serviceId);
  }, [providerServices, serviceId]);

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetReviews(review_type.SERVICE, serviceId, 1);

  // Flatten reviews from all pages
  const reviews = useMemo(() => {
    return reviewsData?.pages.flatMap((page) => page.reviews) || [];
  }, [reviewsData]);

  useEffect(() => {
    if (actions === "review") {
      setReviewModalOpen(true);
    }
  }, [actions]);

  const handleReviewSubmit = () => {
    setReviewModalOpen(false);
    router.push(`/services/${serviceId}`);
  };

  const totalReviews = reviewsData?.pages[0]?.meta.total || 0;

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            bgcolor: isDark
              ? COLORS.BACKGROUND.PRIMARY_DARK
              : COLORS.BACKGROUND.SECONDARY_LIGHT,
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!loading && !service) {
    return (
      <MainLayout>
        <Box
          sx={{
            bgcolor: isDark
              ? COLORS.BACKGROUND.PRIMARY_DARK
              : COLORS.BACKGROUND.SECONDARY_LIGHT,
            minHeight: "100vh",
          }}
        >
          <EmptyState
            titleKey="service_not_found"
            variant="notFound"
            minHeight="80vh"
          />
        </Box>
      </MainLayout>
    );
  }

  if (!service) {
    return null;
  }

  const images =
    service.image_urls && service.image_urls.length > 0
      ? service.image_urls
      : [
          "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        ];

  return (
    <MainLayout>
      <Box
        sx={{
          bgcolor: isDark
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.SECONDARY_LIGHT,
          minHeight: "100vh",
          pt: { xs: 2, sm: 4, md: 10 },
          pb: { xs: 8, sm: 8, md: 4 },
          px: { xs: 0.5, sm: 1, md: 2 },
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            px: { xs: 1, sm: 2, md: 3 },
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <CustomerServiceBreadcrumb serviceName={service.service_name || ""} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                lg: "1fr 1fr auto",
              },
              gap: { xs: 2, sm: 3, md: 4 },
              alignItems: "start",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            <Box
              sx={{
                position: { xs: "static", md: "sticky" },
                order: { xs: 1, md: 1 },
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <ServiceImageCarousel
                images={images}
                serviceName={service.service_name || ""}
              />
              <CustomerServicePricing
                pricingType={service.pricing_type}
                priceCatalogUrls={service.price_catalog_url}
                priceItems={service.price_items}
                currency={service.currency}
              />
              {service.service_address?.latitude &&
                service.service_address?.longitude && (
                  <ServiceDetailsMap
                    latitude={service.service_address.latitude}
                    longitude={service.service_address.longitude}
                    providerName={service.business_name || ""}
                  />
                )}
            </Box>

            <Box
              sx={{
                order: { xs: 2, md: 2 },
                bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "white",
                borderRadius: "16px",
                p: { xs: 1.5, sm: 2.5, md: 3 },
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}`,
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <Box sx={{ py: 2 }}>
                <CustomerServiceHeader
                  isPriceRequired={
                    service.pricing_type === "noPrice"
                      ? false
                      : service.is_price_required
                  }
                  price={service.price || 0}
                  currency={service.currency || "INR"}
                  categoryName={service.category_name || ""}
                  subCategoryName={service.sub_category_name || ""}
                  onBookmark={() => {
                    /* TODO: Implement */
                  }}
                  onShare={() => {
                    /* TODO: Implement */
                  }}
                />
              </Box>

              <Divider sx={{ opacity: 0.6 }} />

              <Box sx={{ py: 2 }}>
                <CustomerServiceInfo
                  serviceName={service.service_name || ""}
                  serviceDesc={service.service_desc || ""}
                  onContinueReading={() => setDescriptionDrawerOpen(true)}
                  showContinueReading={
                    !!(service.service_desc && service.service_desc.length > 50)
                  }
                />
              </Box>

              <Divider sx={{ opacity: 0.6 }} />

              <Box sx={{ py: 2 }}>
                <CustomerServiceActions
                  onAddToCart={() => {
                    /* TODO: Implement */
                  }}
                  onBookNow={() => handleBookNow()}
                />
              </Box>

              {service.has_service_duration && (
                <>
                  <Divider sx={{ opacity: 0.6 }} />

                  <Box sx={{ py: 2 }}>
                    <CustomerServiceDetailsGrid
                      serviceDuration={service.service_duration || 0}
                      haveSlots={service.have_slots}
                    />
                  </Box>
                </>
              )}

              <Divider sx={{ opacity: 0.6 }} />

              <Box sx={{ py: 2 }}>
                <ServiceLocation
                  address={{
                    address: service.service_address?.address || "",
                    building_no: service.service_address?.building_no || "",
                    floor: service.service_address?.floor || "",
                    landmark: service.service_address?.landmark || "",
                    city_town: service.service_address?.city_town || "",
                    state: service.service_address?.state || "",
                    country: service.service_address?.country || "",
                    pincode: service.service_address?.pincode || "",
                    latitude: service.service_address?.latitude || 0,
                    longitude: service.service_address?.longitude || 0,
                  }}
                  serviceAtLocation={service.service_at_location}
                  visitingCharge={service.visiting_charge}
                  serviceRadius={service.service_radius}
                />
              </Box>

              <Divider sx={{ opacity: 0.6 }} />

              <Box sx={{ py: 3 }}>
                {/* <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 800,
                                        mb: 2,
                                        display: "block",
                                        letterSpacing: "0.1em",
                                        color: "#94A3B8"
                                    }}
                                >
                                    {service.provider_name?.toUpperCase() || "SERVICE PROVIDER"} INFO.
                                </Typography> */}
                <ProviderInfoCard
                  providerId={service.provider_id || ""}
                  providerName={service.provider_name || ""}
                  providerImageUrl={service.provider_image_url || ""}
                  isHotSeller={true}
                  providerPhoneNumber={service.provider_phone_number || ""}
                  businessName={service.business_name || ""}
                  isFollowing={service.is_following}
                />
              </Box>

              {relatedServices.length > 0 && (
                <>
                  <Divider sx={{ opacity: 0.6 }} />
                  <Box sx={{ py: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: isDark
                          ? COLORS.TEXT.PRIMARY_DARK
                          : COLORS.TEXT.PRIMARY_LIGHT,
                      }}
                    >
                      {t("other_services")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        overflowX: "auto",
                        pb: 2,
                        "&::-webkit-scrollbar": {
                          height: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                          bgcolor: isDark
                            ? COLORS.BACKGROUND.SECONDARY_DARK
                            : COLORS.BACKGROUND.SECONDARY_LIGHT,
                          borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          bgcolor: isDark
                            ? COLORS.BORDER.DEFAULT_DARK
                            : COLORS.BORDER.DEFAULT_LIGHT,
                          borderRadius: "4px",
                          "&:hover": {
                            bgcolor: COLORS.PRIMARY_PURPLE,
                          },
                        },
                      }}
                    >
                      {relatedServices.map((relatedService) => (
                        <Box
                          key={relatedService.service_id}
                          sx={{
                            minWidth: "280px",
                            maxWidth: "280px",
                            flexShrink: 0,
                          }}
                        >
                          <ServiceCard service={relatedService} />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </>
              )}

              <Divider sx={{ opacity: 0.6 }} />

              <Box sx={{ py: 3 }}>
                <ReviewsSection
                  reviews={reviews}
                  totalReviews={totalReviews}
                  avgRating={service.avg_service_rating || 0}
                  reviewsLoading={reviewsLoading}
                  onLoadMore={handleLoadMore}
                  showLoadMore={hasNextPage || false}
                  onAddReview={handleWriteReview}
                />
              </Box>
            </Box>

            {/* Right Column - Action Buttons - Mobile: Horizontal, Desktop: Vertical (Synced with Provider) 
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", lg: "column" },
                gap: { xs: 1, sm: 2 },
                justifyContent: { xs: "flex-start", lg: "flex-start" },
                order: { xs: 3, md: 3 },
                pt: { xs: 0, lg: 1 },
                mb: { xs: 2, lg: 0 },
                width: { xs: "100%", lg: "auto" },
                maxWidth: { xs: "100%", lg: "auto" },
              }}
            >
              <IconButton
                onClick={() => {
                  /* TODO: Implement save/bookmark 
                
                sx={{
                  bgcolor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.9)",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                  "&:hover": {
                    bgcolor: isDark
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(255, 255, 255, 1)",
                  },
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                }}
              >
                <Bookmark fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => {
                  /* TODO: Implement share 
                sx={{
                  bgcolor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.9)",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                  "&:hover": {
                    bgcolor: isDark
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(255, 255, 255, 1)",
                  },
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                }}
              >
                <Share fontSize="small" />
              </IconButton>
            </Box>*/}
          </Box>
        </Container>
      </Box>

      <DescriptionDialog
        open={descriptionDrawerOpen}
        onClose={() => setDescriptionDrawerOpen(false)}
        description={service.service_desc || ""}
      />
      <RightDrawer
        open={reviewModalOpen}
        onClose={handleReviewSubmit}
        width={500}
        title={t("write_review")}
      >
        <ReviewDrawerContent service={service} onClose={handleReviewSubmit} />
      </RightDrawer>
    </MainLayout>
  );
};

export default CustomerServiceDetails;
