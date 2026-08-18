"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  Stack,
  Link,
  useTheme,
  Button as MuiButton,
} from "@mui/material";
import Input from "@/components/common/Input";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth/auth.service";
import Button from "../common/Button";
import { useTranslate } from "@/hooks/useTranslate";
import { secureStorage } from "@/helper/SecureStorage";

const OTPVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { t } = useTranslate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);

  const schema = yup.object().shape({
    code: yup
      .string()
      .trim()
      .required(t("codeRequired") || "Code is required")
      .min(4, t("codeMin") || "Code must be at least 4 chars")
      .max(6, t("valOtpMax") || "Code max 6 digits"), // Assuming 4 or 6 digits
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (!email) {
      setError(t("emailRequired"));
    }

    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [email, resendTimer, t]);

  const onSubmit = async (data: any) => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const response = await authService.verifyOtp({
        email,
        otp: data.code,
      });

      if (response?.data?.tokens) {
        secureStorage.setItem("token", response.data.tokens.access_token);
        secureStorage.setItem(
          "refreshToken",
          response.data.tokens.refresh_token,
        );
        secureStorage.setItem("user_details", response.data.user);
        secureStorage.setItem("role", response.data.user.role);

        // Redirect to onboarding
        router.push("/supplier/onboarding");
      } else {
        // Fallback if auto-login not happened but verification success
        router.push("/supplier/login");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || t("something_went_wrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      setResendTimer(30);
      await authService.resendOtp(email);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "500px",
        mx: "auto",
        p: { xs: 2, sm: 4 },
        borderRadius: 2,
        boxShadow: { xs: "none", sm: "0px 4px 20px rgba(0,0,0,0.1)" },
        bgcolor: "background.paper",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="700"
        mb={2}
      >
        {t("email_verification") || "Verify Email"}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        mb={4}
        fontSize={{ xs: "0.875rem", sm: "1rem" }}
      >
        {t("email_verification_subtitle") || "Enter OTP sent to"} {email}
      </Typography>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={3} sx={{ maxWidth: "200px", mx: "auto" }}>
          <Input
            autoFocus
            name="code"
            control={control}
            label={t("enter_code") || "Enter Code"}
            placeholder="123456"
            inputProps={{
              style: { textAlign: "center", letterSpacing: "0.5em" },
            }}
          />
        </Box>

        <Button fullWidth type="submit" isLoading={loading} size="large">
          {t("verify_now") || "Verify Now"}
        </Button>
      </form>

      <Box mt={3}>
        <Typography variant="body2" color="text.secondary">
          Didn't receive code?{" "}
          <MuiButton
            onClick={handleResend}
            disabled={resendTimer > 0}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : t("resend_otp") || "Resend"}
          </MuiButton>
        </Typography>
      </Box>

      <Box mt={2}>
        <Link
          href="/supplier/register"
          underline="hover"
          sx={{ fontSize: "0.875rem" }}
        >
          Change Email?
        </Link>
      </Box>
    </Box>
  );
};

export default OTPVerification;
