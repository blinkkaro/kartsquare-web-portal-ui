"use client";
import AuthWrapper from "@/components/auth/authWrapper";
import AuthHeader from "@/components/auth/AuthHeader";
import Title from "@/components/auth/title";
import { useTranslate } from "@/hooks/useTranslate";
import ResetPassForm from "./component/ResetPassForm";
import { ResetPasswordFormData } from "./resetPasswordSchema";
import { changePassService } from "@/services/auth/changePassword.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function ResetPasswordView() {
  const { t } = useTranslate();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "";
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setErrorMessage("");
    try {
      await changePassService.resetPassword(email, data.password, data.code);
      router.push("/login?role=" + role);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper align="top">
      <AuthHeader showBack />
      <Title title={t("resetPassword")} subtitle={t("resetPasswordSubtitle")} />
      <ErrorMessage isVisible={!!errorMessage} error={errorMessage} />
      <ResetPassForm onSubmit={onSubmit} loading={loading} />
    </AuthWrapper>
  );
}
