"use client";
import React, { useState } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { changePasswordSchema } from "./changePasswordSchema";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { changePassService } from "@/services/auth/changePassword.service";
import { COLORS } from "@/constants/colors";
import ErrorMessage from "@/components/common/ErrorMessage";
import SuccessModel from "@/components/common/SuccessModel";

type ChangePasswordFormData = yup.InferType<
  ReturnType<typeof changePasswordSchema>
>;

const ChangePassword = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successModelOpen, setSuccessModelOpen] = useState(false);
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordSchema(t)),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setError("");
    try {
      await changePassService.changePassword(
        data.currentPassword,
        data.password,
      );
      setSuccessModelOpen(true);
    } catch (error: any) {
      setError(error.response.data.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "24px",
        boxShadow: COLORS.SHADOW.DEFAULT,
        position: "relative",
        p: 2,
      }}
    >
      <ErrorMessage error={error} isVisible={!!error} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* Old Password */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              mb={1}
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {t("oldPassword")}
            </Typography>
            <Input
              name="currentPassword"
              placeholder="* * * * * * * *"
              type="password"
              control={control}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              fullWidth
            />
          </Box>

          {/* New Password Section */}
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {t("newPassword")}
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  mb={1}
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {t("newPassword")}
                </Typography>
                <Input
                  name="password"
                  placeholder={t("enterNewPassword")}
                  type="password"
                  control={control}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              </Box>

              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  mb={1}
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {t("confirmNewPassword")}
                </Typography>
                <Input
                  name="confirmPassword"
                  placeholder={t("enterConfirmPassword")}
                  type="password"
                  control={control}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Box>
            </Stack>
          </Box>

          {/* Save Button */}
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              isLoading={isLoading}
              sx={{
                width: "150px", // Approximate width from design
                borderRadius: "30px",
              }}
            >
              {t("save") || "Save"}
            </Button>
          </Box>
        </Stack>
      </form>
      <SuccessModel
        open={successModelOpen}
        onClose={() => setSuccessModelOpen(false)}
        title={t("passwordChangedSuccessfully")}
        description={t("passwordChangedSuccessfullyDescription")}
        actionLabel={t("continue")}
        onAction={() => {
          setSuccessModelOpen(false);
          onClose();
        }}
      />
    </Box>
  );
};

export default ChangePassword;
