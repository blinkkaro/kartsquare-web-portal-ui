"use client";

import AuthWrapper from "@/components/auth/authWrapper";
import React, { useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import BusinessInfoForm from "./components/businessinfoForm";
import { BusinessInfoFormData } from "./businessInfoSchema";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/common/ErrorMessage";
import { Box, Typography, useTheme } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { businessInfoService } from "@/services/auth/businessInfo.service";
import BackButton from "@/components/common/BackButton";
import { secureStorage } from "@/helper/SecureStorage";
import { useDispatch } from "react-redux";
import { logout } from "@/features/ui/authSlice";
import { handleRegistrationStepNavigation } from "@/helper/registrationNavigation";
import { UserRegisterSteps } from "@/types/resgistrationFlow";

function BusinessInfoView() {
  const { t } = useTranslate();
  const theme = useTheme();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSubmit = async (data: BusinessInfoFormData) => {
    try {
      setError("");
      setIsLoading(true);
      await businessInfoService.addBusinessInfo(data);
      handleRegistrationStepNavigation(
        dispatch,
        router,
        UserRegisterSteps.BUSINESS_INFO,
      );
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleBack = () => {
    // const role = secureStorage.getItem("role");
    secureStorage.removeItem("token");
    secureStorage.removeItem("refreshToken");
    secureStorage.removeItem("register_step");
    secureStorage.removeItem("role");
    secureStorage.removeItem("user_details");


    dispatch(logout());
    router.push(`/business-listing`);
  };
  return (
    <AuthWrapper>
      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
        <BackButton onClick={handleBack} />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          <span style={{ color: COLORS.PRIMARY_PURPLE }}>Business</span>{" "}
          <span style={{ color: theme.palette.mode === "dark" ? COLORS.WHITE : "#000000", fontSize: "0.85em" }}>
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
