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
} from "../../../../services/booking/bookingInterface";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";
import dayjs from "dayjs";
import RightDrawer from "../../../common/RightDrawer";
import { bookingDetailsService } from "../../../../services/booking/bookingDetails";
import { CircularProgress, Link } from "@mui/material";
import {
  Phone,
  CalendarToday,
  LocationOn,
  Notes,
  Collections,
} from "@mui/icons-material";

interface ProviderBookingDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  booking_id: string;
}

const ProviderBookingDetailsDrawer: React.FC<
  ProviderBookingDetailsDrawerProps
> = ({ open, onClose, booking_id: initialBooking }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [booking, setBooking] = React.useState<BookingDetails | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open && initialBooking) {
      fetchBookingDetails(initialBooking);
    } else if (!open) {
      setBooking(null);
    }
  }, [open, initialBooking]);

  const fetchBookingDetails = async (id: string) => {
    setLoading(true);
    try {
      const details = await bookingDetailsService.getBookingDetails(id);
      setBooking(details);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const currentBooking = booking;

  // Return loading state if booking data is not yet available
  if (!currentBooking) {
    return (
      <RightDrawer
        open={open}
        onClose={onClose}
        title={english.booking_details}
        width={500}
      >
        <Box sx={{ px: 4, pb: 4 }}>
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
        </Box>
      </RightDrawer>
    );
  }

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
                  whiteSpace: "nowrap",
                }}
              >
                BOOKING ID:{" "}
                <span
                  style={{
                    color: COLORS.PRIMARY_PURPLE,
                    fontWeight: 900,
                    fontSize: "0.6em",
                  }}
                >
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
                  src={booking.service_image?.[0]}
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
                          {dayjs(currentBooking.booking_at).format("h:mm A")}
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
                            ? "At Customer"
                            : "In-Store"}
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
                      {booking.service_currency} {totalAmount.toFixed(0)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

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
              {/* Client Row */}
              <Box
                sx={{ p: 3, display: "flex", alignItems: "center", gap: 2.5 }}
              >
                <Avatar
                  src={booking?.customer_details?.profile_pic || undefined}
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
                    CLIENT
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: isDark ? "white" : "#1E293B",
                    }}
                  >
                    {`${booking.customer_details?.first_name || ""} ${booking.customer_details?.last_name || ""}`}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton
                    href={`tel:${booking?.customer_details?.contact_number}`}
                    sx={{
                      bgcolor: "#F1F5F9",
                      color: COLORS.PRIMARY_PURPLE,
                      "&:hover": { bgcolor: "#E2E8F0" },
                    }}
                  >
                    <Phone fontSize="small" />
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
                    {booking?.booking_address?.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748B", lineHeight: 1.8, fontWeight: 500 }}
                  >
                    {booking?.booking_address?.address}
                    {booking?.booking_address?.landmark && (
                      <>
                        <br />
                        <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>
                          Landmark:
                        </span>{" "}
                        {booking?.booking_address?.landmark}
                      </>
                    )}
                    <br />
                    {booking?.booking_address?.cityTown},{" "}
                    {booking?.booking_address?.state} —{" "}
                    {booking?.booking_address?.pincode}
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
                    CLIENT INSTRUCTIONS
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
              {currentBooking.booking_photo_url &&
                currentBooking.booking_photo_url.length > 0 && (
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
                      VISUAL EVIDENCE ({currentBooking.booking_photo_url.length}
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
                      {currentBooking.booking_photo_url.map((url, idx) => (
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

            <Box sx={{ mt: 2, mb: 2 }} />
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
    </RightDrawer>
  );
};

export default ProviderBookingDetailsDrawer;
