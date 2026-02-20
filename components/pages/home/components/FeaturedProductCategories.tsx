"use client";
import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { COLORS } from "@/constants/colors";

// Mock Data for Product Categories
const PRODUCT_CATEGORIES = [
    { id: "1", name: "Industrial Goods", count: "230", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80" },
    { id: "2", name: "Safety Equipment", count: "120", image: "https://images.unsplash.com/photo-1617904368688-297eba207865?auto=format&fit=crop&w=300&q=80" },
    { id: "3", name: "Electronics", count: "450", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=300&q=80" },
    { id: "4", name: "Construction", count: "89", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=300&q=80" },
    { id: "5", name: "Chemicals", count: "56", image: "https://images.unsplash.com/photo-1605557202138-095a5fcc13bb?auto=format&fit=crop&w=300&q=80" },
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
                        <Box
                            sx={{
                                height: 100,
                                backgroundImage: `url(${category.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap>
                                {category.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {category.count} Items
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default FeaturedProductCategories;
