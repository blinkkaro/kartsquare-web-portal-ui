"use client";
import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { useCategories } from "@/hooks/useCategories";
import {
    ConstructionRounded,
    CleaningServicesRounded,
    PlumbingRounded,
    ArrowForwardIosRounded
} from "@mui/icons-material";
import { keyframes } from "@mui/system";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

// Mock Data for Product Categories
const PRODUCT_CATEGORIES = [
    { id: "p1", name: "Industrial Goods", count: "230", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80" },
    { id: "p2", name: "Safety Equipment", count: "120", image: "https://images.unsplash.com/photo-1617904368688-297eba207865?auto=format&fit=crop&w=400&q=80" },
    { id: "p3", name: "Electronics", count: "450", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80" },
];

const SERVICE_THEMES = [
    { bg: "#F0F4F8", iconBg: "#D9E2EC", color: "#102A43", icon: <ConstructionRounded sx={{ color: "#334E68" }} /> },
    { bg: "#E3F8FA", iconBg: "#BEE3F8", color: "#234E52", icon: <CleaningServicesRounded sx={{ color: "#285E61" }} /> },
    { bg: "#FCE8F3", iconBg: "#FBB6CE", color: "#702459", icon: <PlumbingRounded sx={{ color: "#97266D" }} /> },
];

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
`;

const CombinedFeaturedSection = () => {
    const { data: categories, isLoading } = useCategories();

    const scrollToPosts = () => {
        const postsSection = document.getElementById("posts-feed-section");
        if (postsSection) {
            postsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <Box sx={{ mt: 5, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 3, px: 1 }}>
                <Box>

                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em", color: "text.primary" }}>
                        Explore Services & Products
                    </Typography>
                </Box>
                <Button
                    endIcon={<ArrowForwardIosRounded sx={{ fontSize: '10px !important' }} />}
                    sx={{
                        color: 'text.primary',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        p: 0,
                        '&:hover': {
                            backgroundColor: 'transparent',
                            color: '#6C5DD3',
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
                    gap: 2.5,
                    pb: 2,
                    px: 1, // Add slight padding so shadows don't clip
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                }}
            >
                {/* Services Loading State */}
                {isLoading ? (
                    [...Array(3)].map((_, i) => (
                        <Box key={`loader-${i}`} sx={{ minWidth: 150, height: 190, borderRadius: 4, bgcolor: 'action.hover', animation: 'pulse 1.5s infinite' }} />
                    ))
                ) : (
                    /* Top 3 Service Categories - Minimalist Bento Design */
                    categories?.slice(0, 3).map((category, index) => {
                        const theme = SERVICE_THEMES[index % SERVICE_THEMES.length];
                        return (
                            <Box
                                key={`service-${category.id}`}
                                sx={{
                                    minWidth: 150,
                                    width: 150,
                                    height: 190,
                                    borderRadius: 4,
                                    bgcolor: theme.bg,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    p: 2.5,
                                    cursor: "pointer",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    border: "1px solid rgba(0,0,0,0.02)",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "14px",
                                        bgcolor: theme.iconBg,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {theme.icon}
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.color, lineHeight: 1.3, mb: 0.5 }}>
                                        {category.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: theme.color, opacity: 0.7, fontWeight: 600, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 0.5 }}>
                                        Service
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })
                )}

                {/* Top 3 Product Categories - Elegant Image Cards */}
                {PRODUCT_CATEGORIES.map((category) => (
                    <Box
                        key={`product-${category.id}`}
                        sx={{
                            minWidth: 150,
                            width: 150,
                            height: 190,
                            borderRadius: 4,
                            position: "relative",
                            overflow: "hidden",
                            cursor: "pointer",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            "&:hover .bg-image": {
                                transform: "scale(1.05)",
                            },
                        }}
                    >
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
                                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                        />

                        {/* Elegant subtle gradient just enough for text readability */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "60%",
                                background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
                                pointerEvents: "none"
                            }}
                        />

                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 12,
                                left: 12,
                                right: 12,
                                display: "flex",
                                flexDirection: "column",
                                zIndex: 1
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "white", lineHeight: 1.2, mb: 0.5, textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                                {category.name}
                            </Typography>
                            <Box
                                sx={{
                                    alignSelf: 'flex-start',
                                    bgcolor: "rgba(255,255,255,0.2)",
                                    backdropFilter: "blur(8px)",
                                    px: 1,
                                    py: 0.3,
                                    borderRadius: "4px",
                                    border: "1px solid rgba(255,255,255,0.1)"
                                }}
                            >
                                <Typography variant="caption" sx={{ color: "white", fontWeight: 600, fontSize: "0.65rem" }}>
                                    {category.count} ITEMS
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Micro-interaction Scroll Indicator */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
                <Button
                    onClick={scrollToPosts}
                    disableRipple
                    sx={{
                        color: 'text.secondary',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        opacity: 0.7,
                        transition: 'opacity 0.2s',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            opacity: 1,
                            color: '#6C5DD3'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ letterSpacing: 0.5 }}>Explore Feed</Typography>
                        <KeyboardDoubleArrowDownIcon sx={{ fontSize: 18, animation: `${bounce} 2.5s infinite ease-in-out` }} />
                    </Box>
                </Button>
            </Box>
        </Box>
    );
};

export default CombinedFeaturedSection;
