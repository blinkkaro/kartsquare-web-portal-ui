"use client";
import React, { useState, useMemo } from "react";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    useTheme,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { Bookmark, Share } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import ServiceImageCarousel from "../../../ServiceImageCarousel";
import ProviderInfoCard from "../../../ProviderInfoCard";
import ServiceCard from "../../../ServiceCard";
import { Service } from "../../../../services/serviceList/listInteraface";
import { COLORS } from "../../../../constants/colors";
import CustomerServiceBreadcrumb from "./CustomerServiceBreadcrumb";
import CustomerServiceHeader from "./CustomerServiceHeader";
import CustomerServiceInfo from "./CustomerServiceInfo";
import CustomerServiceActions from "./CustomerServiceActions";
import CustomerServiceDetailsGrid from "./CustomerServiceDetailsGrid";
import DescriptionDialog from "../../provider/serviceDetails/DescriptionDialog";
import ReviewsSection from "../../provider/serviceDetails/ReviewsSection";
import MainLayout from "@/app/mainLayout";
import { useServiceDetails, useProviderServices } from "@/hooks/useServiceDetails";
import { useServiceReviews } from "@/hooks/useReviews";
import EmptyState from "@/components/common/EmptyState";
import { useTranslate } from "@/hooks/useTranslate";

const CustomerServiceDetails = () => {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";

    const reviewsPerPage = 5;
    const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);

    // Use TanStack Query hooks - prevents duplicate API calls
    const {
        data: service,
        isLoading: loading,
        error: serviceError,
    } = useServiceDetails(serviceId);

    // Fetch related services only if service has provider_id
    const {
        data: providerServices = [],
        isLoading: relatedServicesLoading,
    } = useProviderServices(service?.provider_id, 10, !!service?.provider_id);

    // Filter out current service from related services
    const relatedServices = useMemo(() => {
        return providerServices.filter((s) => s.service_id !== serviceId);
    }, [providerServices, serviceId]);

    const {
        data: reviewsData,
        isLoading: reviewsLoading,
        fetchNextPage,
        hasNextPage,
    } = useServiceReviews(serviceId, reviewsPerPage);

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
                    pt: 10,
                    pb: 4,
                }}
            >
                <Container maxWidth="xl">
                    <CustomerServiceBreadcrumb serviceName={service.service_name || ""} />

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr auto" },
                            gap: 4,
                            alignItems: "start",
                        }}
                    >
                        <Box sx={{ position: "sticky", top: 80 }}>
                            <ServiceImageCarousel images={images} serviceName={service.service_name || ""} />
                        </Box>

                        <Box>
                            <CustomerServiceHeader
                                price={service.price ? service.price / 100 : 0}
                                currency={service.currency || "AED"}
                                categoryName={service.category_name || ""}
                                onBookmark={() => {/* TODO: Implement */ }}
                                onShare={() => {/* TODO: Implement */ }}
                            />

                            <CustomerServiceInfo
                                serviceName={service.service_name || ""}
                                serviceDesc={service.service_desc || ""}
                                onContinueReading={() => setDescriptionDrawerOpen(true)}
                                showContinueReading={!!(service.service_desc && service.service_desc.split('\n').length > 10)}
                            />

                            <CustomerServiceActions
                                onAddToCart={() => {/* TODO: Implement */ }}
                                onBookNow={() => router.push(`/services/${serviceId}/book`)}
                            />

                            <CustomerServiceDetailsGrid serviceDuration={service.service_duration || 0} />

                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    }}
                                >
                                    {t("service_location")}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                    }}
                                >
                                    {service.service_provider_address || "123 Main Street, Al Satwa Dubai, United Arab Emirates"}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 4, mt: 4 }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 3,
                                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    }}
                                >
                                    Service provider Info.
                                </Typography>
                                <ProviderInfoCard
                                    providerId={service.provider_id || ""}
                                    providerName={service.provider_name || ""}
                                    providerImageUrl={service.provider_image_url || ""}
                                    isHotSeller={true}
                                />
                            </Box>

                            {relatedServices.length > 0 && (
                                <Box sx={{ mt: 4 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 3,
                                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                        }}
                                    >
                                        Other Services
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
                                                bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
                                                borderRadius: "4px",
                                            },
                                            "&::-webkit-scrollbar-thumb": {
                                                bgcolor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
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
                            )}

                            <ReviewsSection
                                reviews={reviews}
                                totalReviews={totalReviews}
                                avgRating={service.avg_service_rating || 0}
                                reviewsLoading={reviewsLoading}
                                onLoadMore={handleLoadMore}
                                showLoadMore={hasNextPage || false}
                            />
                        </Box>

                        {/* Right Column - Vertical Action Buttons (Synced with Provider) */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                            <IconButton
                                onClick={() => {/* TODO: Implement save/bookmark */ }}
                                sx={{
                                    bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.9)",
                                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    "&:hover": {
                                        bgcolor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 1)",
                                    },
                                    width: 44,
                                    height: 44,
                                }}
                            >
                                <Bookmark fontSize="small" />
                            </IconButton>
                            <IconButton
                                onClick={() => {/* TODO: Implement share */ }}
                                sx={{
                                    bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.9)",
                                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    "&:hover": {
                                        bgcolor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 1)",
                                    },
                                    width: 44,
                                    height: 44,
                                }}
                            >
                                <Share fontSize="small" />
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
       </MainLayout>
    );
};

export default CustomerServiceDetails;
