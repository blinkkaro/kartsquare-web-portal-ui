import React, { useState } from "react";
import { Box, Typography, useTheme, Chip } from "@mui/material";
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

  // For display, only show the last part of the booking id
  const getDisplayBookingId = (id: string) => {
    const parts = id?.split("-");
    return parts?.length ? parts[parts.length - 1] : id;
  };

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
            ? COLORS.BACKGROUND.PRIMARY_DARK
            : COLORS.BACKGROUND.PAPER_LIGHT,
          p: 2,
          borderRadius: "25px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
        }}
        onClick={() => setIsDrawerOpen(true)}
      >
        {/* Header with ID and Status */}
        <Box
          sx={{
            display: "flex",
            //   justifyContent: "space-between",
            gap: 2,
            alignItems: "center",
            //   mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
              fontWeight: 500,
            }}
          >
            {t("id")}: {getDisplayBookingId(booking.booking_id)}
          </Typography>
          {showStatus && (
            <Chip
              {...(statusConfig.icon && { icon: statusConfig.icon })}
              label={statusConfig.label}
              size="small"
              sx={{
                bgcolor: "transparent",
                border: `1px solid ${statusConfig.borderColor}`,
                color: statusConfig.color,
                fontWeight: 600,
                fontSize: "11px",
                height: "24px",
                "& .MuiChip-icon": {
                  color: statusConfig.color,
                },
              }}
            />
          )}
        </Box>
        {/* arrow */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Line */}
          <Box
            sx={{
              flexGrow: 1,
              height: "1px",
              backgroundColor: "#E0E0E0",
            }}
          />

          {/* Arrow button */}
          <Box
            sx={{
              ml: 1,
              width: 40,
              height: 40,
              background: isDark ? COLORS.DARK_GRADIENT : COLORS.PURPLECYAN,
              // color: COLORS.WHITE,
              borderRadius: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ArrowForwardIos sx={{ fontSize: 20 }} />
          </Box>
        </Box>
        {/* Service Info with Image */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box
            component="img"
            src={booking.image || "/placeholder-service.png"}
            alt={booking.name}
            sx={{
              width: 60,
              height: 60,
              borderRadius: "8px",
              objectFit: "cover",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : COLORS.BORDER.DEFAULT_LIGHT}`,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
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
                  color: isDark
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                }}
              />
              <Typography
                sx={{
                  fontSize: "13px",
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
                fontSize: "13px",
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
              }}
            >
              {formatAddress(booking.service_address, t).length > 20
                ? formatAddress(booking.service_address, t).slice(0, 30) + "..."
                : formatAddress(booking.service_address, t)}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              sx={{
                fontSize: "12px",
                //   fontWeight: 700,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {booking.currency}
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {booking.price}
            </Typography>
          </Box>
          {getActionButtons()}
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
