"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import SellOutlined from "@mui/icons-material/SellOutlined";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
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
import { getServiceHref } from "@/utils/serviceRoute";
import { SERVICE_FALLBACK_IMAGE } from "@/constants/media";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const NEW_LISTING_WINDOW_DAYS = 30;

const CustomerServiceDetails = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Canonical route /services/[city]/[slug] (slug) or legacy /services/[first] (uuid or slug).
  const serviceId = (params.second ?? params.slug ?? params.first ?? params.id) as string;
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
    router.push(getServiceHref(service || { service_id: serviceId }));
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
            bgcolor: isDark ? "background.default" : COLORS.NEW_UI.PAGE_BG_LIGHT,
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
          SERVICE_FALLBACK_IMAGE,
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

  const cardBorder = isDark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT;
  const cardShadow = isDark ? COLORS.NEW_UI.CARD_SHADOW_DARK : COLORS.NEW_UI.CARD_SHADOW_LIGHT;

  const iconButtonSx = {
    width: 38,
    height: 38,
    bgcolor: "background.paper",
    border: "1px solid",
    borderColor: isDark ? COLORS.NEW_UI.DIVIDER_DARK : COLORS.NEW_UI.DIVIDER_LIGHT,
    color: "text.primary",
    transition: "all 0.15s ease",
    "&:hover": {
      borderColor: COLORS.PRIMARY_PURPLE,
      color: COLORS.PRIMARY_PURPLE,
      bgcolor: COLORS.PURPLE_ALPHA_04,
    },
  };

  return (
    <MainLayout>
      <Box
        sx={{
          bgcolor: isDark ? "background.default" : COLORS.NEW_UI.PAGE_BG_LIGHT,
          minHeight: "100vh",
          pb: { xs: 12, md: 10 },
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2.5, md: 3, lg: 4 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              pt: { xs: 2, md: 3 },
              pb: 2,
            }}
          >
            <CustomerServiceBreadcrumb serviceName={service.service_name || ""} />
            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <IconButton onClick={handleShare} aria-label="Share this service" sx={iconButtonSx}>
                <IosShareRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                onClick={handleChatClick}
                aria-label="Chat with provider"
                sx={iconButtonSx}
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
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 340px", lg: "minmax(0, 1fr) 360px" },
              gap: { xs: 2.5, md: 3 },
              alignItems: "start",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            {/* Main column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, minWidth: 0 }}>
              <Box
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: cardBorder,
                  boxShadow: cardShadow,
                  bgcolor: isDark ? COLORS.NEW_UI.SURFACE_SOFT_DARK : COLORS.NEW_UI.SURFACE_SOFT_LIGHT,
                }}
              >
                <ServiceImageCarousel images={images} serviceName={service.service_name || ""} />
              </Box>

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
                title="About this service"
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
                title="Services & pricing"
                icon={<SellOutlined sx={{ fontSize: 17 }} />}
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

              <ServiceAccordionSection title="Location" icon={<PlaceRoundedIcon sx={{ fontSize: 17 }} />}>
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
                  <Box sx={{ mt: 2, borderRadius: "12px", overflow: "hidden" }}>
                    <ServiceDetailsMap
                      latitude={service.service_address.latitude}
                      longitude={service.service_address.longitude}
                      providerName={service.business_name || ""}
                    />
                  </Box>
                )}
              </ServiceAccordionSection>

              <Box
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: cardBorder,
                  boxShadow: cardShadow,
                  bgcolor: "background.paper",
                }}
              >
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
                <Box component="section" aria-labelledby="other-services-heading">
                  <Typography
                    id="other-services-heading"
                    component="h2"
                    sx={{
                      fontSize: { xs: "1.1rem", sm: "1.25rem" },
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      color: "text.primary",
                      mb: 1.5,
                    }}
                  >
                    {t("other_services")}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      overflowX: "auto",
                      pb: 1.5,
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": { display: "none" },
                      WebkitOverflowScrolling: "touch",
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
                icon={<StarRoundedIcon sx={{ fontSize: 18 }} />}
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
                alignSelf: "start",
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
