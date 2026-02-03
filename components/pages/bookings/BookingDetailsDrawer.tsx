"use client";
import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Button,
  Chip,
  useTheme,
  Dialog,
  Fade,
} from "@mui/material";
import {
  Close,
  ChatBubbleOutline,
  NearMe,
  CheckCircle,
} from "@mui/icons-material";
import {
  UserBooking,
  BookingDetails,
  BookingStatus,
} from "../../../services/booking/bookingInterface";
import { COLORS } from "../../../constants/colors";
import { english } from "../../../features/i18n/en";
import dayjs from "dayjs";
import RightDrawer from "../../common/RightDrawer";
import { bookingDetailsService } from "../../../services/booking/bookingDetails";
import { CircularProgress } from "@mui/material";
import { Phone, CalendarToday, LocationOn } from "@mui/icons-material";
import ReviewModal from "./ReviewModal";

interface BookingDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  booking: UserBooking | null;
}

const BookingDetailsDrawer: React.FC<BookingDetailsDrawerProps> = ({
  open,
  onClose,
  booking: initialBooking,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [booking, setBooking] = React.useState<BookingDetails | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (open && initialBooking?.booking_id) {
      fetchBookingDetails(initialBooking.booking_id);
    } else if (!open) {
      setBooking(null);
    }
  }, [open, initialBooking?.booking_id]);

  const fetchBookingDetails = async (id: string) => {
    setLoading(true);
    try {
      const details = await bookingDetailsService.getCustomerBookingDetails(id);
      setBooking(details);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

   // Auto-open review modal logic
  React.useEffect(() => {
    console.log("Booking details:", booking);
    if (booking && booking.status === BookingStatus.COMPLETED && !booking.is_reviewed) {
      const timer = setTimeout(() => {
        setReviewModalOpen(true);
      }, 1000); // 1 second delay for better UX
      console.log("Review modal opened");
      return () => clearTimeout(timer);
    }
  }, [booking]);

  if (!initialBooking) return null;

  // Map status to colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return { bg: "#FFFBEB", text: "#F59E0B" };
      case "CONFIRMED":
        return { bg: "#ECFDF5", text: "#10B981" };
      case "CANCELLED":
        return { bg: "#FEF2F2", text: "#EF4444" };
      case "COMPLETED":
        return { bg: "#EFF6FF", text: "#3B82F6" };
      case "ACTIVE":
        return { bg: "#EEF2FF", text: "#6366F1" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  const currentBooking = booking || initialBooking;
  const statusStyle = getStatusColor(currentBooking.status);
  const totalAmount = currentBooking.service_price;

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title={english.booking_details}
      width={500}
    >
      <Box sx={{ px: 4, pb: 4 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              py: 10,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Subtle Top Booking ID */}
            <Box sx={{ mb: 3, mt: -1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#94A3B8",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                BOOKING ID:{" "}
                <span style={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}>
                  #{currentBooking.booking_id.toUpperCase()}
                </span>
              </Typography>
            </Box>

            {/* Unified Header & Hero Section */}
            <Box
              sx={{
                mx: -4,
                mb: 4,
                position: "relative",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9"}`,
              }}
            >
              {/* Hero Background Image */}
              <Box
                sx={{ position: "relative", height: 220, overflow: "hidden" }}
              >
                <Box
                  component="img"
                  src={
                    booking
                      ? booking.service_image?.[0]
                      : initialBooking.service_images?.[0]
                  }
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.7)",
                  }}
                />
                {/* Status Chip Overlay */}
                <Box sx={{ position: "absolute", top: 20, left: 24 }}>
                  <Chip
                    label={currentBooking.status}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.9)",
                      color: COLORS.PRIMARY_PURPLE,
                      backdropFilter: "blur(10px)",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                      height: 28,
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>

                {/* Service Info Glass Overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 3,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 900, color: "white", mb: 0.5 }}
                    >
                      {currentBooking.service_name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8,
                          bgcolor: "rgba(255,255,255,0.15)",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "8px",
                          backdropFilter: "blur(4px)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 14, color: "#FCD34D" }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: "white", fontWeight: 800 }}
                        >
                          {dayjs(currentBooking.booking_at).format(
                            "MMM DD, h:mm A",
                          )}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8,
                          bgcolor: "rgba(255,255,255,0.15)",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "8px",
                          backdropFilter: "blur(4px)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <LocationOn sx={{ fontSize: 14, color: "#FCD34D" }} />
                        <Typography
                          variant="caption"
                          sx={{ color: "white", fontWeight: 800 }}
                        >
                          {currentBooking.service_location === "at_customer"
                            ? "At Home"
                            : "At Provider"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(255,255,255,0.6)",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        display: "block",
                      }}
                    >
                      TOTAL
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 900, color: "white" }}
                    >
                      {currentBooking.service_currency ||
                        initialBooking.currency}{" "}
                      {totalAmount.toFixed(0)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* OTP Section (Only for CONFIRMED status) */}
            {currentBooking.status === "CONFIRMED" && currentBooking.otp && (
              <Box
                sx={{
                  background: isDark
                    ? `linear-gradient(135deg, ${COLORS.SECONDARY_ORANGE}15 0%, ${COLORS.SECONDARY_ORANGE}05 100%)`
                    : `linear-gradient(135deg, ${COLORS.SECONDARY_ORANGE}08 0%, ${COLORS.WHITE} 100%)`,
                  borderRadius: "28px",
                  p: 3.5,
                  mb: 4,
                  textAlign: "center",
                  border: `1px solid ${COLORS.SECONDARY_ORANGE}30`,
                  boxShadow: isDark
                    ? "none"
                    : "0 10px 30px -10px rgba(249, 115, 22, 0.15)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "4px",
                    height: "100%",
                    bgcolor: COLORS.SECONDARY_ORANGE,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: `${COLORS.SECONDARY_ORANGE}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircle
                      sx={{ color: COLORS.SECONDARY_ORANGE, fontSize: 18 }}
                    />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: COLORS.SECONDARY_ORANGE,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                    }}
                  >
                    {english.otp_to_provider_label}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  {(currentBooking.otp as number)
                    .toString()
                    .split("")
                    .map((digit: string, i: number) => (
                      <Box
                        key={i}
                        sx={{
                          width: 42,
                          height: 52,
                          borderRadius: "12px",
                          bgcolor: isDark
                            ? "rgba(255,255,255,0.05)"
                            : COLORS.WHITE,
                          border: `2px solid ${isDark ? "rgba(255,255,255,0.1)" : "#F3F4F6"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          fontWeight: 800,
                          color: isDark
                            ? COLORS.WHITE
                            : COLORS.TEXT.PRIMARY_LIGHT,
                          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                        }}
                      >
                        {digit}
                      </Box>
                    ))}
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    fontWeight: 500,
                    lineHeight: 1.6,
                  }}
                >
                  {english.otp_to_provider_instruction}
                </Typography>
              </Box>
            )}

            {/* Unified Info Sheet */}
            <Box
              sx={{
                borderRadius: "32px",
                bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9"}`,
                boxShadow: "0 20px 40px rgba(0,0,0,0.02)",
                overflow: "hidden",
                mb: 4,
              }}
            >
              {/* Provider Row */}
              <Box
                sx={{ p: 3, display: "flex", alignItems: "center", gap: 2.5 }}
              >
                <Avatar
                  src={
                    currentBooking.provider_details?.profile_pic || undefined
                  }
                  sx={{
                    width: 64,
                    height: 64,
                    border: `2px solid ${COLORS.PRIMARY_PURPLE}20`,
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94A3B8",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      mb: 0.5,
                      display: "block",
                    }}
                  >
                    PROVIDER
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: "1.2rem",
                      color: isDark ? "white" : "#0F172A",
                    }}
                  >
                    {currentBooking?.business_name}
                  </Typography>
                  {
                    <Typography
                      variant="caption"
                      sx={{
                        color: isDark
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      by {currentBooking.provider_details?.first_name}{" "}
                      {currentBooking.provider_details?.last_name}
                    </Typography>
                  }
                  <Typography
                    variant="caption"
                    sx={{ color: COLORS.PRIMARY_PURPLE, fontWeight: 700 }}
                  >
                    {currentBooking.category_name} Service
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    href={`tel:${currentBooking.provider_details?.contact_number || currentBooking.contact_number}`}
                    sx={{
                      bgcolor: "#F1F5F9",
                      color: COLORS.PRIMARY_PURPLE,
                      "&:hover": { bgcolor: "#E2E8F0" },
                    }}
                  >
                    <Phone fontSize="small" />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: "#F1F5F9",
                      color: "#3B82F6",
                      "&:hover": { bgcolor: "#E2E8F0" },
                    }}
                  >
                    <ChatBubbleOutline fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ mx: 3, opacity: 0.5 }} />

              {/* Location Row */}
              <Box sx={{ p: 3, display: "flex", gap: 2.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "16px",
                    bgcolor: "#F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <NearMe sx={{ color: "#64748B", fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94A3B8",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      mb: 0.5,
                      display: "block",
                    }}
                  >
                    SERVICE ADDRESS
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1rem",
                      mb: 0.8,
                      color: isDark ? "white" : "#1E293B",
                    }}
                  >
                    {currentBooking.booking_address?.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748B", lineHeight: 1.8, fontWeight: 500 }}
                  >
                    {currentBooking.booking_address?.address}
                    {currentBooking.booking_address?.landmark && (
                      <>
                        <br />
                        <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>
                          Landmark:
                        </span>{" "}
                        {currentBooking.booking_address?.landmark}
                      </>
                    )}
                    <br />
                    {currentBooking.booking_address?.cityTown},{" "}
                    {currentBooking.booking_address?.state} —{" "}
                    {currentBooking.booking_address?.pincode}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Secondary Flow: Instructions & Evidence */}
            <Box sx={{ px: 1 }}>
              {/* Notes Section with Subtle Quote Style */}
              {currentBooking.customer_notes && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94A3B8",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      mb: 2,
                      display: "block",
                    }}
                  >
                    YOUR INSTRUCTIONS
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "24px",
                      bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#E2E8F0"}`,
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? "#CBD5E1" : "#475569",
                        fontStyle: "italic",
                        lineHeight: 1.8,
                        fontWeight: 500,
                      }}
                    >
                      "{currentBooking.customer_notes}"
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Visual Evidence with Smooth Scrolling */}
              {(currentBooking.booking_photo_url ||
                currentBooking.photo_url) && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94A3B8",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      mb: 2,
                      display: "block",
                    }}
                  >
                    VISUAL EVIDENCE (
                    {(currentBooking.booking_photo_url || []).length +
                      (currentBooking.photo_url || []).length}
                    )
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      overflowX: "auto",
                      pt: 1.5,
                      pb: 2,
                      px: 0.5,
                      mx: -0.5,
                      "&::-webkit-scrollbar": { height: "4px" },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.06)",
                        borderRadius: "10px",
                      },
                    }}
                  >
                    {[
                      ...(currentBooking.booking_photo_url || []),
                      ...(currentBooking.photo_url || []),
                    ].map((url, idx) => (
                      <Box
                        key={idx}
                        component="img"
                        src={url}
                        onClick={() => setPreviewImage(url)}
                        sx={{
                          width: 130,
                          height: 130,
                          borderRadius: "20px",
                          objectFit: "cover",
                          flexShrink: 0,
                          cursor: "pointer",
                          transition:
                            "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                          border: `2px solid ${isDark ? "rgba(255,255,255,0.05)" : "#FFFFFF"}`,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          "&:hover": {
                            transform: "scale(1.05) translateY(-5px)",
                            boxShadow: `0 15px 30px ${isDark ? "rgba(0,0,0,0.4)" : "rgba(94, 24, 233, 0.15)"}`,
                            borderColor: COLORS.PRIMARY_PURPLE,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  borderRadius: "16px",
                  py: 1.8,
                  textTransform: "none",
                  fontWeight: 800,
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0",
                  color: isDark ? "white" : "#475569",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                }}
              >
                Help & Support
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: COLORS.PRIMARY_PURPLE,
                  color: "white",
                  borderRadius: "16px",
                  py: 1.8,
                  textTransform: "none",
                  fontWeight: 800,
                  boxShadow: `0 8px 20px ${COLORS.PRIMARY_PURPLE}30`,
                  "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
                }}
              >
                Reschedule
              </Button>
            </Box>

            <Box sx={{ mt: 4 }} />
          </>
        )}
      </Box>

      {/* Image Preview Modal */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="lg"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 400 }}
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "90vw",
            maxHeight: "90vh",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={() => setPreviewImage(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              sx={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "12px",
                boxShadow: "0px 10px 40px rgba(0,0,0,0.5)",
              }}
            />
          )}
        </Box>
      </Dialog>

      {/* Review Modal */}
      <ReviewModal
        id={currentBooking.service_id}
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        providerName={
          currentBooking.provider_details?.first_name
            ? `${currentBooking.provider_details?.first_name} ${currentBooking.provider_details?.last_name}`
            : currentBooking.business_name
        }
        providerImage={
          currentBooking.provider_details?.profile_pic || undefined
        }
        serviceName={currentBooking.service_name}
      />
    </RightDrawer>
  );
};

export default BookingDetailsDrawer;
