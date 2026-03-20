import React, { useState } from "react";
import {
  Visibility,
  PlayArrow,
  CheckCircle,
  Cancel,
  Check,
  LockOutlined,
} from "@mui/icons-material";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Slide,
  useTheme,
  IconButton,
  Button,
} from "@mui/material";
import LogoLoader from "../../../common/Loader/LogoLoader";
import { TransitionProps } from "@mui/material/transitions";
import { UserBooking } from "../../../../services/booking/bookingInterface";
import { useTranslate } from "@/hooks/useTranslate";
import { bookingService } from "../../../../services/booking/bookingService";
import { useQueryClient } from "@tanstack/react-query";
import { COLORS } from "../../../../constants/colors";
import WarningModel from "@/components/common/WarningModel";

interface ProviderBookingActionButtonsProps {
  booking: UserBooking;
  tabName: string;
  onViewDetails: (booking: UserBooking) => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProviderBookingActionButtons: React.FC<
  ProviderBookingActionButtonsProps
> = ({ booking, tabName, onViewDetails }) => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [openWarningModal, setOpenWarningModal] = useState(false);

  const handleUpdateStatus = async (status: string, otpValue?: string) => {
    setLoading(true);
    try {
      await bookingService.updateBookingStatus(
        booking.booking_id,
        status,
        otpValue,
      );
      // Invalidate the query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      setOpenOtpDialog(false);
      setOtp("");
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !openOtpDialog) {
    return <LogoLoader size={24} />;
  }

  if (tabName === t("pending")) {
    return (
      <>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<Check />}
            onClick={() => handleUpdateStatus("CONFIRMED")}
            sx={{
              bgcolor: COLORS.PRIMARY_PURPLE,
              color: "white",
              textTransform: "none",
              borderRadius: "20px",
              px: 2,
              fontSize: "0.75rem",
              fontWeight: 600,
              "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
            }}
          >
            {t("accept")}
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Cancel />}
            onClick={() => setOpenWarningModal(true)}
            sx={{
              bgcolor: "#1F2937",
              color: "white",
              textTransform: "none",
              borderRadius: "20px",
              px: 2,
              fontSize: "0.75rem",
              fontWeight: 600,
              "&:hover": { bgcolor: "#111827" },
            }}
          >
            {t("decline")}
          </Button>
          <IconButton size="small" onClick={() => onViewDetails(booking)}>
            <Visibility fontSize="small" />
          </IconButton>
        </Box>
        <WarningModel
          open={openWarningModal}
          onClose={() => setOpenWarningModal(false)}
          title={t("cancel_booking_title")}
          description={t("cancel_booking_description")}
          ActionsButtons={
            <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setOpenWarningModal(false)}
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
                {t("no_keep_booking")}
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setOpenWarningModal(false);
                  handleUpdateStatus("CANCELLED");
                }}
                disabled={loading}
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#DC2626",
                  "&:hover": { bgcolor: "#B91C1C" },
                }}
              >
                {loading ? (
                  <LogoLoader size={24} />
                ) : (
                  t("yes_cancel")
                )}
              </Button>
            </Box>
          }
        />
      </>
    );
  }

  if (tabName === t("upcoming")) {
    return (
      <>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<PlayArrow />}
            onClick={() => setOpenOtpDialog(true)}
            sx={{
              bgcolor: COLORS.PRIMARY_PURPLE,
              color: "white",
              textTransform: "none",
              borderRadius: "20px",
              px: 2,
              fontSize: "0.75rem",
              fontWeight: 600,
              "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
            }}
          >
            {t("start")}
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Cancel />}
            onClick={() => setOpenWarningModal(true)}
            sx={{
              bgcolor: "#1F2937",
              color: "white",
              textTransform: "none",
              borderRadius: "20px",
              px: 2,
              fontSize: "0.75rem",
              fontWeight: 600,
              "&:hover": { bgcolor: "#111827" },
            }}
          >
            {t("decline")}
          </Button>
          <IconButton size="small" onClick={() => onViewDetails(booking)}>
            <Visibility fontSize="small" />
          </IconButton>
        </Box>

        <Dialog
          open={openOtpDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => !loading && setOpenOtpDialog(false)}
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
              <LockOutlined
                sx={{ fontSize: 40, color: COLORS.PRIMARY_PURPLE }}
              />
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
                  handleUpdateStatus("ACTIVE", otp);
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
                onClick={() => handleUpdateStatus("ACTIVE", otp)}
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
                ) : (
                  t("verify_and_start")
                )}
              </Button>
            </Box>
          </Box>
        </Dialog>
        <WarningModel
          open={openWarningModal}
          onClose={() => setOpenWarningModal(false)}
          title={t("cancel_booking_title")}
          description={t("cancel_booking_description")}
          ActionsButtons={
            <Box sx={{ width: "100%", display: "flex", gap: 2, mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setOpenWarningModal(false)}
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
                {t("no_keep_booking")}
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setOpenWarningModal(false);
                  handleUpdateStatus("CANCELLED");
                }}
                disabled={loading}
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#DC2626",
                  "&:hover": { bgcolor: "#B91C1C" },
                }}
              >
                {loading ? (
                  <LogoLoader size={24} />
                ) : (
                  t("yes_cancel")
                )}
              </Button>
            </Box>
          }
        />
      </>
    );
  }

  if (tabName === t("in_progress")) {
    return (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<CheckCircle />}
          onClick={() => handleUpdateStatus("COMPLETED")}
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            color: "white",
            textTransform: "none",
            borderRadius: "20px",
            px: 2,
            fontSize: "0.75rem",
            fontWeight: 600,
            "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
          }}
        >
          {t("mark_as_complete")}
        </Button>
        <IconButton size="small" onClick={() => onViewDetails(booking)}>
          <Visibility fontSize="small" />
        </IconButton>
      </Box>
    );
  }

  // Completed and Cancelled tabs only have View button
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <IconButton size="small" onClick={() => onViewDetails(booking)}>
        <Visibility fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default ProviderBookingActionButtons;
