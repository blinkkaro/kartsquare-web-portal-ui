"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    CircularProgress,
    useTheme,
    Chip,
    Alert,
    Dialog,
    DialogContent,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import Nav from "../../../../components/common/Nav";
import { serviceDetailsService } from "../../../../services/serviceDetails/serviceDetailsService";
import { bookingService } from "../../../../services/booking/bookingService";
import { appointmentService } from "../../../../services/appointment/appointmentService";
import { ServiceDetails } from "../../../../services/serviceDetails/serviceDetailsInterface";
import { TimeSlot } from "../../../../services/appointment/appointmentInterface";
import { COLORS } from "../../../../constants/colors";
import { userAddressService } from "../../../../services/userAddress/userAddressService";
import { UserAddress } from "../../../../services/userAddress/userAddressInterface";
import ImageUpload from "../../../../components/ImageUpload";

const BookServicePage = () => {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // State
    const [service, setService] = useState<ServiceDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [location, setLocation] = useState<"at_provider" | "at_customer">("at_provider");
    const [customerAddress, setCustomerAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookingResponse, setBookingResponse] = useState<any>(null);
    const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [addressLoading, setAddressLoading] = useState(false);
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);

    // Fetch service details
    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                setLoading(true);
                const data = await serviceDetailsService.getServiceById(serviceId);
                setService(data);
            } catch (error) {
                console.error("Failed to fetch service details:", error);
                setError("Failed to load service details");
            } finally {
                setLoading(false);
            }
        };

        if (serviceId) {
            fetchServiceDetails();
        }
    }, [serviceId]);

    // Fetch slots when date or service changes
    useEffect(() => {
        const fetchSlots = async () => {
            if (!service || !selectedDate || !service.have_slots) {
                setTimeSlots([]);
                return;
            }

            try {
                setSlotsLoading(true);
                const formattedDate = selectedDate.format("YYYY-MM-DD");
                const slotsData = await appointmentService.getSlots({
                    service_id: serviceId,
                    provider_id: service.provider_id,
                    date: formattedDate,
                    timezone: userTimezone,
                });
                setTimeSlots(slotsData.slots);
                // Reset selected time if it's no longer available
                if (selectedTime && !slotsData.slots.find(s => s.slot_time === selectedTime)) {
                    setSelectedTime("");
                }
            } catch (error) {
                console.error("Failed to fetch slots:", error);
                setError("Failed to load available time slots");
                setTimeSlots([]);
            } finally {
                setSlotsLoading(false);
            }
        };

        fetchSlots();
    }, [serviceId, service, selectedDate, userTimezone]);

    // Fetch user addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setAddressLoading(true);
                const addresses = await userAddressService.getUserAddresses();
                setUserAddresses(addresses || []);
            } catch (error) {
                console.error("Failed to fetch addresses:", error);
            } finally {
                setAddressLoading(false);
            }
        };

        if (location === "at_customer") {
            fetchAddresses();
        }
    }, [location]);

    const handleSubmit = async () => {
        try {
            setError(null);
            setSubmitting(true);

            if (!selectedDate) {
                setError("Please select a date");
                return;
            }

            // If service has slots, require time selection
            if (service?.have_slots && !selectedTime) {
                setError("Please select a time slot");
                return;
            }

            // If location is at_customer, require address
            if (location === "at_customer" && !selectedAddressId && !customerAddress.trim()) {
                setError("Please select or enter your address");
                return;
            }

            // Prepare schedule_at datetime in ISO 8601 UTC format
            let scheduleAt: string;
            if (service?.have_slots && selectedTime) {
                // Convert selectedTime to UTC format (remove timezone, convert to Z)
                scheduleAt = dayjs(selectedTime).toISOString();
            } else {
                // If no slots, use selected date at 9 AM in UTC ISO format
                // toISOString() returns: 2025-10-29T03:30:00.000Z (UTC)
                scheduleAt = selectedDate.hour(9).minute(0).second(0).millisecond(0).toISOString();
            }

            const bookingData: any = {
                service_id: serviceId,
                service_location: location,
                customer_notes: notes.trim() || undefined,
                schedule_at: scheduleAt,
                address_id: location === "at_customer" ? selectedAddressId || undefined : undefined,
                service_provider_address_id: location === "at_provider" && service?.service_provider_address_id
                    ? service.service_provider_address_id
                    : undefined,
                photo_url: photoUrls.length > 0 ? photoUrls : undefined,
                distance_km: 10, // Number value as required by backend
                service_radius: 10, // Static number value
            };

            console.log("Booking payload:", bookingData);

            const response = await bookingService.createBooking(bookingData);
            setBookingResponse(response);
            setSuccess(true);
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error("Booking error:", error);
            setError(error?.response?.data?.message || "Failed to create booking. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Nav />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
                    }}
                >
                    <CircularProgress />
                </Box>
            </>
        );
    }

    if (!service) {
        return (
            <>
                <Nav />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
                    }}
                >
                    <Typography variant="h6">Service not found</Typography>
                </Box>
            </>
        );
    }

    return (
        <>
            <Nav />
            <Box
                sx={{
                    bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
                    minHeight: "100vh",
                    pt: { xs: 8, md: 10 },
                    pb: 4,
                }}
            >
                <Container maxWidth="xl">
                    {/* Breadcrumb */}
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            component="span"
                            variant="body2"
                            onClick={() => router.push("/cus/servicesList")}
                            sx={{
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                cursor: "pointer",
                                "&:hover": {
                                    color: COLORS.PRIMARY_PURPLE,
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Service
                        </Typography>
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                mx: 1,
                            }}
                        >
                            &gt;
                        </Typography>
                        <Typography
                            component="span"
                            variant="body2"
                            onClick={() => router.push(`/services/${serviceId}`)}
                            sx={{
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                cursor: "pointer",
                                "&:hover": {
                                    color: COLORS.PRIMARY_PURPLE,
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            Service details
                        </Typography>
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                mx: 1,
                            }}
                        >
                            &gt;
                        </Typography>
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{
                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                fontWeight: 500,
                            }}
                        >
                            Book service
                        </Typography>
                    </Box>

                    {/* Service Header */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                        <Box
                            component="img"
                            src={service.image_urls?.[0] || "https://via.placeholder.com/80"}
                            alt={service.service_name}
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "12px",
                                objectFit: "cover",
                            }}
                        />
                        <Box>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                }}
                            >
                                {service.service_name}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: COLORS.PRIMARY_PURPLE,
                                    }}
                                >
                                    {service.currency} {service.price?.toFixed(2)}
                                </Typography>
                                <Chip label={service.category_name} size="small" />
                            </Box>
                        </Box>
                    </Box>

                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Booking created successfully! Redirecting...
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {/* Main Content Grid */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
                            gap: 3,
                        }}
                    >
                        {/* Left Column - Date and Time */}
                        <Box>
                            {/* Date Selection */}
                            <Box
                                sx={{
                                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
                                    borderRadius: "16px",
                                    p: 3,
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 2,
                                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    }}
                                >
                                    Select Date
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar
                                        value={selectedDate}
                                        onChange={(newValue) => setSelectedDate(newValue)}
                                        minDate={dayjs()}
                                        sx={{
                                            width: "100%",
                                            maxWidth: "100%",
                                            "& .MuiPickersDay-root": {
                                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                            },
                                            "& .MuiPickersDay-root.Mui-selected": {
                                                bgcolor: `${COLORS.PRIMARY_PURPLE} !important`,
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>

                            {/* Time Slots (only if service has slots) */}
                            {service.have_slots && (
                                <Box
                                    sx={{
                                        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
                                        borderRadius: "16px",
                                        p: 3,
                                    }}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                            }}
                                        >
                                            Start time
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                            }}
                                        >
                                            Duration: {service.service_duration || 60}min
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                                            gap: 1.5,
                                        }}
                                    >
                                        {slotsLoading ? (
                                            <Box sx={{ display: "flex", justifyContent: "center", py: 4, gridColumn: "1 / -1" }}>
                                                <CircularProgress size={24} />
                                            </Box>
                                        ) : timeSlots.length === 0 ? (
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    gridColumn: "1 / -1",
                                                    textAlign: "center",
                                                    py: 4,
                                                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                                }}
                                            >
                                                No available slots for this date
                                            </Typography>
                                        ) : (
                                            timeSlots.map((slot) => {
                                                const slotTime = dayjs(slot.slot_time);
                                                const displayTime = slotTime.format("h:mma");
                                                const isSelected = selectedTime === slot.slot_time;

                                                return (
                                                    <Button
                                                        key={slot.slot_time}
                                                        variant={isSelected ? "contained" : "outlined"}
                                                        onClick={() => setSelectedTime(slot.slot_time)}
                                                        disabled={slot.is_booked}
                                                        sx={{
                                                            borderRadius: "8px",
                                                            py: 1,
                                                            textTransform: "none",
                                                            bgcolor: isSelected
                                                                ? COLORS.PRIMARY_PURPLE
                                                                : slot.is_booked
                                                                    ? (isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT)
                                                                    : "transparent",
                                                            borderColor: slot.is_booked
                                                                ? (isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT)
                                                                : (isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT),
                                                            color: isSelected
                                                                ? "white"
                                                                : slot.is_booked
                                                                    ? (isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT)
                                                                    : (isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT),
                                                            "&:hover": {
                                                                bgcolor: isSelected
                                                                    ? COLORS.PURPLE_HOVER
                                                                    : slot.is_booked
                                                                        ? (isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT)
                                                                        : "transparent",
                                                                borderColor: slot.is_booked
                                                                    ? (isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT)
                                                                    : COLORS.PRIMARY_PURPLE,
                                                            },
                                                            opacity: slot.is_booked ? 0.5 : 1,
                                                            cursor: slot.is_booked ? "not-allowed" : "pointer",
                                                        }}
                                                    >
                                                        {displayTime}
                                                    </Button>
                                                );
                                            })
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        {/* Right Column - Location and Notes */}
                        <Box>
                            {/* Location Preference */}
                            <Box
                                sx={{
                                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
                                    borderRadius: "16px",
                                    p: 3,
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 2,
                                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    }}
                                >
                                    Location preference
                                </Typography>
                                <FormControl component="fieldset" fullWidth>
                                    <RadioGroup value={location} onChange={(e) => setLocation(e.target.value as any)}>
                                        <FormControlLabel
                                            value="at_customer"
                                            control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                                            label={
                                                <Box>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        At Home
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Service at your location
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        {location === "at_customer" && (
                                            <Box sx={{ ml: 4, mt: 2, mb: 2 }}>
                                                {addressLoading ? (
                                                    <CircularProgress size={20} />
                                                ) : userAddresses.length > 0 ? (
                                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                                        {userAddresses.map((addr) => (
                                                            <Box
                                                                key={addr.id}
                                                                onClick={() => setSelectedAddressId(addr.id)}
                                                                sx={{
                                                                    p: 2,
                                                                    border: `2px solid ${selectedAddressId === addr.id
                                                                        ? COLORS.PRIMARY_PURPLE
                                                                        : isDark
                                                                            ? COLORS.BORDER.DEFAULT_DARK
                                                                            : COLORS.BORDER.DEFAULT_LIGHT
                                                                        }`,
                                                                    borderRadius: "12px",
                                                                    cursor: "pointer",
                                                                    bgcolor: selectedAddressId === addr.id
                                                                        ? "rgba(94, 24, 233, 0.04)"
                                                                        : isDark
                                                                            ? COLORS.BACKGROUND.PAPER_DARK
                                                                            : COLORS.BACKGROUND.PRIMARY_LIGHT,
                                                                    transition: "all 0.2s",
                                                                    "&:hover": {
                                                                        borderColor: COLORS.PRIMARY_PURPLE,
                                                                        bgcolor: "rgba(94, 24, 233, 0.04)",
                                                                    },
                                                                }}
                                                            >
                                                                {addr.address_name && (
                                                                    <Typography
                                                                        variant="subtitle2"
                                                                        sx={{
                                                                            fontWeight: 600,
                                                                            color: COLORS.PRIMARY_PURPLE,
                                                                            mb: 0.5,
                                                                        }}
                                                                    >
                                                                        {addr.address_name}
                                                                        {addr.is_default && (
                                                                            <span style={{ marginLeft: "8px", fontSize: "0.75rem" }}>
                                                                                (Default)
                                                                            </span>
                                                                        )}
                                                                    </Typography>
                                                                )}
                                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                    {addr.building_no && `${addr.building_no}, `}
                                                                    {addr.floor && `Floor ${addr.floor}, `}
                                                                    {addr.address}
                                                                </Typography>
                                                                {addr.landmark && (
                                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                                        Near: {addr.landmark}
                                                                    </Typography>
                                                                )}
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {addr.city_town}, {addr.state} - {addr.pincode}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {addr.country}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        No saved addresses found.
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                        <FormControlLabel
                                            value="at_provider"
                                            control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                                            label={
                                                <Box>
                                                    <Typography variant="body1" fontWeight={600}>
                                                        At Service Provider's Location
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {service.service_provider_address || "Provider's location"}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Box>

                            {/* Additional Notes */}
                            <Box
                                sx={{
                                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
                                    borderRadius: "16px",
                                    p: 3,
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 2,
                                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                                    }}
                                >
                                    Additional notes
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Write your additional notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "12px",
                                        },
                                    }}
                                />
                            </Box>

                            {/* Photo Upload */}
                            <Box
                                sx={{
                                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
                                    borderRadius: "16px",
                                    p: 3,
                                    mb: 3,
                                }}
                            >
                                <ImageUpload
                                    onUploadComplete={(urls) => setPhotoUrls(urls)}
                                    maxImages={6}
                                    label="Upload Photos (Optional)"
                                    description="Upload photos related to your service request"
                                />
                            </Box>




                            {/* Submit Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                                disabled={submitting || success}
                                sx={{
                                    bgcolor: COLORS.PRIMARY_PURPLE,
                                    color: "white",
                                    borderRadius: "12px",
                                    py: 1.5,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    "&:hover": {
                                        bgcolor: COLORS.PURPLE_HOVER,
                                    },
                                    "&:disabled": {
                                        bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
                                    },
                                }}
                            >
                                Confirm Booking
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Success Modal */}
            <Dialog
                open={showSuccessModal}
                onClose={() => { }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "24px",
                        background: `linear-gradient(135deg, 
                            ${isDark ? "#E8D5F2" : "#F3E8FF"} 0%, 
                            ${isDark ? "#D5E8F2" : "#E0F2FE"} 100%)`,
                        position: "relative",
                        overflow: "hidden",
                    },
                }}
            >
                <DialogContent sx={{ p: 4, textAlign: "center", position: "relative" }}>
                    {/* Confetti Background */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            pointerEvents: "none",
                            "&::before": {
                                content: '"🎉"',
                                position: "absolute",
                                fontSize: "24px",
                                animation: "float 3s ease-in-out infinite",
                                top: "10%",
                                left: "10%",
                            },
                            "&::after": {
                                content: '"✨"',
                                position: "absolute",
                                fontSize: "20px",
                                animation: "float 2.5s ease-in-out infinite",
                                top: "20%",
                                right: "15%",
                            },
                            "@keyframes float": {
                                "0%, 100%": { transform: "translateY(0px)" },
                                "50%": { transform: "translateY(-20px)" },
                            },
                        }}
                    />

                    {/* Success Icon */}
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            bgcolor: "#E0F2FE",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                            position: "relative",
                        }}
                    >
                        <CheckCircle
                            sx={{
                                fontSize: 48,
                                color: COLORS.PRIMARY_PURPLE,
                            }}
                        />
                    </Box>

                    {/* Thank You Message */}
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            color: "#1E1E1E",
                        }}
                    >
                        Thank you!
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#666",
                            mb: 3,
                        }}
                    >
                        Your booking & order is sent to service provider
                    </Typography>

                    {/* Reward Points Badge */}
                    <Box
                        sx={{
                            display: "inline-block",
                            background: "linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)",
                            borderRadius: "20px",
                            px: 3,
                            py: 1,
                            mb: 3,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: "white",
                                fontWeight: 600,
                            }}
                        >
                            You've received 100 QC point
                        </Typography>
                    </Box>

                    {/* Service Details Card */}
                    <Box
                        sx={{
                            bgcolor: "white",
                            borderRadius: "16px",
                            p: 2.5,
                            mb: 3,
                            textAlign: "left",
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <Box
                                component="img"
                                src={service?.image_urls?.[0] || "https://via.placeholder.com/60"}
                                alt={service?.service_name}
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "12px",
                                    objectFit: "cover",
                                }}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#666",
                                        display: "block",
                                        mb: 0.5,
                                    }}
                                >
                                    {service?.category_name}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#1E1E1E",
                                        mb: 0.5,
                                    }}
                                >
                                    {service?.service_name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: COLORS.PRIMARY_PURPLE,
                                        fontWeight: 600,
                                    }}
                                >
                                    {service?.currency} {(
                                        (service?.price || 0) +
                                        (location === "at_customer" ? 10 : 0) -
                                        14 +
                                        2
                                    ).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Location Details */}
                        <Box
                            sx={{
                                bgcolor: "#F9FAFB",
                                borderRadius: "12px",
                                p: 2,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#666",
                                    display: "block",
                                    mb: 0.5,
                                }}
                            >
                                {location === "at_customer" ? "Service at home" : "Service at provider"}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#1E1E1E",
                                }}
                            >
                                {location === "at_customer"
                                    ? customerAddress || "Your location"
                                    : service?.service_provider_address || "Provider's location"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Go to Home Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => router.push("/cus/servicesList")}
                        sx={{
                            bgcolor: COLORS.PRIMARY_PURPLE,
                            color: "white",
                            borderRadius: "12px",
                            py: 1.5,
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "1rem",
                            "&:hover": {
                                bgcolor: COLORS.PURPLE_HOVER,
                            },
                        }}
                    >
                        Go to Home
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default BookServicePage;
