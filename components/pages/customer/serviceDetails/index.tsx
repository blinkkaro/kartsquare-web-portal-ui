"use client";
import React, { useState, useEffect } from "react";
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
import Nav from "../../../common/Nav";
import ServiceImageCarousel from "../../../ServiceImageCarousel";
import ProviderInfoCard from "../../../ProviderInfoCard";
import ReviewCard from "../../../ReviewCard";
import ServiceCard from "../../../ServiceCard";
import { serviceDetailsService } from "../../../../services/serviceDetails/serviceDetailsService";
import { reviewService } from "../../../../services/reviews/reviewService";
import { ServiceDetails } from "../../../../services/serviceDetails/serviceDetailsInterface";
import { Service } from "../../../../services/serviceList/listInteraface";
import { Review } from "../../../../services/reviews/reviewInterface";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";
import CustomerServiceBreadcrumb from "./CustomerServiceBreadcrumb";
import CustomerServiceHeader from "./CustomerServiceHeader";
import CustomerServiceInfo from "./CustomerServiceInfo";
import CustomerServiceActions from "./CustomerServiceActions";
import CustomerServiceDetailsGrid from "./CustomerServiceDetailsGrid";
import DescriptionDialog from "../../provider/serviceDetails/DescriptionDialog";
import ReviewsSection from "../../provider/serviceDetails/ReviewsSection";

const CustomerServiceDetails = () => {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [service, setService] = useState<ServiceDetails | null>(null);
    const [relatedServices, setRelatedServices] = useState<Service[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewPage, setReviewPage] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const reviewsPerPage = 5;
    const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                setLoading(true);
                const data = await serviceDetailsService.getServiceById(serviceId);
                setService(data);

                if (data.provider_id) {
                    const providerServices = await serviceDetailsService.getProviderServices(
                        data.provider_id,
                        10
                    );
                    setRelatedServices(providerServices.filter((s) => s.service_id !== serviceId));
                }
            } catch (error) {
                console.error("Failed to fetch service details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (serviceId) {
            fetchServiceDetails();
        }
    }, [serviceId]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setReviewsLoading(true);
                const data = await reviewService.getReviews(
                    "SERVICE",
                    serviceId,
                    1,
                    reviewPage * reviewsPerPage
                );
                setReviews(data.reviews);
                setTotalReviews(data.meta.total);
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
                setReviews([]);
            } finally {
                setReviewsLoading(false);
            }
        };

        if (serviceId) {
            fetchReviews();
        }
    }, [serviceId, reviewPage]);

    const handleLoadMore = () => {
        setReviewPage((prev) => prev + 1);
    };

    if (loading) {
        return (
            <>
                <Nav />
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
            </>
        );
    }

    if (!service) {
        return (
            <>
                <Nav />
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
                    <Typography variant="h6">{english.service_not_found}</Typography>
                </Box>
            </>
        );
    }

    const images =
        service.image_urls && service.image_urls.length > 0
            ? service.image_urls
            : [
                "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            ];

    return (
        <>
            <Nav />
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
                                    {english.service_location}
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
                                showLoadMore={reviews.length < totalReviews}
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
        </>
    );
};

export default CustomerServiceDetails;
