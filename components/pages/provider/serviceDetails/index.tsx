"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { useParams, useRouter } from "next/navigation";
import { Edit, Delete, Share } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import ServiceImageCarousel from "../../../ServiceImageCarousel";
import { COLORS } from "../../../../constants/colors";
import AddServiceDrawer from "../addService";
import { serviceListService } from "../../../../services/serviceList/serviceListService";
import { useTranslate } from "@/hooks/useTranslate";
import EmptyState from "@/components/common/EmptyState";
import ServiceDetailsBreadcrumb from "./ServiceDetailsBreadcrumb";
import ServiceDetailsHeader from "./ServiceDetailsHeader";
import ServiceDetailsInfo from "./ServiceDetailsInfo";
import ServiceDetailsGrid from "./ServiceDetailsGrid";
import ServiceLocation from "./ServiceLocation";
import ReviewsSection from "./ReviewsSection";
import DescriptionDrawer from "./DescriptionDialog";
import DeleteDialog from "./DeleteDialog";
import ShareDialog from "./ShareDialog";
import AdvancePayInfo from "./AdvancePayInfo";
import MainLayout from "@/app/mainLayout";
import { useServiceDetails } from "@/hooks/useServiceDetails";
import { useGetReviews } from "@/hooks/useReview";
import { useQueryClient } from "@tanstack/react-query";
import CustomerServicePricing from "@/components/common/CustomerServicePricing";
import { review_type } from "@/services/providerDashboard/providerDashboard.interface";
import ServiceDetailsMap from "../../map/components/ServiceDetailsMap";
import { useProfile, useUpdateShowNumber } from "@/hooks/useProfile";

