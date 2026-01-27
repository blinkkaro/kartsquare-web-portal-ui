"use client";

import React from "react";
import { Box, Typography, useTheme, Card, CardMedia, CardContent, Chip } from "@mui/material";
import { Star } from "@mui/icons-material";
import { Service } from "@/services/serviceList/listInteraface";
import { COLORS } from "@/constants/colors";
import { motion } from "framer-motion";
import { useTranslate } from "@/hooks/useTranslate";

interface RecommendedServicesProps {
    services: Service[];
}

const MotionBox = motion(Box) as any;

const RecommendedServices: React.FC<RecommendedServicesProps> = ({ services }) => {
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";

    // Mock data logic: Select top 3 services and assign fake high ratings if needed
    const recommendedServices = React.useMemo(() => {
        // If we have services, take up to 3
        return services.slice(0, 3).map((service, index) => ({
            ...service,
            // Mock rating between 4.5 and 5.0 for premium feel
            mockRating: (4.5 + Math.random() * 0.5).toFixed(1),
            mockReviewCount: Math.floor(10 + Math.random() * 50),
        }));
    }, [services]);

    if (recommendedServices.length === 0) return null;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Star sx={{ color: COLORS.SECONDARY_ORANGE }} />
                {t("topRatedServices") || "Top Rated Services"}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {recommendedServices.map((service, index) => (
                    <MotionBox
                        key={service.service_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        sx={{
                            position: "relative",
                            cursor: "pointer",
                            borderRadius: "16px",
                            overflow: "hidden",
                            bgcolor: isDark ? "rgba(255,255,255,0.03)" : COLORS.WHITE,
                            boxShadow: isDark
                                ? "0 4px 20px rgba(0,0,0,0.2)"
                                : "0 4px 20px rgba(0,0,0,0.05)",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                                }`,
                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: isDark
                                    ? "0 8px 30px rgba(94, 24, 233, 0.15)"
                                    : "0 8px 30px rgba(94, 24, 233, 0.1)",
                            },
                        }}
                    >
                        <Box sx={{ display: "flex", p: 1.5 }}>
                            {/* Image */}
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    flexShrink: 0,
                                }}
                            >
                                <img
                                    src={
                                        service.image_urls?.[0] ||
                                        "https://via.placeholder.com/150?text=Service"
                                    }
                                    alt={service.service_name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </Box>

                            {/* Content */}
                            <Box sx={{ ml: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontWeight: 700,
                                            lineHeight: 1.3,
                                            mb: 0.5,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                        }}
                                    >
                                        {service.service_name}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                                    <Star sx={{ fontSize: 14, color: COLORS.SECONDARY_ORANGE }} />
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                                        {service.mockRating}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                        ({service.mockReviewCount})
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 800,
                                        color: COLORS.PRIMARY_PURPLE,
                                    }}
                                >
                                    {service.price ? `${service.currency || "INR"} ${service.price}` : "Contact for Price"}
                                </Typography>
                            </Box>
                        </Box>
                    </MotionBox>
                ))}
            </Box>
        </Box>
    );
};

export default RecommendedServices;
