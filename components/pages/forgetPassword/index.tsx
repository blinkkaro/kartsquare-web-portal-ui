"use client";

import AuthWrapper from "@/components/auth/authWrapper";
import Title from "@/components/auth/title";
import { useTranslate } from "@/hooks/useTranslate";
import { useState } from "react";
import Error from "@/components/common/ErrorMessage";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePassService } from "@/services/auth/changePassword.service";

const getForgetPasswordSchema = (t: (key: TranslationKey) => string) =>
  yup.object({
    email: yup.string().email(t("emailInvalid")).required(t("emailRequired")),
  });

export type ForgetPasswordInputs = {
  email: string;
};

export default function ForgetPasswordView() {
  const { t } = useTranslate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const { control, handleSubmit } = useForm<ForgetPasswordInputs>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(getForgetPasswordSchema(t)),
  });

  const handleForgetPassword: SubmitHandler<ForgetPasswordInputs> = async (
    data
  ) => {
    setLoading(true);
    setError("");
    try {
        await changePassService.forgotPassword(data.email);
    } catch (e: any) {
      setError(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <Title
        title={t("forgetPassword")}
        subtitle={t("forgetPasswordSubtitle")}
      />
      <Error isVisible={!!error} error={error} />
      <form
        onSubmit={handleSubmit(handleForgetPassword)}
        style={{ width: "100%" }}
      >
        <Input
          label={t("email_address")}
          type="email"
          name="email"
          control={control}
        />
        <Button type="submit" loading={loading} disabled={loading} sx={{ mt: 3 }} fullWidth>
          {t("forgetPassword")}
        </Button>
      </form>
    </AuthWrapper>
  );
}
