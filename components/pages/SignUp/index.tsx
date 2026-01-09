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
          mb: { xs: 2, sm: 3 },
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
      <Title title={t("signUp")} subtitle={t("signUpSubtitle")} />
      <Error isVisible={!!error} error={error} />
      <RegistrationForm onSubmit={OnSubmit} loading={loading} />
      <Box
        sx={{
          mt: { xs: 3, sm: 4 },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            fontSize: { lg: "0.875rem", xl: "1rem" },
          }}
        >
          {t("alreadyHaveAnAccount")}
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
          sx={{
            fontSize: { lg: "0.875rem", xl: "1rem" },
          }}
        >
          {t("login")}
        </Link>
      </Box>
    </AuthWrapper>
  );
}

export default SignUpView;
