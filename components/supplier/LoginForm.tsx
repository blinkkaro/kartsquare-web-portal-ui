"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Box, Typography, Stack, Link } from "@mui/material";
import Input from "@/components/common/Input";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/auth.service";
import { AppUserType } from "@/services/auth/auth.interface";
import Button from "../common/Button";
import { useTranslate } from "@/hooks/useTranslate";
import { secureStorage } from "@/helper/SecureStorage";

const LoginForm = () => {
  const router = useRouter();
  const { t } = useTranslate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .email(t("emailInvalid"))
      .lowercase()
      .max(255, t("valEmailMax"))
      .required(t("emailRequired")),
    password: yup
      .string()
      .trim()
      .max(100, t("valNameMax"))
      .required(t("passwordRequired")),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({
        ...data,
        role: AppUserType.SUPPLIER,
      });

      // Response type is ApiResponse<AuthResponse> so we access response.data
      if (response?.data?.tokens) {
        secureStorage.setItem("token", response.data.tokens.access_token);
        secureStorage.setItem(
          "refreshToken",
          response.data.tokens.refresh_token
        );
        secureStorage.setItem("user_details", response.data.user);
        secureStorage.setItem("role", response.data.user.role);

        router.push("/supplier/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || t("something_went_wrong"));
    } finally {
      setLoading(false);
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
      }}
    >
      <Typography
        variant="h4"
        fontWeight="700"
        mb={1}
        textAlign="center"
        fontSize={{ xs: "1.5rem", sm: "2rem" }}
      >
        {t("login") || "Login"}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        mb={4}
        textAlign="center"
        fontSize={{ xs: "0.875rem", sm: "1rem" }}
      >
        {t("login_subtitle") || "Enter your email & password to login"}
      </Typography>

      {error && (
        <Typography color="error" mb={2} textAlign="center">
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <Input
            name="email"
            control={control}
            label={t("email_address")}
            placeholder={t("email_address")}
            type="email"
          />
        </Box>
        <Box mb={1}>
          <Input
            name="password"
            control={control}
            label={t("password")}
            type="password"
            placeholder={t("password")}
          />
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Link
            href="/supplier/forgot-password"
            underline="hover"
            sx={{ fontSize: "0.875rem" }}
          >
            {t("forgot_password") || "Forgot Password?"}
          </Link>
        </Box>

        <Box mb={3}>
          <Button fullWidth type="submit" isLoading={loading} size="large">
            {t("login")}
          </Button>
        </Box>

        <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
          <Typography variant="body2">
            {t("no_account") || "Don't have an account?"}
          </Typography>
          <Link
            href="/supplier/register"
            underline="hover"
            sx={{ cursor: "pointer", fontWeight: 600 }}
          >
            {t("sign_up") || "Sign Up"}
          </Link>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginForm;
