"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import KycStep from "@/components/supplier/onboarding/KycStep";
import StoreStep from "@/components/supplier/onboarding/StoreStep";
import Image from "next/image";
import { COLORS } from "@/constants/colors";
import { useEffect } from "react";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { secureStorage } from "@/helper/SecureStorage";
import { useRouter } from "next/navigation";
import { logout } from "@/features/ui/authSlice";
import { useAppDispatch } from "@/store/hooks";

import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const steps = [
  {
    label: "Store Setup",
    description:
      "Business details, categories & store location so buyers can discover your store.",
    icon: <StorefrontRoundedIcon />,
  },
  {
    label: "KYC Verification",
    description:
      "Verify identity & business with PAN, ID proof & address for a safe marketplace.",
    icon: <VerifiedUserRoundedIcon />,
  },
];

export default function SupplierOnboardingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  // const { data: profileArgs } = useSupplierProfile();
  const register_step = secureStorage.getItem("register_step");
  const router = useRouter();
  const dispatch = useAppDispatch();

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
    if (activeStep === 0) {
      secureStorage.removeItem("register_step");
      secureStorage.removeItem("role");
      secureStorage.removeItem("user_details");
      secureStorage.removeItem("token");
      secureStorage.removeItem("refreshToken");
      dispatch(logout());
      router.push("/");
    }
    setActiveStep((prev) => prev - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StoreStep onNext={handleNext} onBack={handleBack} />;
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
          <Image
            src="/logo.svg"
            alt="branding"
            width={isLargeScreen ? 200 : 150}
            height={isLargeScreen ? 200 : 150}
            priority
          />
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
          <Typography
            variant="h5"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: "300px", fontWeight: 500 }}
          >
            Join our community and grow your business with us.
          </Typography>
        </Box>
      </Grid>

      {/* Right Side (Form) */}
      <Grid
        size={{ xs: 12, lg: 6 }}
        sx={{
          ml: { lg: "50%" },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: theme.palette.mode === "dark" ? "background.default" : "grey.50",
        }}
      >
        {/* Mobile only: logo + heading at top */}
        <Box
          sx={{
            display: { xs: "flex", lg: "none" },
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 2, sm: 3 },
            pb: 2,
            px: 2,
            borderBottom: "1px solid",
            borderColor: theme.palette.mode === "dark" ? "divider" : "action.hover",
            bgcolor: theme.palette.mode === "dark" ? "background.paper" : "white",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>


            <Image
              src="/logo.svg"
              alt="kartsquare"
              width={56}
              height={56}
              priority
            />
            <Typography
              sx={{
                fontWeight: 700,
                color: theme.palette.mode === "light" ? "text.primary" : "#fff",
                letterSpacing: "-0.02em",
                fontSize: "1.5rem",
                mt: 1,
              }}
            >
              kartsquare
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            pt: { xs: 2, sm: 3, md: 4, lg: 12 },
            pb: { xs: 4, sm: 6 },
            px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
            width: "100%",
            flex: 1,
          }}
        >
          <Box sx={{ maxWidth: 920, mx: "auto" }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.mode === "dark" ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                mb: { xs: 2, sm: 3 },
                lineHeight: 1.5,
                px: { xs: 0, sm: 0 },
              }}
            >
              Two steps to set up your store and get verified. You can go back anytime.
            </Typography>

            {/* Steps row — responsive: compact on mobile */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 0,
                mb: { xs: 2, sm: 3 },
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                border: "1px solid",
                borderColor: theme.palette.mode === "dark" ? "divider" : alpha(COLORS.PRIMARY_PURPLE, 0.12),
                bgcolor: theme.palette.mode === "dark" ? "background.paper" : "white",
                boxShadow: theme.palette.mode === "dark" ? "none" : `0 2px 8px ${alpha(COLORS.PRIMARY_PURPLE, 0.04)}`,
              }}
            >
              {steps.map((s, idx) => {
                const isActive = activeStep === idx;
                const isCompleted = activeStep > idx;
                const isLast = idx === steps.length - 1;
                return (
                  <React.Fragment key={s.label}>
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1, sm: 1.5 },
                        py: { xs: 0.75, sm: 1 },
                        px: { xs: 1, sm: 2 },
                        borderRadius: 2,
                        bgcolor: isActive ? alpha(COLORS.PRIMARY_PURPLE, 0.08) : "transparent",
                        border: "2px solid",
                        borderColor: isActive ? COLORS.PRIMARY_PURPLE : "transparent",
                        transition: "all 0.2s ease",
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 32, sm: 36 },
                          height: { xs: 32, sm: 36 },
                          borderRadius: "50%",
                          bgcolor: isActive ? COLORS.PRIMARY_PURPLE : isCompleted ? alpha(COLORS.PRIMARY_PURPLE, 0.2) : (theme.palette.mode === "dark" ? "action.hover" : "action.selected"),
                          color: isActive ? "#fff" : (isCompleted ? COLORS.PRIMARY_PURPLE : "text.secondary"),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          boxShadow: isActive ? `0 0 0 3px ${alpha(COLORS.PRIMARY_PURPLE, 0.15)}` : "none",
                        }}
                      >
                        {isCompleted ? <CheckCircleRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} /> : s.icon}
                      </Box>
                      <Box sx={{ minWidth: 0, overflow: "hidden" }}>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: "block", textTransform: "uppercase", letterSpacing: "0.05em", fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                          Step {idx + 1}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600} color={isActive || isCompleted ? "text.primary" : "text.secondary"} sx={{ lineHeight: 1.3, fontSize: { xs: "0.8rem", sm: "0.875rem" } }} noWrap>
                          {s.label}
                        </Typography>
                      </Box>
                    </Box>
                    {!isLast && (
                      <Box
                        sx={{
                          flexShrink: 0,
                          width: { xs: 12, sm: 24 },
                          height: 2,
                          borderRadius: 1,
                          bgcolor: isCompleted ? alpha(COLORS.PRIMARY_PURPLE, 0.5) : (theme.palette.mode === "dark" ? "action.hover" : "action.selected"),
                          mx: { xs: 0.25, sm: 0.5 },
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </Box>

            {/* Form content — full width, responsive padding */}
            <Box sx={{ width: "100%", overflow: "hidden" }}>
              {getStepContent(activeStep)}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
