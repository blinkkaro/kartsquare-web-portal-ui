import AuthWrapper from "@/components/auth/authWrapper";
import Title from "@/components/auth/title";
import { useTranslate } from "@/hooks/useTranslate";
import { createResetPasswordSchema, ResetPasswordFormData } from "./resetPasswordSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function ResetPasswordView() {
  const { t } = useTranslate();

  const { control, handleSubmit } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(createResetPasswordSchema(t)),
  });

  return (
    <AuthWrapper>
      <Title title={t("resetPassword")} subtitle={t("resetPasswordSubtitle")} />
      
      
    </AuthWrapper>
  );
}
