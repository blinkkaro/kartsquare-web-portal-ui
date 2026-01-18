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
    Breadcrumbs,
    Link,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { Bookmark, Share, Star, NavigateNext, Edit, Delete } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import Nav from "../../../../components/common/Nav";
import ServiceImageCarousel from "../../../../components/ServiceImageCarousel";
import ProviderInfoCard from "../../../../components/ProviderInfoCard";
import ReviewCard from "../../../../components/ReviewCard";
import ServiceCard from "../../../../components/ServiceCard";
import { serviceDetailsService } from "../../../../services/serviceDetails/serviceDetailsService";
import { reviewService } from "../../../../services/reviews/reviewService";
import { ServiceDetails } from "../../../../services/serviceDetails/serviceDetailsInterface";
import { Service } from "../../../../services/serviceList/listInteraface";
import { Review } from "../../../../services/reviews/reviewInterface";
import { COLORS } from "../../../../constants/colors";
import AddServiceDrawer from "../../servicesList/AddServiceDrawer";
import { serviceListService } from "../../../../services/serviceList/serviceListService";

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
    const [totalReviews, setTotalReviews] = useState(0);
    const reviewsPerPage = 5;
    const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

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
                    1, // Always fetch from page 1
                    reviewPage * reviewsPerPage // Increase limit as we load more
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

    const handleEdit = () => {
        setEditDrawerOpen(true);
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await serviceListService.deleteService(serviceId);
            router.push('/spr/servicesList');
        } catch (error) {
            console.error("Failed to delete service:", error);
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    const handleEditSuccess = () => {
        // Refresh service details after edit
        const fetchServiceDetails = async () => {
            try {
                const data = await serviceDetailsService.getServiceById(serviceId);
                setService(data);
            } catch (error) {
                console.error("Failed to refresh service details:", error);
            }
        };
        fetchServiceDetails();
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
                            onClick={() => router.push("/spr/servicesList")}
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
                            My Services
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
                            alignItems: "start",
                        }}
                    >
                        {/* Left Column - Images Only */}
                        <Box sx={{ position: "sticky", top: 80 }}>
                            <ServiceImageCarousel images={images} serviceName={service.service_name} />
                        </Box>

                        {/* Right Column - All Content */}
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
                                        onClick={handleEdit}
                                        sx={{
                                            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                                            color: COLORS.PRIMARY_PURPLE,
                                        }}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setDeleteDialogOpen(true)}
                                        sx={{
                                            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                                            color: "error.main",
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {/* TODO: Implement share */ }}
                                        sx={{
                                            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
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
                                    mb: 1,
                                    lineHeight: 1.6,
                                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 10,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {service.service_desc || "No description available"}
                            </Typography>

                            {/* Continue Reading Link */}
                            {service.service_desc && service.service_desc.split('\n').length > 10 && (
                                <Button
                                    onClick={() => setDescriptionDrawerOpen(true)}
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
                            )}

                            {/* Service Status Toggle - Only for providers */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 1,
                                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    }}
                                >
                                    Service Status
                                </Typography>
                                <Chip
                                    label={service.status || "ACTIVE"}
                                    sx={{
                                        bgcolor: service.status === "ACTIVE" ? "success.main" : "warning.main",
                                        color: "white",
                                        fontWeight: 600,
                                    }}
                                />
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
                            <Box sx={{ mb: 3 }}>
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

                            {/* Provider Info */}
                            <ProviderInfoCard
                                providerId={service.provider_id}
                                providerName={service.provider_name}
                                providerImageUrl={service.provider_image_url}
                                isHotSeller={true}
                            />

                            {/* Related Services */}
                            {relatedServices.length > 0 && (
                                <Box sx={{ mt: 4 }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 2,
                                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                        }}
                                    >
                                        {service.provider_name}'s Services
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

                                        {/* Load More Button */}
                                        {reviews.length < totalReviews && (
                                            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleLoadMore}
                                                    disabled={reviewsLoading}
                                                    sx={{
                                                        borderRadius: "8px",
                                                        px: 4,
                                                        py: 1,
                                                        textTransform: "none",
                                                        borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
                                                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                                        "&:hover": {
                                                            borderColor: COLORS.PRIMARY_PURPLE,
                                                            bgcolor: "transparent",
                                                        },
                                                    }}
                                                >
                                                    {reviewsLoading ? "Loading..." : "Load More Reviews"}
                                                </Button>
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Description Drawer */}
            <Dialog
                open={descriptionDrawerOpen}
                onClose={() => setDescriptionDrawerOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        borderBottom: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                    }}
                >
                    Service Description
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: 1.8,
                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {service?.service_desc || "No description available"}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 2 }}>
                    <Button
                        onClick={() => setDescriptionDrawerOpen(false)}
                        variant="contained"
                        sx={{
                            bgcolor: COLORS.PRIMARY_PURPLE,
                            color: "white",
                            borderRadius: "8px",
                            px: 4,
                            textTransform: "none",
                            "&:hover": {
                                bgcolor: COLORS.PURPLE_HOVER,
                            },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Service Drawer */}
            <AddServiceDrawer
                open={editDrawerOpen}
                onClose={() => setEditDrawerOpen(false)}
                onSuccess={handleEditSuccess}
                editService={service}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => !deleting && setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        fontWeight: 700,
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                >
                    Delete Service?
                </DialogTitle>
                <DialogContent>
                    <Typography
                        sx={{
                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        }}
                    >
                        Are you sure you want to delete "{service?.service_name}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={deleting}
                        sx={{
                            textTransform: "none",
                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={deleting}
                        variant="contained"
                        color="error"
                        sx={{
                            textTransform: "none",
                            borderRadius: "8px",
                            px: 3,
                        }}
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ServiceDetailsPage;
