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
  CircularProgress,
  Stack
} from "@mui/material";
import {
  Close,
  NearMe,
  Phone,
  CalendarToday,
  LocationOn,
} from "@mui/icons-material";
import {
  BookingDetails,
} from "../../../../services/booking/bookingInterface";
import { COLORS } from "../../../../constants/colors";
import { english } from "../../../../features/i18n/en";
import dayjs from "dayjs";
import RightDrawer from "../../../common/RightDrawer";
import { bookingDetailsService } from "../../../../services/booking/bookingDetails";

interface ProviderBookingDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  booking_id: string;
}

const ProviderBookingDetailsDrawer: React.FC<ProviderBookingDetailsDrawerProps> = ({
  open,
  onClose,
  booking_id: initialBooking
}) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return { bg: isDark ? "rgba(245, 158, 11, 0.15)" : "#FEF3C7", text: "#D97706", border: "rgba(245, 158, 11, 0.2)" };
      case "CONFIRMED":
        return { bg: isDark ? "rgba(16, 185, 129, 0.15)" : "#D1FAE5", text: "#059669", border: "rgba(16, 185, 129, 0.2)" };
      case "CANCELLED":
        return { bg: isDark ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2", text: "#DC2626", border: "rgba(239, 68, 68, 0.2)" };
      case "COMPLETED":
        return { bg: isDark ? "rgba(59, 130, 246, 0.15)" : "#DBEAFE", text: "#2563EB", border: "rgba(59, 130, 246, 0.2)" };
      case "ACTIVE":
        return { bg: isDark ? "rgba(139, 92, 246, 0.15)" : "#EDE9FE", text: "#7C3AED", border: "rgba(139, 92, 246, 0.2)" };
      default:
        return { bg: isDark ? "rgba(107, 114, 128, 0.15)" : "#F3F4F6", text: "#4B5563", border: "rgba(107, 114, 128, 0.2)" };
    }
  };

  const currentBooking = booking;

  if (!currentBooking) {
    return (
      <RightDrawer open={open} onClose={onClose} title={english.booking_details} width={480}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", py: 10 }}>
          <CircularProgress size={30} thickness={4} sx={{ color: COLORS.PRIMARY_PURPLE }} />
        </Box>
      </RightDrawer>
    );
  }

  const statusStyle = getStatusColor(currentBooking.status);
  const totalAmount = currentBooking.service_price;

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography
      variant="caption"
      sx={{
        color: isDark ? "#94A3B8" : "#64748B",
        fontWeight: 700,
        letterSpacing: "0.1em",
        mb: 1.5,
        display: "block",
        lineHeight: 1,
        textTransform: 'uppercase'
      }}
    >
      {children}
    </Typography>
  );

  return (
    <RightDrawer open={open} onClose={onClose} title={english.booking_details} width={480}>
      <Box
        sx={{
          px: { xs: 3, sm: 4 },
          pb: 6,
          pt: 1,
          bgcolor: isDark ? "#0B0F19" : "#FAFAFA",
          minHeight: '100%',
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 10 }}>
            <CircularProgress size={30} thickness={4} sx={{ color: COLORS.PRIMARY_PURPLE }} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>

            {/* Header: ID & Status */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, letterSpacing: '0.05em' }}>
                BOOKING ID
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: isDark ? '#E2E8F0' : '#1E293B', wordBreak: 'break-all', lineHeight: 1.3 }}>
                  #{currentBooking.booking_id.toUpperCase()}
                </Typography>
                <Chip
                  label={currentBooking.status}
                  sx={{
                    bgcolor: statusStyle.bg,
                    color: statusStyle.text,
                    border: 'none',
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    letterSpacing: '0.05em',
                    height: 26,
                    borderRadius: "6px",
                  }}
                />
              </Box>
            </Box>

            {/* Clean Box Image */}
            {currentBooking.service_image?.[0] && (
              <Box
                sx={{
                  width: "100%",
                  height: 180,
                  bgcolor: 'white',
                  borderRadius: "16px",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  border: isDark ? 'none' : '1px solid #F1F5F9',
                  boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.03)",
                  overflow: 'hidden',
                  p: 2
                }}
              >
                <Box
                  component="img"
                  src={currentBooking.service_image[0]}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}

            {/* Core Service Info */}
            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: isDark ? 'white' : '#0F172A', maxWidth: '75%', lineHeight: 1.25 }}>
                  {currentBooking.service_name}
                </Typography>
                <Box sx={{ textAlign: "right", display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                  <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, letterSpacing: '0.05em', mb: 0.5 }}>PRICE</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#4F46E5', mt: -0.5 }}>
                    {booking.service_currency} {totalAmount.toFixed(0)}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={3} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 16, color: '#64748B' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#E2E8F0' : '#1E293B' }}>
                    {dayjs(currentBooking.booking_at).format("MMM D, YYYY • h:mm A")}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 16, color: '#64748B' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#E2E8F0' : '#1E293B' }}>
                    {currentBooking.service_location === "at_customer" ? "At Customer's" : "In-Store"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 3, borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#E2E8F0' }} />

            {/* Client Card */}
            <Box sx={{ mb: 3 }}>
              <SectionLabel>CLIENT DETAILS</SectionLabel>
              <Box
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
                  border: `1px solid ${isDark ? "transparent" : "#F1F5F9"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <Avatar
                  src={booking?.customer_details?.profile_pic || undefined}
                  sx={{ width: 44, height: 44, bgcolor: '#CBD5E1' }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: isDark ? "white" : "#1E293B", lineHeight: 1.2, mb: 0.2 }}>
                    {`${booking.customer_details?.first_name || ""} ${booking.customer_details?.last_name || ""}`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                    Customer
                  </Typography>
                </Box>
                <IconButton
                  href={`tel:${booking?.customer_details?.contact_number}`}
                  sx={{
                    bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC",
                    color: '#4F46E5',
                    border: `1px solid ${isDark ? "transparent" : "#F1F5F9"}`,
                    "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.1)" : "#F1F5F9" },
                    width: 36,
                    height: 36
                  }}
                >
                  <Phone sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Location Card */}
            <Box sx={{ mb: 3 }}>
              <SectionLabel>SERVICE ADDRESS</SectionLabel>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "16px",
                  bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9"}`,
                  display: "flex",
                  gap: 2,
                  boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <NearMe sx={{ color: '#64748B', fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", mb: 0.5, color: isDark ? "white" : "#1E293B" }}>
                    {booking?.booking_address?.name || "Home"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B", lineHeight: 1.6, fontWeight: 500 }}>
                    {booking?.booking_address?.address}
                    {booking?.booking_address?.landmark && (
                      <span style={{ display: 'block', marginTop: '4px' }}>
                        <span style={{ color: '#94A3B8' }}>Landmark:</span> {booking?.booking_address?.landmark}
                      </span>
                    )}
                    <span style={{ display: 'block', marginTop: '4px' }}>
                      {booking?.booking_address?.cityTown}, {booking?.booking_address?.state} {booking?.booking_address?.pincode}
                    </span>
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Subdued Instructions */}
            {currentBooking.customer_notes && (
              <Box sx={{ mb: 3 }}>
                <SectionLabel>INSTRUCTIONS</SectionLabel>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: "12px",
                    bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC",
                    borderLeft: `3px solid ${COLORS.PRIMARY_PURPLE}`,
                  }}
                >
                  <Typography variant="body2" sx={{ color: isDark ? "#CBD5E1" : "#475569", fontStyle: "italic", lineHeight: 1.6, fontWeight: 500 }}>
                    "{currentBooking.customer_notes}"
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Visual Evidence Slider */}
            {currentBooking.booking_photo_url && currentBooking.booking_photo_url.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <SectionLabel>EVIDENCE ({currentBooking.booking_photo_url.length})</SectionLabel>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    overflowX: "auto",
                    pb: 1,
                    "&::-webkit-scrollbar": { height: "4px" },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
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
                        width: 100,
                        height: 100,
                        borderRadius: "12px",
                        objectFit: "cover",
                        flexShrink: 0,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0"}`,
                        "&:hover": {
                          transform: "translateY(-2px)",
                          borderColor: COLORS.PRIMARY_PURPLE,
                          opacity: 0.9
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Action Buttons Container Minimal Focus */}
            {(currentBooking.status === "PENDING" || currentBooking.status === "CONFIRMED") && (
              <Box sx={{ mt: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    bgcolor: '#4F46E5',
                    color: 'white',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                    '&:hover': {
                      bgcolor: '#4338CA',
                      boxShadow: '0 6px 16px rgba(79, 70, 229, 0.4)',
                    }
                  }}
                >
                  Update Booking Status
                </Button>
              </Box>
            )}

          </Box>
        )}
      </Box>

      {/* Image Preview Modal */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="lg"
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
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
        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconButton
            onClick={() => setPreviewImage(null)}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "white",
              backdropFilter: "blur(4px)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              zIndex: 1,
            }}
          >
            <Close fontSize="small" />
          </IconButton>
          {previewImage && (
            <Box
              component="img"
              src={previewImage}
              sx={{
                maxWidth: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: "16px",
                boxShadow: "0px 20px 60px rgba(0,0,0,0.6)",
              }}
            />
          )}
        </Box>
      </Dialog>
    </RightDrawer>
  );
};

export default ProviderBookingDetailsDrawer;
