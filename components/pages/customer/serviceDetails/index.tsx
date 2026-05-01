"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Bookmark, Share, ChatOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Image from "next/image";
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
import axios from "axios";
import toast from "react-hot-toast";
import GetQuoteModal from "./GetQuoteModal";
import { getServiceRouteParam } from "@/utils/serviceRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
  const [getQuoteModalOpen, setGetQuoteModalOpen] = useState(false);

  const handleBookNow = () => {
    const token = secureStorage.getItem("token");
    if (!token) {
      dispatch(openLoginModal());
    } else {
      router.push(`/services/${serviceId}/book`);
    }
  };

  const handleWhatsApp = () => {
    if (service?.provider_whatsapp_country_code && service?.provider_whatsapp_number) {
      let code = service.provider_whatsapp_country_code;
      if (code.startsWith("+")) {
        code = code.substring(1);
      }
      const text = encodeURIComponent(`Hi, I am interested in your service: ${service.service_name}`);
      const url = `https://wa.me/${code}${service.provider_whatsapp_number}?text=${text}`;
      window.open(url, "_blank");
    } else if (service?.provider_phone_number) {
      // Fallback to phone number if specifically whatsapp is not there,
      // assuming phone number might have whatsapp.
      const url = `https://wa.me/${service.provider_phone_number.replace('+', '')}?text=${encodeURIComponent(`Hi, I am interested in your service: ${service.service_name}`)}`;
      window.open(url, "_blank");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.service_name,
          text: `Check out ${service?.service_name} on KartSquare!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleChatClick = async () => {
    const token = secureStorage.getItem("token");
    if (!token) {
      dispatch(openLoginModal());
      return;
    }

    const targetUserId = service?.provider_id;

    if (!targetUserId) {
      toast.error("Provider ID not found for chatting.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/chat/conversations`,
        {
          participant2_id: targetUserId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === "success") {
        router.push(`/chat?conversationId=${res.data.data.id}`);
      }
    } catch (err) {
      console.error("Failed to initialize chat", err);
      toast.error("Could not start chat.");
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
    if (!service?.service_id) return providerServices;
    return providerServices.filter((s) => s.service_id !== service.service_id);
  }, [providerServices, service?.service_id]);

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
    const routeParam = getServiceRouteParam(service || { service_id: serviceId });
    router.push(`/services/${routeParam}`);
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
        <CenteredLoader minHeight="100vh" py={0} />
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
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: { xs: "static", md: "sticky" },
                order: { xs: 2, md: 1 },
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
                onGetQuote={() => setGetQuoteModalOpen(true)}
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
                order: { xs: 3, md: 2 },
                bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "white",
                borderRadius: "16px",
                p: { xs: 1.5, sm: 2.5, md: 3 },
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}`,
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <Box sx={{ pb: 2 }}>
                <CustomerServiceHeader
                  isPriceRequired={
                    service.pricing_type === "noPrice"
                      ? false
                      : service.is_price_required
                  }
                  price={service.price || 0}
                  currency={service.currency || "INR"}
                  categoryName={service.category_name || []}
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
                  onWhatsApp={handleWhatsApp}
                  showWhatsApp={
                    !!(service.provider_whatsapp_country_code && service.provider_whatsapp_number) ||
                    !!service.provider_phone_number
                  }
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

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", lg: "column" },
                gap: { xs: 1, sm: 2 },
                justifyContent: { xs: "flex-end", lg: "flex-start" },
                order: { xs: 1, md: 3 },
                pt: { xs: 0, lg: 1 },
                mb: { xs: 2, lg: 0 },
                width: { xs: "100%", lg: "auto" },
                maxWidth: { xs: "100%", lg: "auto" },
              }}
            >
              <IconButton
                onClick={handleShare}
                sx={{
                  backgroundColor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
                  boxShadow: COLORS.SHADOW.DEFAULT,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.LIGHT_GRAY,
                  },
                }}
              >
                <Share fontSize="small" sx={{ color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }} />
              </IconButton>
              <IconButton
                onClick={handleChatClick}
                sx={{
                  backgroundColor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
                  boxShadow: COLORS.SHADOW.DEFAULT,
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  "&:hover": {
                    backgroundColor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.LIGHT_GRAY,
                  },
                }}
              >
                <Image
                  src={isDark ? "/icons/darkThemeChat.svg" : "/icons/chat.svg"}
                  alt="Chat"
                  width={20}
                  height={20}
                />
              </IconButton>
            </Box>
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

      <GetQuoteModal
        open={getQuoteModalOpen}
        onClose={() => setGetQuoteModalOpen(false)}
        providerId={service.provider_id || ""}
        serviceName={service.service_name || ""}
        businessName={service.business_name || ""}
      />
    </MainLayout>
  );
};

export default CustomerServiceDetails;
