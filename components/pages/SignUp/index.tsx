"use client";
import AuthWrapper from "@/components/auth/authWrapper";
import Title from "@/components/auth/title";
import { useTranslate } from "@/hooks/useTranslate";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SignUpFormData } from "./signUpSchema";
import { authService } from "@/services/auth/auth.service";
import { AppUserType } from "@/services/auth/auth.interface";
import Error from "@/components/common/ErrorMessage";
import RegistrationForm from "./components/RegesitrationForm";
import { Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";

function SignUpView() {
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const OnSubmit = async (data: SignUpFormData) => {
    try {
      setLoading(true);
      setError("");
      const Role = role!.toString().toUpperCase();
      await authService.signUp({ ...data, role: Role as AppUserType });
      // Redirect to email verification immediately after successful signup
      router.replace("/emailVerfication");
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthWrapper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
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
        >
          {t("skip")}
        </Link>
      </Box>
      <Title title={t("signUp")} subtitle={t("signUpSubtitle")} />
      <Error isVisible={!!error} error={error} />
      <RegistrationForm onSubmit={OnSubmit} loading={loading} />
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Already have an account?
        </Typography>
        <Link
          component={NextLink}
          href={`/login?role=${role}`}
          style={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: 700,
            borderBottom: "1px solid",
          }}
        >
          Login
        </Link>
      </Box>
    </AuthWrapper>
  );
}

export default SignUpView;
