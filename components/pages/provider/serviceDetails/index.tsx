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
import { Edit, Delete, Share } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import ServiceImageCarousel from "../../../ServiceImageCarousel";
import { serviceDetailsService } from "../../../../services/serviceDetails/serviceDetailsService";
import { reviewService } from "../../../../services/reviews/reviewService";
import { ServiceDetails } from "../../../../services/serviceDetails/serviceDetailsInterface";
import { Service, ServiceStatus } from "../../../../services/serviceList/listInteraface";
import { Review } from "../../../../services/reviews/reviewInterface";
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
import AdvancePayInfo from "./AdvancePayInfo";
import MainLayout from "@/app/mainLayout";

const ProviderServiceDetails = () => {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";

    // State
    const [service, setService] = useState<ServiceDetails | null>(null);
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
                    1,
                    reviewPage * reviewsPerPage,
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
                                lg: "1fr 1fr auto" 
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
                            <ServiceImageCarousel images={images} serviceName={service.service_name} />
                        </Box>

                        {/* Middle Column - All Content */}
                        <Box sx={{ order: { xs: 2, md: 2 } }}>
                            {/* Price and Category */}
                            <ServiceDetailsHeader
                                price={service.price ? service.price / 100 : 0}
                                currency={service.currency || "INR"}
                                categoryName={service.category_name || ""}
                            />

                            {/* Service Info */}
                            <ServiceDetailsInfo
                                serviceName={service.service_name || ""}
                                serviceDesc={service.service_desc || ""}
                                status={service.status || "ACTIVE"}
                                onContinueReading={() => setDescriptionDrawerOpen(true)}
                                showContinueReading={!!(service.service_desc && service.service_desc.length > 50)}
                            />

                            {/* Service Details Grid */}
                            <ServiceDetailsGrid
                                serviceDuration={service.service_duration || 150}
                                serviceStatus={service.status === ServiceStatus.APPROVED}
                            />

                            {/* Service Location */}
                            <ServiceLocation address={service.service_provider_address || ""} />

                            {/* Reviews Section */}
                            <ReviewsSection
                                reviews={reviews}
                                totalReviews={totalReviews}
                                avgRating={service.avg_service_rating}
                                reviewsLoading={reviewsLoading}
                                onLoadMore={handleLoadMore}
                                showLoadMore={reviews.length < totalReviews}
                            />
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
                                    bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.9)",
                                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    "&:hover": {
                                        bgcolor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 1)",
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
                                    bgcolor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.9)",
                                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`,
                                    color: "error.main",
                                    "&:hover": {
                                        bgcolor: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 1)",
                                    },
                                    width: { xs: 40, sm: 44 },
                                    height: { xs: 40, sm: 44 },
                                }}
                            >
                                <Delete fontSize="small" />
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
       </MainLayout>
    );
};

export default ProviderServiceDetails;
