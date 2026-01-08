"use client";
import AuthWrapper from "@/components/auth/authWrapper";
import React from "react";
import { useTranslate } from "@/hooks/useTranslate";
import Title from "@/components/auth/title";
import OtpInput from "./components/otpInput";
import { useState, useEffect } from "react";
import { otpService } from "@/services/auth/otp.service";
import ErrorMessage from "@/components/common/ErrorMessage";
import Button from "@/components/common/Button";
import { Box, Typography } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { formatTime } from "@/helper/helper";
import SuccessModel from "@/components/common/SuccessModel";
import BackButton from "@/components/common/BackButton";

function EmailVerificationView() {
  const { t } = useTranslate();
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resending, setResending] = useState<boolean>(false);
  const OTP_EXPIRY_KEY = "otp_expiry_timestamp";
  const [timeLeft, setTimeLeft] = useState<number>(59);
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);

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
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const OnSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      await otpService.verifyOtp(otp);
      localStorage.removeItem(OTP_EXPIRY_KEY);
      setOpenSuccessModal(true);
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 10 }}>
        <BackButton />
      </Box>
      <Title
        title={t("email_verification")}
        subtitle={t("email_verification_subtitle")}
      />
      <ErrorMessage isVisible={!!error} error={error} />
      <Box sx={{ my: 4 }}>
        <OtpInput onChange={setOtp} />
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={OnSubmit}
        isLoading={loading}
        disabled={otp.length !== 6}
      >
        Verify
      </Button>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        {timeLeft > 0 ? (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: COLORS.TEXT_DARK,
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
            Resend OTP
          </Button>
        )}
      </Box>
      <SuccessModel open={openSuccessModal} onClose={() => setOpenSuccessModal(false)} title={t("email_verification_success")} description={t("email_verification_success_description")}/>
    </AuthWrapper>
  );
}

export default EmailVerificationView;
