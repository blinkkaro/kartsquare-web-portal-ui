"use client";
import React from "react";
import { Box, Typography, Button, InputBase, useTheme, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { COLORS } from "@/constants/colors";

const HomeBanner = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: "100%",
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "#1a1a1a", // Fallback color
                color: "white",
                minHeight: { xs: 300, md: 350 },
                display: "flex",
                alignItems: "center",
            }}
        >
            {/* Background Image / Gradient */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1567&q=80')`, // Placeholder premium office/business image
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)",
                    },
                }}
            />

            <Grid container sx={{ position: "relative", zIndex: 1, p: { xs: 5, md: 8 } }}>
                <Grid item xs={12} md={10}>
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                            mb: 1,
                            fontSize: { xs: "2rem", md: "3rem" },
                            lineHeight: 1.2,
                        }}
                    >
                        Super Sale
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 4,
                            opacity: 0.9,
                            fontWeight: 400,
                            maxWidth: "800px",
                        }}
                    >
                        Find out your ideal sound predicts...
                    </Typography>

                    {/* AI Search Bar */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "white",
                            borderRadius: "12px",
                            p: "8px 16px",
                            maxWidth: "800px",
                            boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
                        }}
                    >
                        <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                        <InputBase
                            placeholder="Search for services, products..."
                            sx={{ flex: 1, ml: 1, fontSize: "1rem" }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<AutoAwesomeIcon />}
                            sx={{
                                borderRadius: "8px",
                                background: "linear-gradient(90deg, #6C5DD3 0%, #4D3CC1 100%)",
                                textTransform: "none",
                                boxShadow: "none",
                                px: 3,
                            }}
                        >
                            AI Search
                        </Button>
                    </Box>

                    {/* Category/Filter Tags (Optional based on screenshot) */}
                    <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                        {["Loop All", "Lone Stovr", "Products", "Button"].map((tag, index) => (
                            <Box
                                key={index}
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.15)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: "8px",
                                    px: 2,
                                    py: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {tag}
                            </Box>
                        ))}
                    </Box>

                </Grid>
            </Grid>
        </Box>
    );
};

export default HomeBanner;
