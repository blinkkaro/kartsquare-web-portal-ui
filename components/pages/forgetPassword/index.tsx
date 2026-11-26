"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import AuthWrapper from "@/components/auth/authWrapper";
import AuthHeader from "@/components/auth/AuthHeader";
import Title from "@/components/auth/title";
import { useTranslate } from "@/hooks/useTranslate";
import Error from "@/components/common/ErrorMessage";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { type TranslationKey } from "@/features/i18n/TranslationContext";
import { changePassService } from "@/services/auth/changePassword.service";
import { COLORS } from "@/constants/colors";
import { PASSWORD_RESET_EMAIL_KEY, roleQuery } from "@/utils/auth";
import { errorMessage } from "@/lib/http/errorMessage";

const getForgetPasswordSchema = (t: (key: TranslationKey) => string) =>
  yup.object({
    email: yup.string().email(t("emailInvalid")).required(t("emailRequired")),
  });

export interface ForgetPasswordInputs {
  email: string;
}

export default function ForgetPasswordView() {
  const { t } = useTranslate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const { control, handleSubmit } = useForm<ForgetPasswordInputs>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(getForgetPasswordSchema(t)),
  });

  const handleForgetPassword: SubmitHandler<ForgetPasswordInputs> = async (data) => {
    setLoading(true);
    setError("");
    try {
      await changePassService.forgotPassword(data.email);
      // The address goes to the next step through sessionStorage: in a URL it lands in history and server logs.
      sessionStorage.setItem(PASSWORD_RESET_EMAIL_KEY, data.email);
      router.push(`/resetPassword${roleQuery(role)}`);
    } catch (e) {
      setError(errorMessage(e, "An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper align="top">
      <AuthHeader showBack />
      <Title title={t("forgetPassword")} subtitle={t("forgetPasswordSubtitle")} />

      <Error isVisible={!!error} error={error} />
      <form onSubmit={handleSubmit(handleForgetPassword)} style={{ width: "100%" }}>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: "#374151" }}>
          {t("email_address")}*
        </Typography>
        <Input
          type="email"
          name="email"
          control={control}
          placeholder="arjun.sharma@mail.in"
          startIcon={<EmailIcon sx={{ color: COLORS.PRIMARY_PURPLE }} />}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
        <Button
          type="submit"
          isLoading={loading}
          disabled={loading}
          variant="contained"
          sx={{
            mt: 3,
            borderRadius: "12px",
            py: 1.8,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            fontWeight: 700,
            bgcolor: COLORS.PRIMARY_PURPLE,
            boxShadow: `0 8px 20px rgba(94, 24, 233, 0.25)`,
            "&:hover": {
              bgcolor: "#4c14c0",
              boxShadow: `0 10px 25px rgba(94, 24, 233, 0.35)`,
            },
          }}
          fullWidth
        >
          {t("forgetPasswordSubmit")}
        </Button>
      </form>
    </AuthWrapper>
  );
}
