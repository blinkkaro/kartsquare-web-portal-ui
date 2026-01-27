"use client";

import LoginForm from "./components/LoginForm";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import AuthCarouselWrapper, {
  CarouselItem,
} from "@/components/auth/authCarouselWrapper";
import { LoginFormData } from "./loginSchema";
import { useState } from "react";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { handleRegistrationStepNavigation } from "@/helper/registrationNavigation";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/features/ui/authSlice";
import { useTranslate } from "@/hooks/useTranslate";
import { Box, Link } from "@mui/material";

export default function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const role = searchParams.get("role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslate();

  const carouselData: CarouselItem[] = [
    {
      image: "/auth/VerifyPopup.svg",
      title: t("verifyEmailTitle"),
      subtitle: t("verifyEmailSubTitle"),
    },
    {
      image: "/auth/VerifyDocuments.svg",
      title: t("verifyDocumentTitle"),
      subtitle: t("verifyDocumentSubTitle"),
    },
    {
      image: "/auth/Preferences.svg",
      title: t("preferencesTitle"),
      subtitle: t("preferencesSubTitle"),
    },
  ];

  const OnSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      setError(null);
      if (!role) {
        setError("Role is missing. Please try again.");
        setLoading(false);
        return;
      }
      const Role = role.toString().toUpperCase();

      // Dispatch loginUser thunk
      const result = await dispatch(
        loginUser({ ...data, role: Role }),
      ).unwrap();

      if (result) {
        const user = result.user;
        const registerStep = user.register_step;

        // If registration is complete, go to home
        if (
          registerStep === UserRegisterSteps.COMPLETED ||
          registerStep === UserRegisterSteps.PREFERENCES_ADDED
        ) {
          router.replace("/");
          return;
        }

        // Otherwise, redirect to the required registration step
        handleRegistrationStepNavigation(
          dispatch,
          router,
          registerStep as UserRegisterSteps,
        );
      }
    } catch (error: any) {
      setError(error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/selectRole");
  };

  return (
    <AuthCarouselWrapper
      carouselItems={carouselData}
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
          mb: { xs: 2, sm: 3 },
          mt: { xs: 6, lg: 8 },
        }}
      >
        <Link
          component={NextLink}
          href="/"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: 700,
            borderBottom: "1px solid",
          }}
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          {t("skip")}
        </Link>
      </Box>
      <LoginForm
        role={role || ""}
        onSubmit={OnSubmit}
        loading={loading}
        error={error}
      />
    </AuthCarouselWrapper>
  );
}
