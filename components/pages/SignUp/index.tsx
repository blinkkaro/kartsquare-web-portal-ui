"use client";
import AuthWrapper from "@/components/auth/authWrapper";
import Title from "@/components/auth/title";
import { useTranslate } from "@/hooks/useTranslate";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { SignUpFormData } from "./signUpSchema";
import { registerUser } from "@/features/ui/authSlice";
import { AppUserType, RegisterData } from "@/services/auth/auth.interface";
import Error from "@/components/common/ErrorMessage";
import RegistrationForm from "./components/RegesitrationForm";
import { Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";

import { useAppDispatch } from "@/store/hooks";
import { useLeadVerification } from "@/hooks/useLeadVerification";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { secureStorage } from "@/helper/SecureStorage";

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

  const [busLeadId, setBusLeadId] = useState<string | null>(null);
  const { leadDetailsQuery } = useLeadVerification(busLeadId);
  const [initialData, setInitialData] = useState<Partial<RegisterData>>({});

  const token = secureStorage.getItem("token");

  const { data: registerDetails } = useQuery({
    queryKey: ["registerDetails"],
    queryFn: () => authService.getRegisterDetails(),
    enabled: !!token,
  });

  useEffect(() => {
    if (registerDetails) {
      setInitialData((prev) => ({
        ...prev,
        ...registerDetails,
      }));
    }
  }, [registerDetails]);

  useEffect(() => {
    if (role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER) {
      const busLeadId = sessionStorage.getItem("bus_lead_id");
      if (!busLeadId) {
        router.replace("/freeListing");
        return;
      }
      setBusLeadId(busLeadId);
    }
  }, [role, router]);

  useEffect(() => {
    if (leadDetailsQuery.data) {
      setInitialData((prev) => ({
        ...prev,
        whatsapp_number: leadDetailsQuery.data.whatsapp_number || "",
        whatsapp_country_code:
          leadDetailsQuery.data.whatsapp_country_code || "",
      }));
    }
    if (leadDetailsQuery.isError) {
      console.error("Failed to fetch lead info", leadDetailsQuery.error);
      router.replace("/freeListing");
    }
  }, [
    leadDetailsQuery.data,
    leadDetailsQuery.isError,
    leadDetailsQuery.error,
    router,
  ]);

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
      setError(
        typeof error === "string"
          ? error
          : error?.message || "An unexpected error occurred",
      );
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
      <RegistrationForm
        onSubmit={OnSubmit}
        loading={
          loading ||
          ((role === AppUserType.SERVICE_PROVIDER ||
            role === AppUserType.SUPPLIER) &&
            leadDetailsQuery.isLoading)
        }
        role={role}
        initialData={initialData}
      />
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
