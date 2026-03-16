"use client";
import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { useCategories } from "@/hooks/useCategories";
import { COLORS } from "@/constants/colors";
import {
    Construction,
    CleaningServices,
    Plumbing,
    ElectricCar,
    DesignServices,
    Build,
    LocalShipping,
    SupportAgent,
    AutoAwesome,
} from "@mui/icons-material";

const GRADIENTS = [
    "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
];

const ICONS = [
    <Construction sx={{ color: "white", fontSize: 28 }} key="1" />,
    <CleaningServices sx={{ color: "white", fontSize: 28 }} key="2" />,
    <Plumbing sx={{ color: "white", fontSize: 28 }} key="3" />,
    <ElectricCar sx={{ color: "white", fontSize: 28 }} key="4" />,
    <DesignServices sx={{ color: "white", fontSize: 28 }} key="5" />,
    <Build sx={{ color: "white", fontSize: 28 }} key="6" />,
    <LocalShipping sx={{ color: "white", fontSize: 28 }} key="7" />,
    <SupportAgent sx={{ color: "white", fontSize: 28 }} key="8" />,
    <AutoAwesome sx={{ color: "white", fontSize: 28 }} key="9" />
];

const FeaturedServiceCategories = () => {
    const { data: categories, isLoading } = useCategories();

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <LogoLoader size={24} />
            </Box>
        );
    }

    if (!categories || categories.length === 0) {
        return null;
    }

    const displayedCategories = categories.slice(0, 8); // Display top 8

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    Services You Need
                </Typography>
                <Button
                    sx={{
                        color: '#6C5DD3',
                        textTransform: 'none',
                        backgroundColor: '#6C5DD31A',
                        borderRadius: '20px',
                        px: 2,
                        fontWeight: 600,
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
                {displayedCategories.map((category, index) => (
                    <Box
                        key={category.id}
                        sx={{
                            minWidth: 140,
                            width: 140,
                            height: 140,
                            borderRadius: 4,
                            background: GRADIENTS[index % GRADIENTS.length],
                            flexShrink: 0,
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            p: 2,
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                            "&:hover": {
                                transform: "translateY(-6px)",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            },
                        }}
                    >
                        {/* Decorative circle for depth */}
                        <Box
                            sx={{
                                position: 'absolute',
                                right: -20,
                                top: -20,
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.15)'
                            }}
                        />

                        <Box
                            sx={{
                                background: "rgba(255,255,255,0.25)",
                                backdropFilter: "blur(8px)",
                                borderRadius: 3,
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 1
                            }}
                        >
                            {ICONS[index % ICONS.length]}
                        </Box>

                        <Box sx={{ zIndex: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold" color="white" sx={{ textShadow: "0 1px 3px rgba(0,0,0,0.2)", lineHeight: 1.2 }}>
                                {category.name}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default FeaturedServiceCategories;
