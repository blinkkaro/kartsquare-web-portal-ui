"use client";
import React, { useState } from "react";
import { Box, Typography, Button, useTheme, Grid, AvatarGroup, Avatar, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import HomeSearchBar from "./HomeSearchBar";

const HomeBanner = () => {
    const theme = useTheme();
    const { t } = useTranslationContext();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const searchRef = React.useRef<any>(null);

    return (
        <Box
            sx={{
                width: "100%",
                position: "relative",
                borderRadius: { xs: 2, md: 4 },
                bgcolor: "#1a1a1a",
                color: "white",
                minHeight: { xs: 180, sm: 220, md: 320 },
                display: "flex",
                alignItems: "center",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                overflow: 'hidden'
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
                    borderRadius: "inherit",
                    backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)",
                    },
                }}
            />

            <Grid container sx={{ position: "relative", zIndex: 1, p: { xs: 2, md: 4 } }}>
                <Grid size={{ xs: 12, md: 8, lg: 12 }}>
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                        sx={{
                            mb: { xs: 0.5, md: 1.5 },
                            fontSize: { xs: "1.1rem", sm: "1.4rem", md: "2rem" },
                            lineHeight: 1.1,
                            letterSpacing: "-0.01em",
                            textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                        }}
                    >
                        {t("home_banner_title")}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: { xs: 1.5, md: 2.5 } }}>
                        <AvatarGroup max={3} sx={{
                            '& .MuiAvatar-root': {
                                width: { xs: 20, md: 28 }, height: { xs: 20, md: 28 }, fontSize: { xs: '0.6rem', md: '0.8rem' },
                                border: '1.5px solid rgba(255,255,255,0.8)'
                            }
                        }}>
                            <Avatar alt="User 1" src="https://mui.com/static/images/avatar/1.jpg" />
                            <Avatar alt="User 2" src="https://mui.com/static/images/avatar/2.jpg" />
                            <Avatar alt="User 3" src="https://mui.com/static/images/avatar/3.jpg" />
                        </AvatarGroup>
                        <Typography variant="caption" sx={{ opacity: 0.9, fontWeight: 500, textShadow: "0 1px 3px rgba(0,0,0,0.5)", fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                            {t("home_banner_trusted_by")}
                        </Typography>
                    </Stack>

                    {/* Search Bar Component */}
                    <HomeSearchBar ref={searchRef} value={searchQuery} onChange={setSearchQuery} />

                    {/* Category/Filter Tags - Hidden or simplified on very small screens */}
                    <Box sx={{ mt: { xs: 1.5, md: 2.5 }, display: { xs: "none", sm: "flex" }, gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                        {["Home Services", "Gadgets", "Consulting"].map((tag, index) => (
                            <Box
                                key={index}
                                onClick={() => {
                                    setSearchQuery(tag);
                                    searchRef.current?.focus();
                                }}
                                sx={{
                                    bgcolor: "rgba(30,30,30,0.7)",
                                    backdropFilter: "blur(12px)",
                                    borderRadius: "20px",
                                    px: 1.5,
                                    py: 0.5,
                                    cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    color: "rgba(255,255,255,0.9)",
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: "rgba(50,50,50,0.8)",
                                        transform: "translateY(-1px)",
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
