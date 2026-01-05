"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
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

  const inputSx = {
    borderRadius: "12px",
    bgcolor: "background.paper",
    "& input:-webkit-autofill": {
      WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset`,
      WebkitTextFillColor: theme.palette.text.primary,
      caretColor: theme.palette.text.primary,
    },
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: "100%" }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 700, color: "text.primary" }}
        >
          {t("welcome_back")}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {t("login_subtitle")}
        </Typography>
      </Box>
      <ErrorMessage isVisible={!!error} error={error!} />
      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            {t("email_address")}
          </Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="masruqjaunhaik@mail.in"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined color="action" />
                    </InputAdornment>
                  ),
                  sx: inputSx,
                }}
              />
            )}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            {t("password")}
          </Typography>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="********"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: inputSx,
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Link
            href={`/forgot-password?role=${role}`}
            variant="body2"
            underline="hover"
            sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 600 }}
          >
            {t("forgot_password")}
          </Link>
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{
            py: 1.5,
            borderRadius: "25px",
            background: COLORS.PRIMARY_PURPLE,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 700,
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : t("login")}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          size="large"
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.5,
            borderRadius: "25px",
            borderColor:
              theme.palette.mode === "light"
                ? COLORS.BORDER.DEFAULT
                : COLORS.BORDER.HOVER,
            color: "text.primary",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
            bgcolor: "background.paper",
            "&:hover": {
              bgcolor: "action.hover",
              borderColor: "text.secondary",
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
            href="#"
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
