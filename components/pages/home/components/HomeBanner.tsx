"use client";
import React, { useState } from "react";
import { Box, Typography, Button, InputBase, useTheme, Grid, Paper, AvatarGroup, Avatar, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";
import { useTranslationContext } from "@/features/i18n/TranslationContext";

const HomeBanner = () => {
    const theme = useTheme();
    const { t } = useTranslationContext();
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
                minHeight: { xs: 260, md: 320 }, // Further reduced height
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

            <Grid container sx={{ position: "relative", zIndex: 1, p: { xs: 3, md: 4 } }}>
                <Grid size={{ xs: 12, md: 8, lg: 12 }}>
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                        sx={{
                            mb: 1.5,
                            fontSize: { xs: "1.4rem", md: "2rem" },
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                            textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                        }}
                    >
                        {t("home_banner_title")}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2.5 }}>
                        <AvatarGroup max={4} sx={{
                            '& .MuiAvatar-root': {
                                width: 28, height: 28, fontSize: '0.8rem',
                                border: '2px solid rgba(255,255,255,0.8)'
                            }
                        }}>
                            <Avatar alt="User 1" src="https://mui.com/static/images/avatar/1.jpg" />
                            <Avatar alt="User 2" src="https://mui.com/static/images/avatar/2.jpg" />
                            <Avatar alt="User 3" src="https://mui.com/static/images/avatar/3.jpg" />
                            <Avatar alt="User 4" src="https://mui.com/static/images/avatar/4.jpg" />
                            <Avatar alt="User 5" src="https://mui.com/static/images/avatar/5.jpg" />
                        </AvatarGroup>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                            {t("home_banner_trusted_by")}
                        </Typography>
                    </Stack>

                    {/* AI Search Bar */}
                    <Paper
                        elevation={4}
                        component="div"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            bgcolor: "white",
                            borderRadius: "50px", // Pill shape
                            p: "6px",
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
                        <SearchIcon sx={{ color: "text.secondary", fontSize: 24, mr: 1.5 }} />
                        <InputBase
                            placeholder={t("home_banner_search_placeholder")}
                            sx={{
                                flex: 1,
                                fontSize: "1rem",
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
                                px: 3,
                                py: 1.2,
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                minWidth: "120px",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #7A6BE0 0%, #5E4DD8 100%)",
                                    boxShadow: "0 6px 20px rgba(108, 93, 211, 0.6)",
                                }
                            }}
                        >
                            {t("home_banner_search_button")}
                        </Button>
                    </Paper>

                    {/* Category/Filter Tags */}
                    <Box sx={{ mt: 2.5, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
                        {["Home Services", "Gadgets", "Consulting", "Safety Gear", "Design"].map((tag, index) => (
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
                                    px: 2,
                                    py: 0.8,
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    fontSize: '0.85rem',
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
