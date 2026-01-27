"use client";

import React from "react";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";
import { Search, Home, ArrowBack } from "@mui/icons-material";
import { useTranslate } from "@/hooks/useTranslate";

const MotionBox = motion(Box) as any;

const ProfileNotFound = () => {
    const router = useRouter();
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <Container maxWidth="md" sx={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MotionBox
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                sx={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                }}
            >
                {/* Animated Illustration Placeholder */}
                <MotionBox
                    variants={itemVariants}
                    sx={{
                        width: 200,
                        height: 200,
                        mb: 2,
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {/* Animated Circles BG */}
                    <Box
                        component={motion.div}
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            bgcolor: isDark ? "rgba(94, 24, 233, 0.1)" : "rgba(94, 24, 233, 0.05)",
                            zIndex: 0,
                        }}
                    />
                    <Box
                        component={motion.div}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        sx={{
                            position: "absolute",
                            width: "70%",
                            height: "70%",
                            borderRadius: "50%",
                            bgcolor: isDark ? "rgba(94, 13, 233, 0.15)" : "rgba(94, 24, 233, 0.08)",
                            zIndex: 0,
                        }}
                    />

                    <Search sx={{ fontSize: 80, color: COLORS.PRIMARY_PURPLE, zIndex: 1, opacity: 0.8 }} />
                    <Typography
                        variant="h1"
                        sx={{
                            position: "absolute",
                            fontSize: "8rem",
                            fontWeight: 900,
                            color: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                            zIndex: 0
                        }}
                    >
                        404
                    </Typography>
                </MotionBox>

                <MotionBox variants={itemVariants}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 800,
                            mb: 1.5,
                            background: `linear-gradient(45deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PRIMARY_BLUE})`,
                            backgroundClip: "text",
                            textFillColor: "transparent",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        {t("profileNotFound") || "Profile Not Found"}
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ maxWidth: 500, mx: "auto", fontSize: "1.1rem" }}
                    >
                        We couldn't find the provider you're looking for. They might have moved or the link might be incorrect.
                    </Typography>
                </MotionBox>

                <MotionBox variants={itemVariants} sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => router.back()}
                        startIcon={<ArrowBack />}
                        sx={{
                            borderRadius: "30px",
                            px: 3,
                            py: 1.2,
                            borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                            color: isDark ? COLORS.WHITE : COLORS.TEXT.PRIMARY_LIGHT,
                            "&:hover": {
                                borderColor: COLORS.PRIMARY_PURPLE,
                                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                            }
                        }}
                    >
                        {t("goBack") || "Go Back"}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => router.push("/")}
                        startIcon={<Home />}
                        sx={{
                            borderRadius: "30px",
                            px: 4,
                            py: 1.2,
                            bgcolor: COLORS.PRIMARY_PURPLE,
                            boxShadow: "0 8px 25px rgba(94, 24, 233, 0.25)",
                            "&:hover": {
                                bgcolor: COLORS.PURPLE_HOVER,
                                boxShadow: "0 10px 30px rgba(94, 24, 233, 0.4)",
                            }
                        }}
                    >
                        {t("home") || "Go Home"}
                    </Button>
                </MotionBox>

                <MotionBox variants={itemVariants} sx={{ mt: 4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Looking for something else?
                    </Typography>
                    <Button
                        variant="text"
                        onClick={() => router.push("/search")}
                        sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 600 }}
                    >
                        Browse Popular Services
                    </Button>
                </MotionBox>
            </MotionBox>
        </Container>
    );
};

export default ProfileNotFound;
