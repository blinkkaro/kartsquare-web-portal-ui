"use client";

import React from "react";
import { Box, Typography, Grid, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { Send, Person, Phone, Message as MessageIcon } from "@mui/icons-material";

const MotionGrid = motion(Grid) as any;
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

const ContactUsSection = () => {
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";

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
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            sx={{
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                boxShadow: isDark
                    ? "0 10px 40px rgba(0,0,0,0.4)"
                    : "0 10px 40px rgba(94, 24, 233, 0.08)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(94, 24, 233, 0.05)"}`,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative Background Elements */}
            <Box
                sx={{
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${COLORS.PRIMARY_PURPLE}20 0%, transparent 70%)`,
                    pointerEvents: "none",
                }}
            />

            <Box component={motion.div} variants={itemVariants} sx={{ mb: 4, textAlign: "center" }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 800,
                        mb: 1,
                        background: `linear-gradient(45deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PRIMARY_BLUE})`,
                        backgroundClip: "text",
                        textFillColor: "transparent",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {t("getInTouch" as any) || "Get in Touch"}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 600, mx: "auto" }}
                >
                    Have a question or want to book a service? Send us a message directly!
                </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <MotionGrid size={{ xs: 12, md: 6 }} variants={itemVariants}>
                        <Input
                            name="firstName"
                            control={control}
                            label={t("firstName") || "First Name"}
                            // placeholder="John"
                            // startIcon={<Person sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                            sx={{ bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFA" }}
                        />
                    </MotionGrid>
                    <MotionGrid size={{ xs: 12, md: 6 }} variants={itemVariants}>
                        <Input
                            name="lastName"
                            control={control}
                            label={t("lastName") || "Last Name"}
                            placeholder="Doe"
                            // startIcon={<Person sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                            sx={{ bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFA" }}
                        />
                    </MotionGrid>
                    <MotionGrid size={{ xs: 12 }} variants={itemVariants}>
                        <Input
                            name="phoneNumber"
                            control={control}
                            label={t("phoneNumber") || "Phone Number"}
                            placeholder="9876543210"
                            // startIcon={<Phone sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                            sx={{ bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFA" }}
                        />
                    </MotionGrid>
                    <MotionGrid size={{ xs: 12 }} variants={itemVariants}>
                        <Input
                            name="message"
                            control={control}
                            label={t("message") || "Message"}
                            placeholder="Type your message here..."
                            multiline
                            minRows={4}
                            // startIcon={<MessageIcon sx={{ color: COLORS.PRIMARY_PURPLE, transform: "translateY(-12px)" }} />}
                            sx={{ bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFA" }}
                        />
                    </MotionGrid>
                    <MotionGrid size={{ xs: 12 }} variants={itemVariants} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            variant="contained"
                            endIcon={<Send />}
                            sx={{
                                px: 5,
                                py: 1.5,
                                borderRadius: "12px",
                                fontSize: "1rem",
                                boxShadow: `0 8px 20px ${COLORS.PRIMARY_PURPLE}40`,
                            }}
                        >
                            {t("sendMessage") || "Send Message"}
                        </Button>
                    </MotionGrid>
                </Grid>
            </form>
        </MotionBox>
    );
};

export default ContactUsSection;
