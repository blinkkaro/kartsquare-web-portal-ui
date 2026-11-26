"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { otpService } from "@/services/auth/otp.service";
import ErrorMessage from "@/components/common/ErrorMessage";
import Button from "@/components/common/Button";
import { COLORS } from "@/constants/colors";
import { formatTime } from "@/helper/helper";
import SuccessModel from "@/components/common/SuccessModel";
import { useAppDispatch } from "@/store/hooks";
import Title from "@/components/auth/title";
import { useTranslate } from "@/hooks/useTranslate";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthWrapper from "@/components/auth/authWrapper";
import { useLogout } from "@/hooks/useLogout";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { handleRegistrationStepNavigation } from "@/helper/registrationNavigation";
import { secureStorage } from "@/helper/SecureStorage";
import { SESSION_KEYS } from "@/utils/auth";
import { AppUserType } from "@/services/auth/auth.interface";
import { errorMessage } from "@/lib/http/errorMessage";
import OtpInput from "./components/otpInput";

function EmailVerificationView() {
  const { t } = useTranslate();
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resending, setResending] = useState<boolean>(false);
  const OTP_EXPIRY_KEY = "otp_expiry_timestamp";
  const [timeLeft, setTimeLeft] = useState<number>(59);
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { handleLogout } = useLogout();

  useEffect(() => {
    const now = Date.now();
    const storedExpiry = localStorage.getItem(OTP_EXPIRY_KEY);

    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const remaining = Math.ceil((expiryTime - now) / 1000);

      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        localStorage.removeItem(OTP_EXPIRY_KEY);
        setTimeLeft(0);
      }
    } else {
      const expiryTime = now + 59 * 1000;
      localStorage.setItem(OTP_EXPIRY_KEY, expiryTime.toString());
      setTimeLeft(59);
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      const storedExpiry = localStorage.getItem(OTP_EXPIRY_KEY);
      if (storedExpiry) {
        const expiryTime = parseInt(storedExpiry, 10);
        const remaining = Math.ceil((expiryTime - Date.now()) / 1000);
        setTimeLeft(remaining >= 0 ? remaining : 0);
      } else {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleResendOtp = async () => {
    try {
      setResending(true);
      setError("");
      await otpService.resendOTP();
      const now = Date.now();
      const expiryTime = now + 59 * 1000;
      localStorage.setItem(OTP_EXPIRY_KEY, expiryTime.toString());
      setTimeLeft(59);
    } catch (error) {
      setError(errorMessage(error, "An unexpected error occurred"));
    } finally {
      setResending(false);
    }
  };

  const OnSubmit = async (currentOtp?: string) => {
    const otpToVerify = typeof currentOtp === "string" ? currentOtp : otp;
    if (otpToVerify.length !== 6) return;

    try {
      setLoading(true);
      setError("");
      await otpService.verifyOtp(otpToVerify);
      localStorage.removeItem(OTP_EXPIRY_KEY);
      setOpenSuccessModal(true);
    } catch (error) {
      setError(errorMessage(error, "An unexpected error occurred"));
    } finally {
      setLoading(false);
    }
  };

  // Leaving registration signs the half-registered account out (one flow: useLogout).
  const handleBack = () => {
    const role = secureStorage.getItem(SESSION_KEYS.role);
    return handleLogout({
      redirectTo: role === AppUserType.CUSTOMER ? "/login?role=customer" : "/business-listing",
    });
  };

  const handleContinue = () => {
    handleRegistrationStepNavigation(dispatch, router, UserRegisterSteps.EMAIL_VERIFIED);
  };

  return (
    <AuthWrapper align="top">
      <AuthHeader showBack onBack={handleBack} />
      <Title title={t("email_verification")} subtitle={t("email_verification_subtitle")} />
      <ErrorMessage isVisible={!!error} error={error} />
      <Box
        component="form"
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          if (otp.length === 6) OnSubmit();
        }}
        sx={{ width: "100%" }}
      >
        <Box sx={{ my: 4 }}>
          <OtpInput onChange={setOtp} onEnter={OnSubmit} />
        </Box>

        <Button
          fullWidth
          variant="contained"
          type="submit"
          isLoading={loading}
          disabled={otp.length !== 6}
        >
          {t("verify")}
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        {timeLeft > 0 ? (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {formatTime(timeLeft)}
          </Typography>
        ) : (
          <Button
            variant="text"
            onClick={handleResendOtp}
            isLoading={resending}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: COLORS.PRIMARY_PURPLE,
            }}
          >
            {t("resend_otp")}
          </Button>
        )}
      </Box>
      <SuccessModel
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
        onAction={handleContinue}
        title={t("email_verification_success")}
        description={t("email_verification_success_description")}
      />
    </AuthWrapper>
  );
}

export default EmailVerificationView;
