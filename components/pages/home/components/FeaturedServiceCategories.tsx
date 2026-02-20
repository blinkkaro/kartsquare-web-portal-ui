"use client";
import React from "react";
import { Box, Typography, Card, CardContent, CircularProgress, Button } from "@mui/material";
import { useCategories } from "@/hooks/useCategories";
import { COLORS } from "@/constants/colors";

const FeaturedServiceCategories = () => {
    const { data: categories, isLoading } = useCategories();

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (!categories || categories.length === 0) {
        return null;
    }

    // Display top 6 categories or all if less
    const displayedCategories = categories.slice(0, 6);

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    Featured Categories
                </Typography>
                <Button
                    sx={{
                        color: '#6C5DD3', // Use specific color or from constant if available 
                        textTransform: 'none',
                        backgroundColor: '#6C5DD31A', // Light purple background
                        borderRadius: '20px',
                        px: 2,
                        '&:hover': {
                            backgroundColor: '#6C5DD333',
                        }
                    }}
                >
                    See All
                </Button>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 2,
                    pb: 1,
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                }}
            >
                {displayedCategories.map((category) => (
                    <Card
                        key={category.id}
                        sx={{
                            minWidth: 160,
                            width: 160,
                            borderRadius: 3,
                            boxShadow: "none",
                            border: "1px solid",
                            borderColor: "divider",
                            flexShrink: 0,
                            cursor: "pointer",
                            transition: "transform 0.2s",
                            "&:hover": {
                                transform: "translateY(-4px)",
                            },
                        }}
                    >
                        {/* Placeholder Image for Category - Using a generic colored box if no image provided in API */}
                        <Box
                            sx={{
                                height: 100,
                                bgcolor: "action.hover",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                // Note: If category has image_url, use it here. 
                                // Assuming category object doesn't have image_url based on interface inspection, using placeholder.
                            }}
                        >
                            {/* <Typography variant="h3" color="text.disabled">
                                {category.name.charAt(0)}
                            </Typography> */}
                            <img
                                className="object-contain w-full h-full"
                                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200"
                                alt={category.name}
                            />
                        </Box>
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap>
                                {category.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                10+ Services
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default FeaturedServiceCategories;
