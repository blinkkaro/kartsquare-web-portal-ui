"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Share, InfoOutlined, Sell, Room, StarBorder } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Image from "next/image";
import ServiceImageCarousel from "../../../ServiceImageCarousel";
import ProviderInfoCard from "../../../ProviderInfoCard";
import ServiceCard from "../../../ServiceCard";
import { COLORS } from "../../../../constants/colors";
import CustomerServiceBreadcrumb from "./CustomerServiceBreadcrumb";
import CustomerServiceInfo from "./CustomerServiceInfo";
import CustomerServiceDetailsGrid from "./CustomerServiceDetailsGrid";
import CustomerServicePricing from "../../../common/CustomerServicePricing";
import ServiceTitleBlock from "./ServiceTitleBlock";
import ServiceStatPills from "./ServiceStatPills";
import ServiceAccordionSection from "./ServiceAccordionSection";
import ServiceBookingSidebar from "./ServiceBookingSidebar";
import ServiceMobileStickyBar from "./ServiceMobileStickyBar";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const NEW_LISTING_WINDOW_DAYS = 30;

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

  const handleCall = () => {
    if (service?.provider_phone_number) {
      window.location.href = `tel:${service.provider_phone_number}`;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.service_name,
          text: `Check out ${service?.service_name} on kartsquare!`,
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

  const isPriceRequired =
    service.pricing_type === "noPrice" ? false : service.is_price_required;

  const isNewListing =
    !!service.created_at &&
    Date.now() - new Date(service.created_at).getTime() <
      NEW_LISTING_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const showWhatsApp =
    !!(service.provider_whatsapp_country_code && service.provider_whatsapp_number) ||
    !!service.provider_phone_number;

  return (
    <MainLayout>
      <Box
        sx={{
          bgcolor: isDark
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.SECONDARY_LIGHT,
          minHeight: "100vh",
          pt: { xs: 2, sm: 4, md: 10 },
          pb: { xs: 12, md: 4 },
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
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1 }}>
            <CustomerServiceBreadcrumb serviceName={service.service_name || ""} />
            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <IconButton
                onClick={handleShare}
                size="small"
                sx={{
                  bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
                }}
              >
                <Share fontSize="small" sx={{ color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }} />
              </IconButton>
              <IconButton
                onClick={handleChatClick}
                size="small"
                sx={{
                  bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
                }}
              >
                <Image
                  src={isDark ? "/icons/darkThemeChat.svg" : "/icons/chat.svg"}
                  alt="Chat"
                  width={18}
                  height={18}
                />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.7fr 1fr" },
              gap: { xs: 3, md: 4 },
              alignItems: "start",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {/* Main column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
              <ServiceImageCarousel images={images} serviceName={service.service_name || ""} />

              <ServiceTitleBlock
                name={service.business_name || service.service_name || ""}
                categoryName={service.category_name || []}
                city={service.service_address?.city_town}
                isNew={isNewListing}
                avgRating={service.avg_service_rating}
                reviewCount={totalReviews}
              />

              <ServiceStatPills
                currency={service.currency}
                visitingCharge={service.visiting_charge}
                serviceRadius={service.service_radius}
                serviceDuration={service.service_duration}
                hasServiceDuration={service.has_service_duration}
                serviceAtLocation={service.service_at_location}
              />

              {service.has_service_duration && (
                <CustomerServiceDetailsGrid
                  serviceDuration={service.service_duration || 0}
                  haveSlots={service.have_slots}
                />
              )}

              <ServiceAccordionSection
                title="About This Service"
                icon={<InfoOutlined sx={{ fontSize: 17 }} />}
                defaultExpanded
              >
                <CustomerServiceInfo
                  serviceName={service.service_name || ""}
                  serviceDesc={service.service_desc || ""}
                  onContinueReading={() => setDescriptionDrawerOpen(true)}
                  showContinueReading={
                    !!(service.service_desc && service.service_desc.length > 50)
                  }
                />
              </ServiceAccordionSection>

              <ServiceAccordionSection
                title="Services & Pricing"
                icon={<Sell sx={{ fontSize: 16 }} />}
                defaultExpanded
              >
                <CustomerServicePricing
                  pricingType={service.pricing_type}
                  priceCatalogUrls={service.price_catalog_url}
                  priceItems={service.price_items}
                  currency={service.currency}
                  onGetQuote={() => setGetQuoteModalOpen(true)}
                  hideHeader
                />
              </ServiceAccordionSection>

              <ServiceAccordionSection title="Location" icon={<Room sx={{ fontSize: 17 }} />}>
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
                {service.service_address?.latitude && service.service_address?.longitude && (
                  <Box sx={{ mt: 2 }}>
                    <ServiceDetailsMap
                      latitude={service.service_address.latitude}
                      longitude={service.service_address.longitude}
                      providerName={service.business_name || ""}
                    />
                  </Box>
                )}
              </ServiceAccordionSection>

              <ProviderInfoCard
                providerId={service.provider_id || ""}
                providerName={service.provider_name || ""}
                providerImageUrl={service.provider_image_url || ""}
                isHotSeller={true}
                providerPhoneNumber={service.provider_phone_number || ""}
                businessName={service.business_name || ""}
                isFollowing={service.is_following}
              />

              {relatedServices.length > 0 && (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
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
                      "&::-webkit-scrollbar": { height: "8px" },
                      "&::-webkit-scrollbar-track": {
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.SECONDARY_DARK
                          : COLORS.BACKGROUND.SECONDARY_LIGHT,
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
                        borderRadius: "4px",
                        "&:hover": { bgcolor: COLORS.PRIMARY_PURPLE },
                      },
                    }}
                  >
                    {relatedServices.map((relatedService) => (
                      <Box
                        key={relatedService.service_id}
                        sx={{ minWidth: "280px", maxWidth: "280px", flexShrink: 0 }}
                      >
                        <ServiceCard service={relatedService} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <ServiceAccordionSection
                title={`Reviews (${totalReviews})`}
                icon={<StarBorder sx={{ fontSize: 17 }} />}
              >
                <ReviewsSection
                  reviews={reviews}
                  totalReviews={totalReviews}
                  avgRating={service.avg_service_rating || 0}
                  reviewsLoading={reviewsLoading}
                  onLoadMore={handleLoadMore}
                  showLoadMore={hasNextPage || false}
                  onAddReview={handleWriteReview}
                />
              </ServiceAccordionSection>
            </Box>

            {/* Sticky booking sidebar - desktop only */}
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "sticky",
                top: 96,
              }}
            >
              <ServiceBookingSidebar
                isPriceRequired={isPriceRequired}
                price={service.price || 0}
                currency={service.currency || "INR"}
                onBookNow={handleBookNow}
                onWhatsApp={handleWhatsApp}
                showWhatsApp={showWhatsApp}
                onCall={handleCall}
                showCall={!!service.provider_phone_number}
                onGetQuote={() => setGetQuoteModalOpen(true)}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <ServiceMobileStickyBar
        isPriceRequired={isPriceRequired}
        price={service.price || 0}
        currency={service.currency || "INR"}
        onBookNow={handleBookNow}
      />

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
