"use client";

import React from "react";
import { Box, Typography, useTheme, Avatar, Rating } from "@mui/material";
import { Star, Verified } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { motion } from "framer-motion";
import { useTranslate } from "@/hooks/useTranslate";

const MotionBox = motion(Box) as any;

const MOCK_REVIEWS = [
    {
        id: 1,
        name: "Aarav Sharma",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        rating: 5,
        date: "2 days ago",
        comment: "Excellent service! Very professional and punctual. Highly recommended.",
    },
    {
        id: 2,
        name: "Priya Patel",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        rating: 4.5,
        date: "1 week ago",
        comment: "Great work, but arrived slightly late. Overall very satisfied with the quality.",
    },
    {
        id: 3,
        name: "Rohan Gupta",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
        rating: 5,
        date: "2 weeks ago",
        comment: "The best experience I've had on this platform. Will definitely book again.",
    },
    {
        id: 4,
        name: "Sneha Singh",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d3",
        rating: 5,
        date: "3 weeks ago",
        comment: "Very polite and skilled professional. Solved my issue in no time.",
    },
    {
        id: 5,
        name: "Vikram Malhotra",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d5",
        rating: 4,
        date: "1 month ago",
        comment: "Good service, reasonable price. Keep it up!",
    },
];

const ProviderReviews: React.FC<{ providerName: string; hideTitle?: boolean }> = ({ providerName, hideTitle = false }) => {
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box sx={{ mt: hideTitle ? 0 : 4 }}>
            {!hideTitle && (
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
                    <Verified sx={{ color: COLORS.PRIMARY_BLUE }} />
                    {t("reviews" as any) + " of " + providerName || "Recent Reviews"}
                </Typography>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {MOCK_REVIEWS.map((review, index) => (
                    <MotionBox
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        sx={{
                            p: 2,
                            borderRadius: "16px",
                            bgcolor: isDark ? "rgba(255,255,255,0.03)" : COLORS.WHITE,
                            boxShadow: isDark
                                ? "0 4px 20px rgba(0,0,0,0.2)"
                                : "0 4px 20px rgba(0,0,0,0.05)",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                                }`,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                            <Avatar src={review.avatar} sx={{ width: 40, height: 40 }} />
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 700,
                                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    }}
                                >
                                    {review.name}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Rating value={review.rating} precision={0.5} size="small" readOnly />
                                    <Typography variant="caption" color="text.secondary">
                                        • {review.date}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                fontStyle: "italic",
                            }}
                        >
                            "{review.comment}"
                        </Typography>
                    </MotionBox>
                ))}
            </Box>
        </Box>
    );
};

export default ProviderReviews;
