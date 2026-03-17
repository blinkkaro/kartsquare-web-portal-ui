"use client";

import React from "react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Slide,
  useTheme,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { LockOutlined } from "@mui/icons-material";
import type { TransitionProps } from "@mui/material/transitions";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { BookingStatus } from "@/services/booking/bookingInterface";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function OtpDiaBox({
  openOtpDialog,
  setOpenOtpDialog,
  otp,
  setOtp,
  loading,
  handleUpdateStatus,
}: {
  openOtpDialog: boolean;
  setOpenOtpDialog: (open: boolean) => void;
  otp: string;
  setOtp: (otp: string) => void;
  loading: boolean;
  handleUpdateStatus: (status: BookingStatus, otpValue: string) => void;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();
  const handleClose = () => {
    setOpenOtpDialog(false);
    setOtp("");
  };
  return (
    <Dialog
      open={openOtpDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => !loading && handleClose()}
      PaperProps={{
        sx: {
          borderRadius: "24px",
          padding: { xs: "2rem 1.5rem", sm: "2rem 4rem" },
          maxWidth: "28rem",
          width: "100%",
          boxShadow: "0px 10px 40px rgba(0,0,0,0.1)",
          margin: "16px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 1.5,
        }}
      >
        {/* Security Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: `${COLORS.PRIMARY_PURPLE}10`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <LockOutlined sx={{ fontSize: 40, color: COLORS.PRIMARY_PURPLE }} />
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "text.primary" }}
        >
          {t("otp_verification")}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 2, px: 2 }}
        >
          {t("enter_otp_description")}
        </Typography>

        <TextField
          autoFocus
          placeholder="Enter 6-digit Code"
          fullWidth
          variant="outlined"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && otp.length === 6) {
              handleUpdateStatus(BookingStatus.ACTIVE, otp);
            }
          }}
          disabled={loading}
          inputProps={{
            maxLength: 6,
            style: {
              textAlign: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
              letterSpacing: "8px",
              padding: "12px",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
              "& fieldset": {
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB",
              },
              "&.Mui-focused fieldset": {
                borderColor: COLORS.PRIMARY_PURPLE,
                borderWidth: "2px",
              },
              "& input::placeholder": {
                fontSize: "0.875rem",
                letterSpacing: "normal",
                fontWeight: 500,
                opacity: 0.5,
              },
            },
            mb: 3,
          }}
        />

        <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setOpenOtpDialog(false)}
            disabled={loading}
            sx={{
              borderRadius: "12px",
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB",
              color: isDark ? "white" : "#4B5563",
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleUpdateStatus(BookingStatus.ACTIVE, otp)}
            disabled={loading || otp.length < 6}
            sx={{
              borderRadius: "12px",
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: COLORS.PRIMARY_PURPLE,
              "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
            }}
          >
            {loading ? (
              <LogoLoader size={24} />
            ) : status === "ACTIVE" ? (
              t("verify_and_start")
            ) : (
              t("verify")
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default OtpDiaBox;
