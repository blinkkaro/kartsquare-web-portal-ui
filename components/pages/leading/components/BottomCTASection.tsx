"use client";

import React from "react";
import { Box, Typography, Container, Grid, useTheme, AvatarGroup, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import LeadCaptureForm from "./LeadCaptureForm";
import SectionHeading from "./SectionHeading";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function BottomCTASection() {
    const { t } = useTranslate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                py: { xs: 8, md: 10, lg: 12 },
                bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    background: isDark
                        ? "radial-gradient(circle at 100% 0%, rgba(94, 24, 233, 0.1) 0%, transparent 50%)"
                        : "radial-gradient(circle at 100% 0%, rgba(94, 24, 233, 0.05) 0%, transparent 60%)",
                    pointerEvents: "none",
                }
            }}
        >
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center" justifyContent="space-between">
                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            {/* Trust Badge */}
                            <Box
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 1,
                                    px: 2,
                                    py: 0.75,
                                    borderRadius: 8,
                                    bgcolor: isDark ? "rgba(94, 24, 233, 0.15)" : "rgba(94, 24, 233, 0.08)",
                                    mb: 3,
                                    border: `1px solid ${isDark ? "rgba(94, 24, 233, 0.3)" : "rgba(94, 24, 233, 0.15)"}`,
                                    color: COLORS.PRIMARY_PURPLE,
                                }}
                            >
                                <VerifiedUserIcon sx={{ fontSize: 18 }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.02em" }}>
                                    {"100% Free Registration"}
                                </Typography>
                            </Box>

                            <Typography
                                variant="h2"
                                sx={{
                                    fontFamily: "var(--font-heading)",
                                    fontWeight: 800,
                                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    fontSize: { xs: "2.25rem", md: "2.75rem", lg: "3.5rem" },
                                    letterSpacing: "-0.02em",
                                    mb: 2.5,
                                    lineHeight: 1.15,
                                }}
                            >
                                {(t as any)("readyToStandOut") || "Ready to grow your business?"}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                    fontSize: "1.125rem",
                                    lineHeight: 1.6,
                                    mb: 5,
                                    maxWidth: 480,
                                }}
                            >
                                {(t as any)("joinThousands") || "Join thousands of suppliers and service providers who are getting discovered by millions of customers every day."}
                            </Typography>

                            {/* Trust Elements */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <AvatarGroup
                                    max={4}
                                    sx={{
                                        "& .MuiAvatar-root": {
                                            width: 40, height: 40, border: `2px solid ${isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT}`
                                        }
                                    }}
                                >
                                    <Avatar alt="Provider 1" src="https://i.pravatar.cc/150?img=11" />
                                    <Avatar alt="Provider 2" src="https://i.pravatar.cc/150?img=32" />
                                    <Avatar alt="Provider 3" src="https://i.pravatar.cc/150?img=68" />
                                    <Avatar alt="Provider 4" src="https://i.pravatar.cc/150?img=47" />
                                </AvatarGroup>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                                        {(t as any)("trustedByLocals") || "Trusted by 10k+ locals"}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }}>
                                        {(t as any)("joinCommunityLabel") || "Join our community today"}
                                    </Typography>
                                </Box>
                            </Box>
                        </motion.div>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                            <Box
                                sx={{
                                    p: { xs: 3, sm: 4 },
                                    borderRadius: 4,
                                    bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#fff",
                                    boxShadow: isDark
                                        ? "0 24px 50px rgba(0,0,0,0.5)"
                                        : "0 24px 50px rgba(94, 24, 233, 0.08)",
                                    border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.05)"}`,
                                }}
                            >
                                <LeadCaptureForm />
                            </Box>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
