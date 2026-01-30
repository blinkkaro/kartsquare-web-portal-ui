"use client";

import AuthWrapper from "@/components/auth/authWrapper";
import React, { useState } from "react";
import Title from "@/components/auth/title";
import { useTranslate } from "@/hooks/useTranslate";
import BusinessInfoForm from "./components/businessinfoForm";
import { BusinessInfoFormData } from "./businessInfoSchema";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/common/ErrorMessage";
import { Box } from "@mui/material";
import { businessInfoService } from "@/services/auth/businessInfo.service";
import BackButton from "@/components/common/BackButton";
import { secureStorage } from "@/helper/SecureStorage";
import { useDispatch } from "react-redux";
import { logout } from "@/features/ui/authSlice";
import { handleRegistrationStepNavigation } from "@/helper/registrationNavigation";
import { UserRegisterSteps } from "@/types/resgistrationFlow";

function BusinessInfoView() {
  const { t } = useTranslate();
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
    const role = secureStorage.getItem("role");
    secureStorage.removeItem("token");
    secureStorage.removeItem("refreshToken");
    secureStorage.removeItem("register_step");
    secureStorage.removeItem("role");
    secureStorage.removeItem("user_details");


    dispatch(logout());
    router.push(`/login?role=${role?.toLowerCase()}`);
  };
  return (
    <AuthWrapper>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <BackButton onClick={handleBack} />
      </Box>
      <Title title={t("businessInfo")} />
      <Box sx={{ mb: 2 }}>
        <ErrorMessage error={error} isVisible={!!error} />
      </Box>
      <BusinessInfoForm onSubmit={handleSubmit} isLoading={isLoading} />
    </AuthWrapper>
  );
}

export default BusinessInfoView;
