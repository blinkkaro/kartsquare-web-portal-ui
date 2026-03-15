import React, { useState } from "react";
import { Box, Typography, useTheme, Chip, Divider } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { BookingStatus } from "@/services/booking/bookingInterface";
import {
  AccessTime,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  ArrowForwardIos,
} from "@mui/icons-material";
import Button from "./Button";
import { useTranslate } from "@/hooks/useTranslate";
import { useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking/bookingService";
import ProviderBookingDetailsDrawer from "@/components/pages/provider/bookings/ProviderBookingDetailsDrawer";
import BookingDetailsDrawer from "@/components/pages/bookings/BookingDetailsDrawer";
import OtpDiaBox from "@/components/pages/dashboard/components/otpDiaBox";
import WarningModel from "./WarningModel";
import { service_address } from "@/services/providerDashboard/providerDashboard.interface";
import { formatAddress } from "@/helper/helper";

interface booking {
  booking_id: string;
  currency: string;
  name: string;
  image: string;
  status: BookingStatus;
  price: number;
  time: string;
  service_address: service_address;
}

interface BookingStatusCardProps {
  booking: booking;
  onActionClick?: (action: string, bookingId: string) => void;
  isProvider?: boolean; // To differentiate between customer and provider views
  showStatus?: boolean;
}

const BookingStatusCard: React.FC<BookingStatusCardProps> = ({
  booking,
  onActionClick,
  isProvider = false,
  showStatus = true,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();
  const queryClient = useQueryClient();

  // Internal state for dialogs and drawers
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Handle booking status update
  const handleUpdateStatus = async (
    id: string,
    status: string,
    otpValue?: string,
  ) => {
    setLoading(true);
    try {
      await bookingService.updateBookingStatus(id, status, otpValue);
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["provider-dashboard"] });
      setOpenOtpDialog(false);
      setOtp("");
      setIsCancelDialogOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get status color and icon
  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.ACTIVE:
        return {
          color: "#4e4dff",
          borderColor: "#4e4dff",
          label: "Active",
          icon: <AccessTime sx={{ fontSize: 14 }} />,
        };
      case BookingStatus.PENDING:
        return {
          color: "#ffc74d",
          borderColor: "#ffc74d",
          label: "Upcoming",
          icon: <HourglassEmpty sx={{ fontSize: 14 }} />,
        };
      case BookingStatus.CONFIRMED:
        return {
          color: "#4e4dff",
          borderColor: "#4e4dff",
          label: "Confirmed",
          icon: <CheckCircle sx={{ fontSize: 14 }} />,
        };
      case BookingStatus.COMPLETED:
        return {
          color: "#33d198",
          borderColor: "#33d198",
          label: "Completed",
          icon: <CheckCircle sx={{ fontSize: 14 }} />,
        };
      case BookingStatus.CANCELLED:
        return {
          color: "#ff5757",
          borderColor: "#ff5757",
          label: "Cancelling",
          icon: <Cancel sx={{ fontSize: 14 }} />,
        };
      default:
        return {
          color: COLORS.TEXT.SECONDARY_LIGHT,
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)",
          label: status,
          icon: null,
        };
    }
  };

  const statusConfig = getStatusConfig(booking.status);

  // Get action buttons based on status
  const getActionButtons = () => {
    switch (booking.status) {
      case BookingStatus.ACTIVE:
        if (isProvider) {
          return (
            <Button
              variant="contained"
              // fullWidth
              onClick={(e) => {
                e.stopPropagation();
                if (onActionClick) {
                  onActionClick(BookingStatus.COMPLETED, booking.booking_id);
                } else {
                  handleUpdateStatus(
                    booking.booking_id,
                    BookingStatus.COMPLETED,
                  );
                }
              }}
            >
              {t("complete")}
            </Button>
          );
        } else {
          return null;
          // return (
          //   <Button
          //     variant="contained"
          //     // fullWidth
          //     onClick={(e) => {
          //       e.stopPropagation();
          //       if (onActionClick) {
          //         onActionClick(BookingStatus.COMPLETED, booking.booking_id);
          //       } else {
          //         handleUpdateStatus(
          //           booking.booking_id,
          //           BookingStatus.COMPLETED,
          //         );
          //       }
          //     }}
          //   >
          //     {t("complete")}
          //   </Button>
          // );
        }

      case BookingStatus.PENDING:
        if (isProvider) {
          return (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onActionClick) {
                    onActionClick(BookingStatus.CONFIRMED, booking.booking_id);
                  } else {
                    handleUpdateStatus(
                      booking.booking_id,
                      BookingStatus.CONFIRMED,
                    );
                  }
                }}
              >
                {t("confirm")}
              </Button>
              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onActionClick) {
                    onActionClick(BookingStatus.CANCELLED, booking.booking_id);
                  } else {
                    setIsCancelDialogOpen(true);
                  }
                }}
                sx={{
                  textTransform: "none",
                  py: 1,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: COLORS.PRIMARY_PURPLE,
                    bgcolor: COLORS.PURPLE_ALPHA_04,
                  },
                }}
              >
                {t("cancel")}
              </Button>
            </Box>
          );
        } else {
          // Customer Pending View - Default to just Cancel
          return (
            <Button
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                if (onActionClick) {
                  onActionClick(BookingStatus.CANCELLED, booking.booking_id);
                } else {
                  setIsCancelDialogOpen(true);
                }
              }}
              sx={{
                textTransform: "none",
                py: 1,
                fontWeight: 600,
                "&:hover": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                  bgcolor: COLORS.PURPLE_ALPHA_04,
                },
              }}
            >
              {t("cancel")}
            </Button>
          );
        }
      case BookingStatus.CONFIRMED:
        if (isProvider) {
          return (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onActionClick) {
                    onActionClick(BookingStatus.ACTIVE, booking.booking_id);
                  } else {
                    setOpenOtpDialog(true);
                  }
                }}
              >
                {t("start")}
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: isDark
                    ? COLORS.BORDER.DEFAULT_DARK
                    : COLORS.BORDER.DEFAULT_LIGHT,
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                  textTransform: "none",
                  py: 1,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: COLORS.PRIMARY_PURPLE,
                    bgcolor: COLORS.PURPLE_ALPHA_04,
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onActionClick) {
                    onActionClick(BookingStatus.CANCELLED, booking.booking_id);
                  } else {
                    setIsCancelDialogOpen(true);
                  }
                }}
              >
                {t("cancel")}
              </Button>
            </Box>
          );
        } else {
          // Customer Confirmed (Upcoming) View
          return (
            <Box sx={{ display: "flex", gap: 1 }}>
              {/* Reschedule button could go here if implemented, or just View Details */}
              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onActionClick) {
                    onActionClick(BookingStatus.CANCELLED, booking.booking_id);
                  } else {
                    setIsCancelDialogOpen(true);
                  }
                }}
                sx={{
                  textTransform: "none",
                  py: 1,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: COLORS.PRIMARY_PURPLE,
                    bgcolor: COLORS.PURPLE_ALPHA_04,
                  },
                }}
              >
                {t("cancel")}
              </Button>
            </Box>
          );
        }
      case BookingStatus.COMPLETED:
        return null;
      case BookingStatus.CANCELLED:
        // No action buttons for cancelled bookings
        return null;
      default:
        return null;
    }
  };

  // Format date
  const formatBookingDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: isDark
            ? COLORS.BACKGROUND.PAPER_DARK
            : COLORS.BACKGROUND.PAPER_LIGHT,
          p: { xs: 2, sm: 2.5 },
          borderRadius: "16px",
          boxShadow: isDark
            ? "0px 4px 20px rgba(0, 0, 0, 0.4)"
            : "0px 4px 16px rgba(0, 0, 0, 0.05)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: isDark
              ? "0px 8px 30px rgba(0, 0, 0, 0.6)"
              : "0px 8px 24px rgba(0, 0, 0, 0.1)",
            borderColor: COLORS.PRIMARY_PURPLE,
          },
        }}
        onClick={() => setIsDrawerOpen(true)}
      >
        {/* Header with ID and Status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
              fontWeight: 600,
              fontFamily: 'monospace',
            }}
          >
            #{booking.booking_id.substring(0, 8).toUpperCase()}
          </Typography>
          {showStatus && (
            <Chip
              {...(statusConfig.icon && { icon: statusConfig.icon })}
              label={statusConfig.label}
              size="small"
              sx={{
                bgcolor: `${statusConfig.color}15`,
                border: `1px solid ${statusConfig.borderColor}30`,
                color: statusConfig.color,
                fontWeight: 700,
                fontSize: "10px",
                height: "24px",
                textTransform: "uppercase",
                "& .MuiChip-icon": {
                  color: statusConfig.color,
                },
              }}
            />
          )}
        </Box>

        {/* Service Info with Image */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box
            component="img"
            src={booking.image || "/placeholder-service.png"}
            alt={booking.name}
            sx={{
              width: { xs: 60, sm: 70 },
              height: { xs: 60, sm: 70 },
              borderRadius: "12px",
              objectFit: "cover",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : COLORS.BORDER.DEFAULT_LIGHT}`,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: "15px", sm: "16px" },
                fontWeight: 700,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                mb: 0.5,
                lineHeight: 1.2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {booking.name}
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
            >
              <AccessTime
                sx={{
                  fontSize: 14,
                  color: COLORS.PRIMARY_PURPLE,
                }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: isDark
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                }}
              >
                {formatBookingDate(booking.time)}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "12px",
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {formatAddress(booking.service_address, t)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5, opacity: isDark ? 0.1 : 0.5 }} />

        {/* Footer with Price and Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            {booking.price === 0 ? (
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: COLORS.PRIMARY_PURPLE,
                }}
              >
                {t("getQuote")}
              </Typography>
            ) : (
              <>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                  }}
                >
                  {booking.currency}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {booking.price}
                </Typography>
              </>
            )}
          </Box>
          <Box sx={{ ml: "auto" }}>
            {getActionButtons()}
          </Box>
        </Box>
      </Box>
      {/* Booking Details Drawer */}
      {isProvider ? (
        <ProviderBookingDetailsDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          booking_id={booking.booking_id}
        />
      ) : (
        <BookingDetailsDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          booking={
            {
              ...booking,
              service_currency: booking.currency,
              service_images: [booking.image],
              service_price: booking.price,
              booking_at: booking.time,
              service_name: booking.name,
            } as any
          }
        />
      )}
      {/* OTP Dialog */}
      <OtpDiaBox
        openOtpDialog={openOtpDialog}
        setOpenOtpDialog={setOpenOtpDialog}
        otp={otp}
        setOtp={setOtp}
        loading={loading}
        handleUpdateStatus={(status, otpValue) =>
          handleUpdateStatus(booking.booking_id, status, otpValue)
        }
      />
      {/* Cancel Warning Dialog */}
      <WarningModel
        open={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        title={t("cancel_booking_title")}
        description={t("cancel_booking_description")}
        ActionsButtons={
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                setIsCancelDialogOpen(false);
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "error.main",
                "&:hover": { bgcolor: "error.dark" },
              }}
              loading={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(booking.booking_id, BookingStatus.CANCELLED);
              }}
            >
              {t("confirm")}
            </Button>
          </Box>
        }
      />
    </>
  );
};

export default BookingStatusCard;
