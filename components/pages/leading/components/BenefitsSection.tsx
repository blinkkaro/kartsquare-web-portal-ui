"use client";

import React from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";

import PlaceIcon from "@mui/icons-material/Place";
import ForumIcon from "@mui/icons-material/Forum";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PaymentsIcon from "@mui/icons-material/Payments";
import PeopleIcon from "@mui/icons-material/People";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { useTranslate } from "@/hooks/useTranslate";

import { ScrollStagger, staggerItemVariants, ScrollReveal } from "./ScrollReveal";

// Using a strict dark theme for this section regardless of the global theme to ensure the premium look
const DARK_BG = "#05050A";
const CARD_BG = "rgba(255, 255, 255, 0.02)";
const BORDER_COLOR = "rgba(255, 255, 255, 0.08)";
const PURPLE = "#8B5CF6";
const BLUE = "#3B82F6";

const BenefitsSection = () => {
    const { t } = useTranslate();

    const serviceProviderBenefits = [
        {
            title: t("benefitSpl1Title"),
            desc: t("benefitSpl1Desc"),
            Icon: PlaceIcon,
        },
        {
            title: t("benefitSpl2Title"),
            desc: t("benefitSpl2Desc"),
            Icon: ForumIcon,
        },
        {
            title: t("benefitSpl3Title"),
            desc: t("benefitSpl3Desc"),
            Icon: AccountBalanceWalletIcon,
        },
    ];

    const supplierBenefits = [
        {
            title: t("benefitSup1Title"),
            desc: t("benefitSup1Desc"),
            Icon: StorefrontIcon,
        },
        {
            title: t("benefitSup2Title"),
            desc: t("benefitSup2Desc"),
            Icon: PaymentsIcon,
        },
        {
            title: t("benefitSup3Title"),
            desc: t("benefitSup3Desc"),
            Icon: PeopleIcon,
        },
    ];

    return (
        <Box
            sx={{
                py: { xs: 10, md: 16 },
                bgcolor: DARK_BG,
                position: "relative",
                overflow: "hidden",
                color: "#fff", // Force text to be white
            }}
        >
            {/* Ambient Glows */}
            <Box
                sx={{
                    position: "absolute",
                    top: "0%",
                    left: "-10%",
                    width: "60vw",
                    height: "60vw",
                    maxWidth: "800px",
                    maxHeight: "800px",
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 60%)",
                    filter: "blur(60px)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: "-10%",
                    right: "-10%",
                    width: "60vw",
                    height: "60vw",
                    maxWidth: "800px",
                    maxHeight: "800px",
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 60%)",
                    filter: "blur(60px)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />

            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
                {/* Header */}
                <ScrollReveal variant="fadeUp">
                    <Box sx={{ mb: { xs: 10, md: 14 }, textAlign: "center" }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 50,
                                    bgcolor: "rgba(255, 255, 255, 0.03)",
                                    border: `1px solid ${BORDER_COLOR}`,
                                    mb: 4,
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <HandshakeIcon sx={{ fontSize: 20, color: PURPLE }} />
                                <Typography variant="body2" fontWeight={600} letterSpacing="0.05em" textTransform="uppercase" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                                    {t("benefitWhyChooseUs")}
                                </Typography>
                            </Box>
                        </motion.div>
                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 800,
                                fontFamily: "var(--font-heading)",
                                color: "#ffffff",
                                letterSpacing: "-0.03em",
                                mb: 3,
                                lineHeight: 1.1,
                            }}
                        >
                            {t("benefitHeading1")} <br />
                            <Box component="span" sx={{
                                background: "linear-gradient(135deg, #A78BFA 0%, #3B82F6 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>
                                {t("benefitHeading2")}
                            </Box>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "rgba(255, 255, 255, 0.6)",
                                maxWidth: "600px",
                                mx: "auto",
                                fontWeight: 400,
                                lineHeight: 1.6,
                            }}
                        >
                            {t("benefitSubheading")}
                        </Typography>
                    </Box>
                </ScrollReveal>

                {/* Section 1: For Service Providers (Image Left, Content Right) */}
                <Box sx={{ mb: { xs: 12, md: 20 } }}>
                    <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <ScrollReveal variant="fadeRight">
                                <Box sx={{ position: "relative" }}>
                                    {/* Main Image */}
                                    <Box
                                        sx={{
                                            borderRadius: "24px",
                                            overflow: "hidden",
                                            position: "relative",
                                            border: `1px solid rgba(139, 92, 246, 0.2)`,
                                            boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
                                            "&::after": {
                                                content: '""',
                                                position: "absolute",
                                                inset: 0,
                                                background: "linear-gradient(to top, #05050A 0%, rgba(5,5,10,0) 30%)",
                                                pointerEvents: "none"
                                            }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=1200&auto=format&fit=crop&q=80"
                                            alt="Service Provider Working"
                                            sx={{
                                                width: "100%",
                                                height: "auto",
                                                maxHeight: "600px",
                                                objectFit: "cover",
                                                display: "block",
                                                transition: "transform 0.7s ease",
                                                "&:hover": {
                                                    transform: "scale(1.05)"
                                                }
                                            }}
                                        />
                                    </Box>

                                    {/* Floating Stats/Feature Card */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                bottom: 40,
                                                right: -30,
                                                bgcolor: "rgba(15, 15, 20, 0.8)",
                                                backdropFilter: "blur(20px)",
                                                border: `1px solid rgba(255,255,255,0.1)`,
                                                borderRadius: 4,
                                                p: 3,
                                                boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
                                                display: { xs: "none", sm: "block" }
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>Direct Leads</Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Typography variant="h4" fontWeight={800}>500+</Typography>
                                                <Box sx={{ bgcolor: "rgba(52, 211, 153, 0.2)", color: "#34D399", px: 1, py: 0.5, borderRadius: 1, fontSize: "0.75rem", fontWeight: 700 }}>
                                                    24% ↑
                                                </Box>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                </Box>
                            </ScrollReveal>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <ScrollReveal variant="fadeLeft" delay={0.2}>
                                <Typography
                                    variant="h2"
                                    fontWeight={800}
                                    sx={{
                                        mb: 2,
                                        fontFamily: "var(--font-heading)",
                                        color: "#fff",
                                        letterSpacing: "-0.02em"
                                    }}
                                >
                                    {t("benefitServiceTitle")}
                                </Typography>
                                <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.6)", mb: 6, fontWeight: 400 }}>
                                    {t("benefitServiceSub")}
                                </Typography>

                                <ScrollStagger staggerDelay={0.15}>
                                    <Grid container spacing={4}>
                                        {serviceProviderBenefits.map((item, i) => (
                                            <Grid size={{ xs: 12 }} key={i}>
                                                <motion.div variants={staggerItemVariants}>
                                                    <Box sx={{ display: "flex", gap: 3, "&:hover .icon-box": { bgcolor: PURPLE, color: "#fff", boxShadow: `0 0 20px ${PURPLE}` } }}>
                                                        <Box
                                                            className="icon-box"
                                                            sx={{
                                                                width: 56,
                                                                height: 56,
                                                                borderRadius: "16px",
                                                                bgcolor: "rgba(139, 92, 246, 0.1)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                flexShrink: 0,
                                                                color: PURPLE,
                                                                border: `1px solid rgba(139, 92, 246, 0.2)`,
                                                                transition: "all 0.3s ease"
                                                            }}
                                                        >
                                                            <item.Icon sx={{ fontSize: 28 }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: "#fff" }}>
                                                                {item.title}
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                                                                {item.desc}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </motion.div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </ScrollStagger>
                            </ScrollReveal>
                        </Grid>
                    </Grid>
                </Box>

                {/* Section 2: For Suppliers (Content Left, Image Right) */}
                <Box>
                    <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center" direction={{ xs: "column-reverse", md: "row" }}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <ScrollReveal variant="fadeRight" delay={0.2}>
                                <Typography
                                    variant="h2"
                                    fontWeight={800}
                                    sx={{
                                        mb: 2,
                                        fontFamily: "var(--font-heading)",
                                        color: "#fff",
                                        letterSpacing: "-0.02em"
                                    }}
                                >
                                    {t("benefitShopTitle")}
                                </Typography>
                                <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.6)", mb: 6, fontWeight: 400 }}>
                                    {t("benefitShopSub")}
                                </Typography>

                                <ScrollStagger staggerDelay={0.15}>
                                    <Grid container spacing={4}>
                                        {supplierBenefits.map((item, i) => (
                                            <Grid size={{ xs: 12 }} key={i}>
                                                <motion.div variants={staggerItemVariants}>
                                                    <Box sx={{ display: "flex", gap: 3, "&:hover .icon-box": { bgcolor: BLUE, color: "#fff", boxShadow: `0 0 20px ${BLUE}` } }}>
                                                        <Box
                                                            className="icon-box"
                                                            sx={{
                                                                width: 56,
                                                                height: 56,
                                                                borderRadius: "16px",
                                                                bgcolor: "rgba(59, 130, 246, 0.1)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                flexShrink: 0,
                                                                color: BLUE,
                                                                border: `1px solid rgba(59, 130, 246, 0.2)`,
                                                                transition: "all 0.3s ease"
                                                            }}
                                                        >
                                                            <item.Icon sx={{ fontSize: 28 }} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: "#fff" }}>
                                                                {item.title}
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                                                                {item.desc}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </motion.div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </ScrollStagger>
                            </ScrollReveal>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <ScrollReveal variant="fadeLeft">
                                <Box sx={{ position: "relative" }}>
                                    {/* Main Image */}
                                    <Box
                                        sx={{
                                            borderRadius: "24px",
                                            overflow: "hidden",
                                            position: "relative",
                                            border: `1px solid rgba(59, 130, 246, 0.2)`,
                                            boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
                                            "&::after": {
                                                content: '""',
                                                position: "absolute",
                                                inset: 0,
                                                background: "linear-gradient(to top, #05050A 0%, rgba(5,5,10,0) 30%)",
                                                pointerEvents: "none"
                                            }
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&auto=format&fit=crop&q=80"
                                            alt="Indian Shop/Kirana Store"
                                            sx={{
                                                width: "100%",
                                                height: "auto",
                                                maxHeight: "600px",
                                                objectFit: "cover",
                                                display: "block",
                                                transition: "transform 0.7s ease",
                                                "&:hover": {
                                                    transform: "scale(1.05)"
                                                }
                                            }}
                                        />
                                    </Box>

                                    {/* Floating Stats/Feature Card */}
                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: -30,
                                                left: -30,
                                                bgcolor: "rgba(15, 15, 20, 0.8)",
                                                backdropFilter: "blur(20px)",
                                                border: `1px solid rgba(255,255,255,0.1)`,
                                                borderRadius: 4,
                                                p: 3,
                                                boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
                                                display: { xs: "none", sm: "block" }
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1 }}>Store Visits</Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                <Typography variant="h4" fontWeight={800}>10k+</Typography>
                                                <Box sx={{ bgcolor: "rgba(59, 130, 246, 0.2)", color: "#3B82F6", px: 1, py: 0.5, borderRadius: 1, fontSize: "0.75rem", fontWeight: 700 }}>
                                                    Real-time
                                                </Box>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                </Box>
                            </ScrollReveal>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default BenefitsSection;
