"use client";
import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Grid, Typography, useTheme, useMediaQuery } from "@mui/material";
import Nav from "@/components/common/Nav";
import KycStep from "@/components/supplier/onboarding/KycStep";
import StoreStep from "@/components/supplier/onboarding/StoreStep";
import Image from "next/image";
import { COLORS } from "@/constants/colors";
import { useSupplierProfile } from "@/hooks/useSupplier";
import { useEffect } from "react";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { secureStorage } from "@/helper/SecureStorage";

const steps = ["Store Setup", "KYC Verification"];

export default function SupplierOnboardingPage() {
    const [activeStep, setActiveStep] = useState(0);
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
    // const { data: profileArgs } = useSupplierProfile();
    const register_step = secureStorage.getItem("register_step");

    useEffect(() => {
        if (register_step) {
            const step = register_step;


            // // If already completed or at a later step, we can stay at the last step or ideally the guard would have redirected
            // if (step === UserRegisterSteps.COMPLETED || step === 7) {
            //     // Already done everything
            //     return;
            // }

            if (step >= UserRegisterSteps.SUPPLIER_STORE_CREATED) {
                setActiveStep(1); // Done store, go to KYC
            } else {
                setActiveStep(0); // Start with Store
            }
        }
    }, [register_step]);

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <StoreStep onNext={handleNext} />;
            case 1:
                return <KycStep onBack={handleBack} />;
            default:
                return "Unknown step";
        }
    };

    return (
        <Grid container sx={{ minHeight: "100vh", width: "100%" }}>
            {/* Left Side (Branding & Logo) */}
            <Grid
                size={{ xs: 12, lg: 6 }}
                sx={{
                    background:
                        theme.palette.mode === "light"
                            ? COLORS.PURPLECYAN
                            : COLORS.DARK_GRADIENT,
                    display: { xs: "none", lg: "flex" },
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    width: { lg: "50%" },
                    p: 4,
                    position: { lg: "fixed" },
                    left: 0,
                    top: 0,
                    transition: "background 0.3s ease-in-out",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                    }}
                >
                    <Image src="/logo.svg" alt="branding" width={isLargeScreen ? 200 : 150} height={isLargeScreen ? 200 : 150} priority />
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            color:
                                theme.palette.mode === "light" ? "text.primary" : "#ffffff",
                            letterSpacing: "-0.02em",
                            fontSize: isLargeScreen ? "4rem" : "3rem",
                        }}
                    >
                        kartsquare
                    </Typography>
                    <Typography variant="h5" color="text.secondary" textAlign="center" sx={{ maxWidth: '300px', fontWeight: 500 }}>
                        Join our community and grow your business with us.
                    </Typography>
                </Box>
            </Grid>

            {/* Right Side (Form) */}
            <Grid
                size={{ xs: 12, lg: 6 }}
                sx={{
                    ml: { lg: '50%' },
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <Box
                    sx={{
                        pt: { xs: 12, md: 15 },
                        pb: 6,
                        px: { xs: 2, md: 6, lg: 8, xl: 12 },
                        width: "100%",
                    }}
                >
                    <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
                        <Stepper
                            activeStep={activeStep}
                            sx={{
                                mb: 1.5,
                                "& .MuiStepLabel-label": { mt: 1, fontWeight: 500 }
                            }}
                            alternativeLabel
                        >
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <Box sx={{ mt: 0 }}>
                            {getStepContent(activeStep)}
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
