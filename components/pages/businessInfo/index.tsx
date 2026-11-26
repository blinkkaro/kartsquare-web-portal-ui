"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { useLogout } from "@/hooks/useLogout";
import ErrorMessage from "@/components/common/ErrorMessage";
import { COLORS } from "@/constants/colors";
import { businessInfoService } from "@/services/auth/businessInfo.service";
import BackButton from "@/components/common/BackButton";
import AuthWrapper from "@/components/auth/authWrapper";
import { handleRegistrationStepNavigation } from "@/helper/registrationNavigation";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { errorMessage } from "@/lib/http/errorMessage";
import { type BusinessInfoFormData } from "./businessInfoSchema";
import BusinessInfoForm from "./components/businessinfoForm";

function BusinessInfoView() {
  const theme = useTheme();
  const router = useRouter();
  const { handleLogout } = useLogout();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSubmit = async (data: BusinessInfoFormData) => {
    try {
      setError("");
      setIsLoading(true);
      await businessInfoService.addBusinessInfo(data);
      handleRegistrationStepNavigation(dispatch, router, UserRegisterSteps.BUSINESS_INFO);
    } catch (error) {
      setError(errorMessage(error, "An unexpected error occurred"));
    } finally {
      setIsLoading(false);
    }
  };
  // Leaving registration signs the half-registered account out (one flow: useLogout).
  const handleBack = () => handleLogout({ redirectTo: "/business-listing" });
  return (
    <AuthWrapper>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1.5, sm: 2 },
          mb: { xs: 2, sm: 3 },
        }}
      >
        <BackButton onClick={handleBack} />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          <span style={{ color: COLORS.PRIMARY_PURPLE }}>Business</span>{" "}
          <span
            style={{
              color: theme.palette.mode === "dark" ? COLORS.WHITE : "#000000",
              fontSize: "0.85em",
            }}
          >
            Details
          </span>
        </Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <ErrorMessage error={error} isVisible={!!error} />
      </Box>
      <BusinessInfoForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthWrapper>
  );
}

export default BusinessInfoView;
