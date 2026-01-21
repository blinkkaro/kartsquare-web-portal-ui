"use client";
import React, { useState } from "react";
import { Box, Container, Stepper, Step, StepLabel, Paper } from "@mui/material";
import Nav from "@/components/common/Nav";
import BusinessProfileStep from "@/components/supplier/onboarding/BusinessProfileStep";
import KycStep from "@/components/supplier/onboarding/KycStep";
import StoreStep from "@/components/supplier/onboarding/StoreStep";
import SupplierGuard from "@/components/supplier/SupplierGuard";

const steps = ["Business Profile", "KYC Verification", "Store Setup"];

export default function SupplierOnboardingPage() {
    const [activeStep, setActiveStep] = useState(2);

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <BusinessProfileStep onNext={handleNext} />;
            case 1:
                return <KycStep onNext={handleNext} onBack={handleBack} />;
            case 2:
                return <StoreStep onBack={handleBack} />;
            default:
                return "Unknown step";
        }
    };

    return (
        <SupplierGuard requireComplete={false}>
            <Nav />
            <Box
                sx={{
                    minHeight: "100vh",
                    bgcolor: "#f5f5f5",
                    py: 4,
                    mt: { xs: 7, md: 8 },
                }}
            >
                <Container maxWidth="md">
                    <Paper sx={{ p: 4, borderRadius: 2 }}>
                        <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {getStepContent(activeStep)}
                    </Paper>
                </Container>
            </Box>
        </SupplierGuard>
    );
}
