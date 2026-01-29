"use client";
import AuthWrapper from "@/components/auth/authWrapper";
import Title from "@/components/auth/title";
import { useTranslate } from "@/hooks/useTranslate";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { SignUpFormData } from "./signUpSchema";
import { registerUser } from "@/features/ui/authSlice";
import { AppUserType } from "@/services/auth/auth.interface";
import Error from "@/components/common/ErrorMessage";
import RegistrationForm from "./components/RegesitrationForm";
import { Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";

import { useAppDispatch } from "@/store/hooks";

function SignUpView() {
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const roleParam = searchParams.get("role")?.toUpperCase();
  const role: AppUserType = Object.values(AppUserType).includes(
    roleParam as AppUserType,
  )
    ? (roleParam as AppUserType)
    : AppUserType.CUSTOMER;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const OnSubmit = async (data: SignUpFormData) => {
    try {
      setLoading(true);
      setError("");

      const registerData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        country_code: data.country_code,
        password: data.password,
        gender: data.gender,
        country: data.country,
        role: role,
        birth_date: data.birth_date,
        whatsapp_number: data.whatsapp_number || "",
        whatsapp_country_code: data.whatsapp_country_code || "",
      };

      await dispatch(registerUser(registerData)).unwrap();
      // Redirect to email verification immediately after successful signup
      router.replace("/emailVerfication");
    } catch (error: any) {
      setError(error || "An unexpected error occurred");
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
      <Title title={t("signUp")} subtitle={t("signUpSubtitle")} />
      <Error isVisible={!!error} error={error} />
      <RegistrationForm onSubmit={OnSubmit} loading={loading} role={role} />
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
