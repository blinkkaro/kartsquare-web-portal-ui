"use client";
"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Stack,
  useTheme,
} from "@mui/material";
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
      <Title title={t("welcome_back")} subtitle={t("login_subtitle")} />
      <ErrorMessage isVisible={!!error} error={error!} />
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
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
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
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
          <Link
            href={`/forgotPassword?role=${role}`}
            variant="body2"
            underline="hover"
            sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 600 }}
          >
            {t("forgot_password")}
          </Link>
        </Box>

        <Button isLoading={loading} onClick={handleSubmit(onSubmit)}>
          {t("login")}
        </Button>

        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{
            bgcolor: COLORS.DARK,
            color: "white",
            textTransform: "none",
            borderRadius: "50px",
            padding: "10px 30px",
            "&:hover": {
              bgcolor: COLORS.DARK,
            },
          }}
        >
          {t("continue_with_google")}
        </Button>
      </Stack>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {t("no_account")}
          <Link
            href={`/signUp?role=${role}`}
            sx={{ ml: 1, fontWeight: 700, color: "text.primary" }}
            underline="hover"
          >
            {t("sign_up")}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
