"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import Input from "../../../common/Input";
import Button from "../../../common/Button";
import {
  ResetPasswordFormData,
  createResetPasswordSchema,
} from "../resetPasswordSchema";
import { useTranslate } from "@/hooks/useTranslate";

const ResetPassForm: React.FC<{
  onSubmit: (data: ResetPasswordFormData) => void;
  loading: boolean;
}> = ({ onSubmit, loading }) => {
  const { t } = useTranslate();
  const { control, handleSubmit } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(createResetPasswordSchema(t)),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Input
        name="code"
        label={t("code")}
        type="number"
        control={control}
        aria-disabled
        sx={{
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              WebkitAppearance: "none",
              margin: 0,
            },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        }}
      />
      <Input
        name="password"
        label={t("newPassword")}
        type="password"
        control={control}
      />

      <Input
        name="confirmPassword"
        label={t("confirmPassword")}
        type="password"
        control={control}
      />

      <Button type="submit" variant="contained" fullWidth isLoading={loading}>
        {t("resetPassword")}
      </Button>
    </Box>
  );
};

export default ResetPassForm;
