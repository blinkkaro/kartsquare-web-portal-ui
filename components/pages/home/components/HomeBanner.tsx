"use client";
import React, { useState } from "react";
import { Box, Typography, Button, InputBase, useTheme, Grid, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";

const HomeBanner = () => {
    const theme = useTheme();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/store?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "#1a1a1a",
                color: "white",
                minHeight: { xs: 350, md: 450 }, // Increased height as per design
                display: "flex",
                alignItems: "center",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
            }}
        >
            {/* Background Image */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000')`, // More modern office/team image
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)", // Stronger gradient for text readability
                    },
                }}
            />

            <Grid container sx={{ position: "relative", zIndex: 1, p: { xs: 4, md: 8 } }}>
                <Grid size={{ xs: 12, md: 8, lg: 7 }}>
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                        sx={{
                            mb: 2,
                            fontSize: { xs: "2.5rem", md: "3.5rem" },
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                        }}
                    >
                        Super Sale
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 5,
                            opacity: 0.9,
                            fontWeight: 400,
                            maxWidth: "600px",
                            lineHeight: 1.5,
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                        }}
                    >
                        Find out your ideal sound predicts...
                    </Typography>

                    {/* AI Search Bar */}
                    <Paper
                        elevation={4}
                        component="div"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "white",
                            borderRadius: "50px", // Pill shape
                            p: "8px",
                            pl: 3,
                            width: "100%",
                            maxWidth: "600px",
                            boxShadow: "0px 8px 25px rgba(0,0,0,0.2)",
                            transition: "transform 0.2s",
                            "&:focus-within": {
                                transform: "scale(1.01)",
                                boxShadow: "0px 12px 30px rgba(0,0,0,0.3)"
                            }
                        }}
                    >
                        <SearchIcon sx={{ color: "text.secondary", fontSize: 28, mr: 1.5 }} />
                        <InputBase
                            placeholder="Search for services, products..."
                            sx={{
                                flex: 1,
                                fontSize: "1.1rem",
                                color: "text.primary",
                                "& input::placeholder": {
                                    opacity: 0.7
                                }
                            }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <Button
                            variant="contained"
                            startIcon={<AutoAwesomeIcon />}
                            onClick={handleSearch}
                            sx={{
                                borderRadius: "30px", // Inner pill
                                background: "linear-gradient(135deg, #6C5DD3 0%, #4D3CC1 100%)",
                                textTransform: "none",
                                boxShadow: "0 4px 15px rgba(108, 93, 211, 0.4)",
                                px: 4,
                                py: 1.5,
                                fontSize: "1rem",
                                fontWeight: 600,
                                minWidth: "140px",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #7A6BE0 0%, #5E4DD8 100%)",
                                    boxShadow: "0 6px 20px rgba(108, 93, 211, 0.6)",
                                }
                            }}
                        >
                            AI Search
                        </Button>
                    </Paper>

                    {/* Category/Filter Tags */}
                    <Box sx={{ mt: 4, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
                        {/* <Typography variant="body2" sx={{ opacity: 0.8, mr: 1 }}>Popular:</Typography> */}
                        {["Loop All", "Lone Stovr", "Products", "Button"].map((tag, index) => (
                            <Box
                                key={index}
                                onClick={() => {
                                    setSearchQuery(tag);
                                    // Optional: specific tag behavior
                                }}
                                sx={{
                                    bgcolor: "rgba(30,30,30,0.7)", // Dark semi-transparent
                                    backdropFilter: "blur(12px)",
                                    borderRadius: "20px",
                                    px: 2.5,
                                    py: 1,
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    color: "rgba(255,255,255,0.9)",
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: "rgba(50,50,50,0.8)",
                                        transform: "translateY(-2px)",
                                        border: '1px solid rgba(255,255,255,0.3)',
                                    },
                                    '&:active': {
                                        transform: "translateY(0)",
                                    }
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
