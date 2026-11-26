"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthWrapper from "@/components/auth/authWrapper";
import AuthHeader from "@/components/auth/AuthHeader";
import Title from "@/components/auth/title";
import { useTranslate } from "@/hooks/useTranslate";
import { changePassService } from "@/services/auth/changePassword.service";
import ErrorMessage from "@/components/common/ErrorMessage";
import { PASSWORD_RESET_EMAIL_KEY, roleQuery } from "@/utils/auth";
import { errorMessage as apiErrorMessage } from "@/lib/http/errorMessage";
import { type ResetPasswordFormData } from "./resetPasswordSchema";
import ResetPassForm from "./component/ResetPassForm";

export default function ResetPasswordView() {
  const { t } = useTranslate();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  // From /forgotPassword via sessionStorage; `?email=` only for links made before that change.
  const [email] = useState(
    () =>
      (typeof window !== "undefined" && sessionStorage.getItem(PASSWORD_RESET_EMAIL_KEY)) ||
      searchParams.get("email") ||
      "",
  );

  useEffect(() => {
    if (!email) router.replace(`/forgotPassword${roleQuery(role)}`);
  }, [email, role, router]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    setErrorMessage("");
    try {
      await changePassService.resetPassword(email, data.password, data.code);
      sessionStorage.removeItem(PASSWORD_RESET_EMAIL_KEY);
      router.replace(`/login${roleQuery(role)}`);
    } catch (error) {
      setErrorMessage(apiErrorMessage(error, "Failed to reset password"));
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
