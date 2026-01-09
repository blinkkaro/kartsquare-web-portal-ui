"use client";
"use client";

import React, { useState } from "react";
import { Box, Typography, IconButton, Stack, useTheme } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  Google as GoogleIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import { LoginSchema } from "../loginSchema";
import { LoginFormData } from "../loginSchema";
import ErrorMessage from "@/components/common/ErrorMessage";
import Title from "@/components/auth/title";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

export default function LoginForm({
  role,
  onSubmit,
  loading,
  error,
}: {
  role: string;
  onSubmit: (data: LoginFormData) => void;
  loading: boolean;
  error: string | null;
}) {
  const { t } = useTranslate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: "100%" }}
    >
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 } }}>
        <Title title={t("welcome_back")} subtitle={t("login_subtitle")} />
      </Box>
      <ErrorMessage isVisible={!!error} error={error!} />
      <Stack spacing={{ xs: 2, sm: 3, lg: 2, xl: 3}}>
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1,
              fontWeight: 600,
              fontSize: {
                lg: "0.875rem",
                xl: "1rem",
              },
            }}
          >
            {t("email_address")}
          </Typography>
          <Input
            name="email"
            control={control}
            fullWidth
            placeholder="masruqjaunhaik@mail.in"
            startIcon={<EmailOutlined color="action" />}
          />
        </Box>

        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 1,
              fontWeight: 600,
              fontSize: {
                lg: "0.875rem",
                xl: "1rem",
              },
            }}
          >
            {t("password")}
          </Typography>
          <Input
            name="password"
            control={control}
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="********"
            startIcon={<LockOutlined color="action" />}
            endIcon={
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Link href={`/forgotPassword?role=${role}`}>
            <Typography
              variant="body2"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: { lg: "0.875rem", xl: "1rem" },
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("forgot_password")}
            </Typography>
          </Link>
        </Box>

        <Button isLoading={loading} onClick={handleSubmit(onSubmit)}>
          {t("login")}
        </Button>

        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{
            bgcolor: theme.palette.mode === "light" ? COLORS.DARK : "grey.800",
            color: "common.white",
            textTransform: "none",
            borderRadius: "50px",
            "&:hover": {
              bgcolor:
                theme.palette.mode === "light" ? COLORS.DARK : "grey.900",
            },
          }}
        >
          {t("continue_with_google")}
        </Button>
      </Stack>

      <Box sx={{ mt: { xs: 3, sm: 4 }, textAlign: "center" }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { lg: "0.875rem", xl: "1rem" } }}
        >
          {t("no_account")}
          <Link href={`/signUp?role=${role}`}>
            <Typography
              component="span"
              sx={{
                ml: 1,
                fontWeight: 700,
                color: "text.primary",
                textDecoration: "none",
                fontSize: { lg: "0.875rem", xl: "1rem" },
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("sign_up")}
            </Typography>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
