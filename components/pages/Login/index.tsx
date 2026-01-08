"use client";

import LoginForm from "./components/LoginForm";
import { useRouter, useSearchParams } from "next/navigation";
import AuthWrapper from "@/components/auth/authWrapper";
import { LoginFormData } from "./loginSchema";
import { authService } from "@/services/auth/auth.service";
import { useState } from "react";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { handleRegistrationStepNavigation } from "@/helper/registrationNavigation";
import { useAppDispatch } from "@/store/hooks";

export default function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const role = searchParams.get("role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const response = await authService.login({ ...data, role: Role });

      if (response && response.status === "success") {
        const user = response.data.user;
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
          registerStep as UserRegisterSteps
        );
      }
    } catch (error: any) {
      console.log(error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <LoginForm
        role={role || ""}
        onSubmit={OnSubmit}
        loading={loading}
        error={error}
      />
    </AuthWrapper>
  );
}
