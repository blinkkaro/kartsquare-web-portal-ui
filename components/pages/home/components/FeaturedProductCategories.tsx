"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { COLORS } from "@/constants/colors";

// Mock Data for Product Categories
const PRODUCT_CATEGORIES = [
    { id: "1", name: "Industrial Goods", count: "230", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80" },
    { id: "2", name: "Safety Equipment", count: "120", image: "https://images.unsplash.com/photo-1617904368688-297eba207865?auto=format&fit=crop&w=400&q=80" },
    { id: "3", name: "Electronics", count: "450", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80" },
    { id: "4", name: "Construction", count: "89", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80" },
    { id: "5", name: "Chemicals", count: "56", image: "https://images.unsplash.com/photo-1605557202138-095a5fcc13bb?auto=format&fit=crop&w=400&q=80" },
];

const FeaturedProductCategories = () => {
    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    Discover Products
                </Typography>
                <Button
                    sx={{
                        color: 'white',
                        textTransform: 'none',
                        backgroundColor: '#6C5DD3',
                        borderRadius: '20px',
                        px: 2,
                        fontWeight: 600,
                        '&:hover': {
                            backgroundColor: '#5b4dc7',
                        }
                    }}
                >
                    View All
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
                {PRODUCT_CATEGORIES.map((category) => (
                    <Box
                        key={category.id}
                        sx={{
                            minWidth: 180,
                            width: 180,
                            height: 240, // Taller image-focused product cards
                            borderRadius: 4,
                            flexShrink: 0,
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "flex-end",
                            "&:hover .bg-image": {
                                transform: "scale(1.1)",
                            },
                            "&:hover .content-box": {
                                transform: "translateY(-4px)",
                            }
                        }}
                    >
                        {/* Full Background Image */}
                        <Box
                            className="bg-image"
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `url(${category.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: "70%",
                                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                                }
                            }}
                        />

                        {/* Glassmorphic Content overlay */}
                        <Box
                            className="content-box"
                            sx={{
                                position: "relative",
                                width: "100%",
                                p: 1.5,
                                zIndex: 1,
                                transition: "transform 0.3s ease",
                            }}
                        >
                            <Box
                                sx={{
                                    background: "rgba(255,255,255,0.15)",
                                    backdropFilter: "blur(12px)",
                                    borderRadius: 3,
                                    p: 1.5,
                                    border: "1px solid rgba(255,255,255,0.2)"
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight="bold" color="white" noWrap sx={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
                                    {category.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                                    {category.count} Items
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default FeaturedProductCategories;