const ProviderServiceDetails = () => {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  const theme = useTheme();
  const { t } = useTranslate();
  const isDark = theme.palette.mode === "dark";
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const { mutate: updateShowNumber } = useUpdateShowNumber();

  // State
  const reviewsPerPage = 5;
  const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Use TanStack Query hooks - prevents duplicate API calls
  const {
    data: service,
    isLoading: loading,
    error: serviceError,
  } = useServiceDetails(serviceId);

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

  const totalReviews = reviewsData?.pages[0]?.meta.total || 0;

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const handleEdit = () => {
    setEditDrawerOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await serviceListService.deleteService(serviceId);
      // Invalidate queries after deletion
      queryClient.invalidateQueries({ queryKey: ["provider-services-list"] });
      router.push("/spr/servicesList");
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusToggle = async (newStatus: "ACTIVE" | "INACTIVE") => {
    try {
      setUpdatingStatus(true);
      await serviceListService.toggleServiceStatus(serviceId, newStatus);
      queryClient.invalidateQueries({
        queryKey: ["service-details", serviceId],
      });
      queryClient.invalidateQueries({ queryKey: ["provider-services-list"] });
    } catch (error) {
      console.error("Failed to toggle service status:", error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleEditSuccess = () => {
    // Invalidate and refetch service details and list after edit
    queryClient.invalidateQueries({ queryKey: ["service-details", serviceId] });
    queryClient.invalidateQueries({ queryKey: ["provider-services-list"] });
  };

  if (loading) {
    return (
      <MainLayout>
        <CenteredLoader minHeight="100vh" py={0} />
      </MainLayout>
    );
  }

  if (!service) {
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
          pb: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Breadcrumb */}
          <ServiceDetailsBreadcrumb serviceName={service.service_name} />

          {/* Main Content Grid - Responsive layout */}
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
            }}
          >
            {/* Left Column - Images Only (Square) */}
            <Box
              sx={{
                position: { xs: "static", md: "sticky" },
                top: { md: 80 },
                order: { xs: 1, md: 1 },
              }}
            >
              <ServiceImageCarousel
                images={images}
                serviceName={service.service_name}
              />
              <Box sx={{ py: 2 }}>
                <CustomerServicePricing
                  pricingType={service.pricing_type}
                  priceCatalogUrls={service.price_catalog_url}
                  priceItems={service.price_items}
                  currency={service.currency}
                />
                <Box sx={{ mt: 2 }}>
                  {" "}
                  {service.service_address?.latitude &&
                    service.service_address?.longitude && (
                      <ServiceDetailsMap
                        latitude={service.service_address.latitude}
                        longitude={service.service_address.longitude}
                        providerName={service.business_name || ""}
                      />
                    )}
                </Box>
              </Box>
            </Box>

            {/* Middle Column - All Content */}
            <Box
              sx={{
                order: { xs: 2, md: 2 },
                bgcolor: isDark ? "rgba(255, 255, 255, 0.04)" : "white",
                borderRadius: "16px",
                p: { xs: 2, sm: 3 },
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}`,
              }}
            >
              {/* Price and Category */}
              <Box sx={{ py: 2 }}>
                <ServiceDetailsHeader
                  price={service.price || 0}
                  currency={service.currency || "INR"}
                  categoryName={service.category_name || ""}
                  isPriceRequired={
                    service.pricing_type === "noPrice"
                      ? false
                      : service.is_price_required
                  }
                />
              </Box>

              <Divider sx={{ opacity: 0.6 }} />

              {/* Service Info */}
              <Box sx={{ py: 2 }}>
                <ServiceDetailsInfo
                  serviceName={service.service_name || ""}
                  serviceDesc={service.service_desc || ""}
                  status={service.status || "ACTIVE"}
                  createdAt={service.created_at}
                  onContinueReading={() => setDescriptionDrawerOpen(true)}
                  showContinueReading={
                    !!(service.service_desc && service.service_desc.length > 50)
                  }
                />
              </Box>

              <Divider sx={{ opacity: 0.6 }} />

              {/* Service Details Grid (Duration & Status) */}
              <Box sx={{ py: 1 }}>
                <ServiceDetailsGrid
                  hasServiceDuration={service.has_service_duration}
                  serviceDuration={service.service_duration || 0}
                  serviceStatus={service.status === "ACTIVE"}
                  onStatusToggle={handleStatusToggle}
                  isUpdating={updatingStatus}
                  status={service.status}
                  haveSlots={service.have_slots}
                  showNumber={profile?.show_number}
                  onShowNumberToggle={(checked) => updateShowNumber(checked)}
                />
              </Box>

              <Divider sx={{ opacity: 0.6 }} />

              {/* Service Location */}
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

              {/* Reviews Section */}
              <Box sx={{ py: 2 }}>
                <ReviewsSection
                  reviews={reviews}
                  totalReviews={totalReviews}
                  avgRating={service.avg_service_rating}
                  reviewsLoading={reviewsLoading}
                  onLoadMore={handleLoadMore}
                  showLoadMore={hasNextPage || false}
                />
              </Box>
            </Box>

            {/* Right Column - Action Buttons - Mobile: Horizontal, Desktop: Vertical */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", lg: "column" },
                gap: { xs: 1, sm: 2 },
                justifyContent: { xs: "flex-start", lg: "flex-start" },
                order: { xs: 3, md: 3 },
                pt: { xs: 0, lg: 1 },
                mb: { xs: 2, lg: 0 },
              }}
            >
              <IconButton
                onClick={handleEdit}
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
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  bgcolor: isDark
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.9)",
                  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                  color: "error.main",
                  "&:hover": {
                    bgcolor: isDark
                      ? "rgba(255, 255, 255, 0.12)"
                      : "rgba(255, 255, 255, 1)",
                  },
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => setShareDialogOpen(true)}
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
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Description Dialog */}
      <DescriptionDrawer
        open={descriptionDrawerOpen}
        onClose={() => setDescriptionDrawerOpen(false)}
        description={service.service_desc || ""}
      />

      {/* Edit Service Drawer */}
      <AddServiceDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        onSuccess={handleEditSuccess}
        editService={service}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        serviceName={service.service_name}
        deleting={deleting}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        serviceName={service.service_name}
        serviceId={service.service_id}
      />
    </MainLayout>
  );
};

export default ProviderServiceDetails;
