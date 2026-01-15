"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Chip,
    CircularProgress,
    useTheme,
    IconButton,
    Pagination,
    Breadcrumbs,
    Link,
} from "@mui/material";
import { Bookmark, Share, ShoppingCart, Star, NavigateNext } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import Nav from "../../../components/common/Nav";
import ServiceImageCarousel from "../../../components/ServiceImageCarousel";
import ProviderInfoCard from "../../../components/ProviderInfoCard";
import RelatedServices from "../../../components/RelatedServices";
import ReviewCard from "../../../components/ReviewCard";
import { serviceDetailsService } from "../../../services/serviceDetails/serviceDetailsService";
import { reviewService } from "../../../services/reviews/reviewService";
import { ServiceDetails } from "../../../services/serviceDetails/serviceDetailsInterface";
import { Service } from "../../../services/serviceList/listInteraface";
import { Review } from "../../../services/reviews/reviewInterface";
import { COLORS } from "../../../constants/colors";

const ServiceDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // State
    const [service, setService] = useState<ServiceDetails | null>(null);
    const [relatedServices, setRelatedServices] = useState<Service[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewPage, setReviewPage] = useState(1);
    const [totalReviewPages, setTotalReviewPages] = useState(1);
    const [totalReviews, setTotalReviews] = useState(0);
    const reviewsPerPage = 5;

    // Fetch service details
    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                setLoading(true);
                const data = await serviceDetailsService.getServiceById(serviceId);
                setService(data);

                // Fetch related services
                if (data.provider_id) {
                    const providerServices = await serviceDetailsService.getProviderServices(
                        data.provider_id,
                        10
                    );
                    // Filter out current service
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

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setReviewsLoading(true);
                const data = await reviewService.getReviews(
                    "SERVICE",
                    serviceId,
                    reviewPage,
                    reviewsPerPage
                );
                setReviews(data.reviews);
                setTotalReviewPages(data.meta.total_pages);
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

    const handleReviewPageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setReviewPage(value);
        // Scroll to reviews section
        document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
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
                    <Typography variant="h6">Service not found</Typography>
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
                    {/* Breadcrumb */}
                    <Breadcrumbs
                        separator={<NavigateNext fontSize="small" />}
                        sx={{
                            mb: 3,
                            "& .MuiBreadcrumbs-separator": {
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                            },
                        }}
                    >
                        <Link
                            component="button"
                            onClick={() => router.push("/")}
                            sx={{
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                textDecoration: "none",
                                fontSize: "0.875rem",
                                "&:hover": {
                                    textDecoration: "underline",
                                    color: COLORS.PRIMARY_PURPLE,
                                },
                            }}
                        >
                            Home
                        </Link>
                        <Link
                            component="button"
                            onClick={() => router.push("/cus/servicesList")}
                            sx={{
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                textDecoration: "none",
                                fontSize: "0.875rem",
                                "&:hover": {
                                    textDecoration: "underline",
                                    color: COLORS.PRIMARY_PURPLE,
                                },
                            }}
                        >
                            Services
                        </Link>
                        <Typography
                            sx={{
                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                fontSize: "0.875rem",
                                fontWeight: 500,
                            }}
                        >
                            {service?.service_name || "Service Details"}
                        </Typography>
                    </Breadcrumbs>

                    {/* Main Content Grid */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            gap: 4,
                        }}
                    >
                        {/* Left Column - Images */}
                        <Box>
                            <ServiceImageCarousel images={images} serviceName={service.service_name} />
                        </Box>

                        {/* Right Column - Service Info */}
                        <Box>
                            {/* Price and Category */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                        }}
                                    >
                                        {service.currency} {service.price?.toFixed(2) || "0.00"}
                                    </Typography>
                                    <Chip
                                        label={service.category_name}
                                        size="small"
                                        sx={{
                                            bgcolor: isDark
                                                ? COLORS.BACKGROUND.SECONDARY_DARK
                                                : COLORS.BACKGROUND.SECONDARY_LIGHT,
                                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <IconButton
                                        sx={{
                                            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
                                                }`,
                                        }}
                                    >
                                        <Bookmark />
                                    </IconButton>
                                    <IconButton
                                        sx={{
                                            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
                                                }`,
                                        }}
                                    >
                                        <Share />
                                    </IconButton>
                                </Box>
                            </Box>

                            {/* Service Title */}
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                }}
                            >
                                {service.service_name}
                            </Typography>

                            {/* Description */}
                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 3,
                                    lineHeight: 1.6,
                                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                }}
                            >
                                {service.service_desc || "No description available"}
                            </Typography>

                            {/* Continue Reading Link */}
                            <Button
                                sx={{
                                    textTransform: "none",
                                    color: COLORS.PRIMARY_PURPLE,
                                    p: 0,
                                    mb: 3,
                                    "&:hover": {
                                        bgcolor: "transparent",
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                Continue Reading
                            </Button>

                            {/* Action Buttons */}
                            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<ShoppingCart />}
                                    sx={{
                                        bgcolor: isDark ? "#2D2D2D" : "#1E1E1E",
                                        color: "white",
                                        borderRadius: "12px",
                                        px: 3,
                                        py: 1.5,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        "&:hover": {
                                            bgcolor: isDark ? "#3D3D3D" : "#2E2E2E",
                                        },
                                    }}
                                >
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        bgcolor: COLORS.PRIMARY_PURPLE,
                                        color: "white",
                                        borderRadius: "12px",
                                        px: 3,
                                        py: 1.5,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        "&:hover": {
                                            bgcolor: COLORS.PURPLE_HOVER,
                                        },
                                    }}
                                >
                                    Book Now
                                </Button>
                            </Box>

                            {/* Service Details Grid */}
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        bgcolor: isDark
                                            ? COLORS.BACKGROUND.PAPER_DARK
                                            : COLORS.BACKGROUND.PAPER_LIGHT,
                                        p: 2,
                                        borderRadius: "12px",
                                        border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
                                            }`,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                        }}
                                    >
                                        Duration
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 600,
                                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                        }}
                                    >
                                        {service.service_duration ? `${service.service_duration} min` : "2h 30m"}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        bgcolor: isDark
                                            ? COLORS.BACKGROUND.PAPER_DARK
                                            : COLORS.BACKGROUND.PAPER_LIGHT,
                                        p: 2,
                                        borderRadius: "12px",
                                        border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
                                            }`,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                        }}
                                    >
                                        Payment
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 600,
                                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                        }}
                                    >
                                        20% Advance
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        bgcolor: "#E8F5FF",
                                        p: 2,
                                        borderRadius: "12px",
                                        border: "1px solid #B3E0FF",
                                    }}
                                >
                                    <Typography variant="caption" sx={{ color: "#0066CC" }}>
                                        Buy to get reward
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: "#0066CC" }}>
                                        100 OC Points
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Service Location */}
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    }}
                                >
                                    Service location
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
                        </Box>
                    </Box>

                    {/* Provider Info */}
                    <ProviderInfoCard
                        providerId={service.provider_id}
                        providerName={service.provider_name}
                        providerImageUrl={service.provider_image_url}
                        isHotSeller={true}
                    />

                    {/* Related Services */}
                    {relatedServices.length > 0 && (
                        <RelatedServices
                            services={relatedServices}
                            title={`${service.provider_name}'s Services`}
                        />
                    )}

                    {/* Reviews Section */}
                    <Box id="reviews-section" sx={{ mt: 4 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    }}
                                >
                                    {totalReviews} Reviews
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Star sx={{ color: "#FFC107", fontSize: 20 }} />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 600,
                                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                        }}
                                    >
                                        {service.avg_service_rating ? Number(service.avg_service_rating).toFixed(1) : "0.0"}
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                sx={{
                                    textTransform: "none",
                                    color: COLORS.PRIMARY_PURPLE,
                                    fontWeight: 600,
                                }}
                            >
                                SEE ALL
                            </Button>
                        </Box>

                        {/* Reviews List */}
                        {reviewsLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : reviews.length === 0 ? (
                            <Typography
                                variant="body1"
                                sx={{
                                    textAlign: "center",
                                    py: 4,
                                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                }}
                            >
                                No reviews yet
                            </Typography>
                        ) : (
                            <>
                                {reviews.map((review) => (
                                    <ReviewCard key={review.review_question_id} review={review} />
                                ))}

                                {/* Pagination */}
                                {totalReviewPages > 1 && (
                                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                        <Pagination
                                            count={totalReviewPages}
                                            page={reviewPage}
                                            onChange={handleReviewPageChange}
                                            color="primary"
                                            sx={{
                                                "& .MuiPaginationItem-root": {
                                                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                                },
                                                "& .Mui-selected": {
                                                    bgcolor: `${COLORS.PRIMARY_PURPLE} !important`,
                                                    color: "white",
                                                },
                                            }}
                                        />
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default ServiceDetailsPage;
