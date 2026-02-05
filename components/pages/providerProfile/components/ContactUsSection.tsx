"use client";

import React from "react";
import { Box, Typography, Grid, useTheme, useMediaQuery } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { Message as MessageIcon, Phone } from "@mui/icons-material";

const MotionBox = motion(Box) as any;

// Validation Schema
const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    phoneNumber: yup
        .string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Must be at least 10 digits")
        .required("Phone number is required"),
    message: yup.string().required("Message is required").min(10, "Message is too short"),
});

type ContactFormValues = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    message: string;
};

const ContactUsSection = ({ profile }: any) => {
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<ContactFormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            message: "",
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        console.log("Form Data:", data);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        reset();
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            }
        },
    };

    return (
        <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            sx={{
                bgcolor: isDark ? "rgba(255, 255, 255, 0.03)" : COLORS.WHITE,
                borderRadius: 4,
                overflow: "hidden",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)"}`,
                boxShadow: isDark
                    ? "0 4px 24px rgba(0,0,0,0.4)"
                    : "0 10px 40px rgba(0,0,0,0.05)",
                position: "relative",
            }}
        >
            <Grid container>
                {/* Left Side - Info / Visual — hidden on mobile to save height */}
                {!isMobile && (
                    <Grid size={{ xs: 0, md: 5 }} sx={{
                        position: "relative",
                        bgcolor: COLORS.PRIMARY_PURPLE,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        color: COLORS.WHITE,
                        overflow: "hidden"
                    }}>
                        <Box sx={{
                            position: "absolute",
                            top: -50,
                            left: -50,
                            width: 150,
                            height: 150,
                            borderRadius: "50%",
                            bgcolor: "rgba(255,255,255,0.1)",
                        }} />
                        <Box sx={{
                            position: "absolute",
                            bottom: -30,
                            right: -30,
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            bgcolor: "rgba(255,255,255,0.1)",
                        }} />
                        <Box sx={{ position: "relative", zIndex: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                                {t("getInTouch") || "Get in Touch"}
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, mb: 4, lineHeight: 1.6 }}>
                                Have a question or want to book a service? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                            </Typography>
                            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                                <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <MessageIcon sx={{ fontSize: 20 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Chat with us</Typography>
                                    <Typography variant="subtitle2" sx={{ opacity: 0.9, fontWeight: 500 }}>{profile?.email}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Phone sx={{ fontSize: 20 }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Call us</Typography>
                                    <Typography variant="subtitle2" sx={{ opacity: 0.9, fontWeight: 500 }}>{profile?.country_code} {profile?.phone_number}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                )}

                {/* Form — full width on mobile, compact spacing and message rows */}
                <Grid size={{ xs: 12, md: 7 }} sx={{ p: { xs: 2, sm: 2.5, md: 5 } }}>
                    {isMobile && (
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                            {t("getInTouch") || "Get in Touch"}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={isMobile ? 2 : 3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Input
                                    name="firstName"
                                    control={control}
                                    label={t("firstName") || "First Name"}
                                    placeholder="John"
                                    sx={{ bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa" }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Input
                                    name="lastName"
                                    control={control}
                                    label={t("lastName") || "Last Name"}
                                    placeholder="Doe"
                                    sx={{ bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa" }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Input
                                    name="phoneNumber"
                                    control={control}
                                    label={t("phoneNumber") || "Phone Number"}
                                    placeholder="+91 98765 43210"
                                    sx={{ bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa" }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Input
                                    name="message"
                                    control={control}
                                    label={t("message") || "Message"}
                                    placeholder="Tell us how we can help..."
                                    multiline
                                    minRows={isMobile ? 2 : 4}
                                    sx={{ bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8f9fa" }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Button
                                    type="submit"
                                    isLoading={isSubmitting}
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        py: isMobile ? 1.25 : 1.5,
                                        borderRadius: "8px",
                                        fontWeight: 700,
                                        fontSize: isMobile ? "0.9375rem" : "1rem",
                                        textTransform: "none",
                                        bgcolor: COLORS.PRIMARY_PURPLE,
                                        boxShadow: "0 4px 14px rgba(94, 24, 233, 0.4)",
                                        "&:hover": {
                                            bgcolor: COLORS.PURPLE_HOVER,
                                            boxShadow: "0 6px 20px rgba(94, 24, 233, 0.6)",
                                        }
                                    }}
                                >
                                    {t("sendMessage") || "Send Message"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </MotionBox>
    );
};

export default ContactUsSection;
