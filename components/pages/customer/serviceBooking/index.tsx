"use client";
import React, { useState } from "react";
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
import { CheckCircle, Bolt, Verified } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { COLORS } from "../../../../constants/colors";
import ImageUpload from "../../../ImageUpload";
import { english } from "../../../../features/i18n/en";
import { useBookingData } from "./useBookingData";
import { useBookingForm } from "./useBookingForm";
import MainLayout from "@/app/mainLayout";
import AddressDrawer from "@/components/common/address/AddressDrawer";

const CustomerServiceBooking = () => {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookingResponse, setBookingResponse] = useState<any>(null);

    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
    const [location, setLocation] = useState<"at_provider" | "at_customer">("at_provider");
    const [addressDrawerOpen, setAddressDrawerOpen] = useState(false);

    const {
        service,
        timeSlots,
        userAddresses,
        loading,
        slotsLoading,
        addressLoading,
        error: dataError,
        refetchAddresses
    } = useBookingData(serviceId, selectedDate, location);

    const {
        selectedTime,
        setSelectedTime,
        notes,
        setNotes,
        selectedAddressId,
        setSelectedAddressId,
        setPhotoUrls,
        submitting,
        error: formError,
        setError: setFormError,
        success,
        handleSubmit,
    } = useBookingForm({
        service,
        selectedDate,
        setSelectedDate,
        location,
        setLocation,
        onSuccess: (response) => {
            setBookingResponse(response);
            setShowSuccessModal(true);
        },
    });

    const error = dataError || formError;

    // Set initial location based on service availability
    React.useEffect(() => {
        const loc = service?.service_at_location as any;
        if (loc) {
            if (loc === "at_customer" || loc === "AT_CUSTOMER") {
                setLocation("at_customer");
            } else if (loc === "at_provider" || loc === "AT_PROVIDER") {
                setLocation("at_provider");
            }
        }
    }, [service, setLocation]);

    if (loading) {
        return (
            <MainLayout>
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
            </MainLayout>
        );
    }

    if (!service) {
        return (
            <MainLayout>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "100vh",
                        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
                    }}
                >
                    <Typography variant="h6">{english.service_not_found}</Typography>
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
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
                            {english.services}
                        </Typography>
                        <Typography component="span" variant="body2" sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT, mx: 1 }}>
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
                            {english.service_details}
                        </Typography>
                        <Typography component="span" variant="body2" sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT, mx: 1 }}>
                            &gt;
                        </Typography>
                        <Typography component="span" variant="body2" sx={{ color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT, fontWeight: 500 }}>
                            {english.book_service}
                        </Typography>
                    </Box>

                    {/* Service Header */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                        <Box
                            component="img"
                            src={service.image_urls?.[0] || "https://via.placeholder.com/80"}
                            alt={service.service_name}
                            sx={{ width: 80, height: 80, borderRadius: "12px", objectFit: "cover" }}
                        />
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: COLORS.PRIMARY_PURPLE }}>
                                {service.service_name}
                            </Typography>

                            {/* Trust Badges */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mt: 0.5, mb: 1 }}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    color: "#1D4ED8",
                                    fontWeight: 800
                                }}>
                                    <Verified sx={{ fontSize: '14px' }} />
                                    <Typography sx={{
                                        fontWeight: 900,
                                        fontSize: "0.65rem",
                                        fontStyle: 'italic',
                                        textTransform: 'uppercase'
                                    }}>
                                        Verified Service
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    bgcolor: "#ECFDF5",
                                    color: "#059669",
                                    px: 0.8,
                                    py: 0.2,
                                    borderRadius: "4px",
                                    border: "1px solid #10B98130"
                                }}>
                                    <Bolt sx={{ fontSize: '12px' }} />
                                    <Typography sx={{
                                        fontWeight: 800,
                                        fontSize: "0.6rem"
                                    }}>
                                        HIGH SUCCESS
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                                    <Typography
                                        sx={{
                                            color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                            fontWeight: 300,
                                            fontSize: "1rem",
                                        }}
                                    >
                                        {service.currency}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.PRIMARY_PURPLE }}>
                                        {service.price?.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Chip label={service.category_name} size="small" />
                            </Box>
                        </Box>
                    </Box>

                    {success && <Alert severity="success" sx={{ mb: 3 }}>{english.booking_created_success}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setFormError(null)}>{error}</Alert>}

                    {/* Main Content Grid */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 3 }}>
                        {/* Left Column */}
                        <Box>
                            {/* Date Selection */}
                            <Box sx={{ bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT, borderRadius: "16px", p: 3, mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                                    {english.select_date}
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar
                                        value={selectedDate}
                                        onChange={(newValue) => setSelectedDate(newValue)}
                                        minDate={dayjs()}
                                        sx={{
                                            width: "95%",
                                            maxWidth: "100%",
                                            height: "auto",
                                            maxHeight: "none",
                                            "& .MuiDateCalendar-root": {
                                                width: "90%",
                                                height: "auto",
                                                maxHeight: "none",
                                            },
                                            "& .MuiDayCalendar-header": {
                                                justifyContent: "space-around",
                                                "& .MuiTypography-root": {
                                                    width: "30px",
                                                    height: "20px",
                                                    fontSize: "0.875rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }
                                            },
                                            "& .MuiDayCalendar-slideTransition": {
                                                minHeight: "260px",
                                            },
                                            "& .MuiDayCalendar-monthContainer": {
                                                "& .MuiDayCalendar-weekContainer": {
                                                    justifyContent: "space-around",
                                                    margin: "8px 0",
                                                }
                                            },
                                            "& .MuiPickersDay-root": {
                                                width: "40px",
                                                height: "40px",
                                                fontSize: "0.875rem",
                                                color: COLORS.TEXT.PRIMARY_LIGHT, // Always dark text on white bg
                                                borderRadius: "50%",
                                                margin: "0 2px",
                                                boxShadow: "0px 1px 3px rgba(0,0,0,0.1)", // Subtle shadow for depth
                                                "&:hover": {
                                                    bgcolor: "#F5F5F5",
                                                },
                                            },
                                            "& .MuiPickersDay-root.Mui-selected": {
                                                bgcolor: `${COLORS.PRIMARY_PURPLE} !important`,
                                                color: "white !important",
                                                fontSize: "0.875rem",
                                                fontWeight: 700,
                                            },
                                            "& .MuiPickersDay-today": {
                                                borderColor: COLORS.PRIMARY_PURPLE,
                                            },
                                            "& .MuiPickersCalendarHeader-root": {
                                                paddingLeft: "16px",
                                                paddingRight: "8px",
                                                "& .MuiPickersCalendarHeader-label": {
                                                    fontSize: "1.125rem",
                                                    fontWeight: 600,
                                                }
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>

                            {/* Time Slots */}
                            {service.have_slots && (
                                <Box sx={{ bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT, borderRadius: "16px", p: 3 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                                            {english.start_time}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }}>
                                            {english.duration_min.replace("{duration}", String(service.service_duration || 60))}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 1.5 }}>
                                        {slotsLoading ? (
                                            <Box sx={{ display: "flex", justifyContent: "center", py: 4, gridColumn: "1 / -1" }}>
                                                <CircularProgress size={24} />
                                            </Box>
                                        ) : timeSlots.length === 0 ? (
                                            <Typography variant="body2" sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4, color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }}>
                                                {english.no_available_slots}
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
                                                            bgcolor: isSelected ? COLORS.PRIMARY_PURPLE : slot.is_booked ? (isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT) : "transparent",
                                                            borderColor: slot.is_booked ? (isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT) : (isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT),
                                                            color: isSelected ? "white" : slot.is_booked ? (isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT) : (isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT),
                                                            "&:hover": {
                                                                bgcolor: isSelected ? COLORS.PURPLE_HOVER : slot.is_booked ? (isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT) : "transparent",
                                                                borderColor: slot.is_booked ? (isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT) : COLORS.PRIMARY_PURPLE,
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

                        {/* Right Column */}
                        <Box>
                            {/* Location Preference */}
                            <Box sx={{ bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT, borderRadius: "16px", p: 3, mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                                    {english.location_preference}
                                </Typography>
                                <FormControl component="fieldset" fullWidth>
                                    <RadioGroup value={location} onChange={(e) => setLocation(e.target.value as any)}>
                                        {(service.service_at_location as any === "at_customer" || service.service_at_location as any === "AT_CUSTOMER" || service.service_at_location as any === "BOTH") && (
                                            <>
                                                <FormControlLabel
                                                    value="at_customer"
                                                    control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                                                    label={
                                                        <Box>
                                                            <Typography variant="body1" fontWeight={600}>{english.at_home}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{english.service_at_your_location}</Typography>
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
                                                                            p: 2.5,
                                                                            position: 'relative',
                                                                            border: `1.5px solid ${selectedAddressId === addr.id ? COLORS.PRIMARY_PURPLE : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
                                                                            borderRadius: "16px",
                                                                            cursor: "pointer",
                                                                            bgcolor: selectedAddressId === addr.id
                                                                                ? (isDark ? "rgba(94, 24, 233, 0.12)" : "rgba(94, 24, 233, 0.05)")
                                                                                : (isDark ? "rgba(255,255,255,0.02)" : "white"),
                                                                            boxShadow: selectedAddressId === addr.id
                                                                                ? `0 8px 24px -6px ${COLORS.PRIMARY_PURPLE}25`
                                                                                : "none",
                                                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                                            display: 'flex',
                                                                            flexDirection: 'column',
                                                                            "&:hover": {
                                                                                borderColor: COLORS.PRIMARY_PURPLE,
                                                                                bgcolor: isDark ? "rgba(94, 24, 233, 0.08)" : "rgba(94, 24, 233, 0.03)",
                                                                                transform: "translateY(-2px)"
                                                                            },
                                                                        }}
                                                                    >
                                                                        {selectedAddressId === addr.id && (
                                                                            <Box sx={{ position: 'absolute', top: 16, right: 16, color: COLORS.PRIMARY_PURPLE }}>
                                                                                <CheckCircle sx={{ fontSize: '20px' }} />
                                                                            </Box>
                                                                        )}

                                                                        {addr.address_name && (
                                                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.PRIMARY_PURPLE, mb: 0.5, letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                                                                {addr.address_name}
                                                                                {addr.is_default && <span style={{ marginLeft: "8px", fontSize: "0.6rem", background: COLORS.PRIMARY_PURPLE, color: 'white', padding: '2px 8px', borderRadius: '4px' }}>{english.default_address}</span>}
                                                                            </Typography>
                                                                        )}
                                                                        <Typography variant="body2" sx={{ fontWeight: 700, pr: 4, mb: 0.5, color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                                                                            {addr.building_no && `${addr.building_no}, `}
                                                                            {addr.floor && `${english.floor} ${addr.floor}, `}
                                                                            {addr.address}
                                                                        </Typography>
                                                                        {addr.landmark && (
                                                                            <Typography variant="caption" sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT, mb: 0.5, display: 'block', fontWeight: 500 }}>
                                                                                <Box component="span" sx={{ opacity: 0.6, mr: 0.5 }}>{english.near}</Box> {addr.landmark}
                                                                            </Typography>
                                                                        )}
                                                                        <Typography variant="caption" sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 500, opacity: 0.8 }}>
                                                                            {addr.city_town}, {addr.state} - {addr.pincode}
                                                                        </Typography>
                                                                    </Box>
                                                                ))}
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{english.no_saved_addresses}</Typography>
                                                        )}

                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => setAddressDrawerOpen(true)}
                                                            sx={{
                                                                mt: 2,
                                                                borderColor: COLORS.PRIMARY_PURPLE,
                                                                color: COLORS.PRIMARY_PURPLE,
                                                                borderRadius: "8px",
                                                                textTransform: "none",
                                                                fontWeight: 600,
                                                                "&:hover": {
                                                                    borderColor: COLORS.PURPLE_HOVER,
                                                                    bgcolor: "rgba(94, 24, 233, 0.04)"
                                                                }
                                                            }}
                                                        >
                                                            + {english.add_address}
                                                        </Button>
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                        {(service.service_at_location as any === "at_provider" || service.service_at_location as any === "AT_PROVIDER" || service.service_at_location as any === "BOTH") && (
                                            <>
                                                <FormControlLabel
                                                    value="at_provider"
                                                    control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                                                    label={
                                                        <Box>
                                                            <Typography variant="body1" fontWeight={600}>{english.at_service_provider_location}</Typography>
                                                            <Typography variant="caption" color="text.secondary">I will visit the provider's location for this service</Typography>
                                                        </Box>
                                                    }
                                                />
                                                {location === "at_provider" && (
                                                    <Box sx={{ ml: 4, mt: 2, mb: 2 }}>
                                                        <Box
                                                            sx={{
                                                                p: 2.5,
                                                                position: 'relative',
                                                                border: `1.5px solid ${COLORS.PRIMARY_PURPLE}`,
                                                                borderRadius: "16px",
                                                                bgcolor: isDark ? "rgba(94, 24, 233, 0.12)" : "rgba(94, 24, 233, 0.05)",
                                                                boxShadow: `0 8px 24px -6px ${COLORS.PRIMARY_PURPLE}25`,
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                            }}
                                                        >
                                                            <Box sx={{ position: 'absolute', top: 16, right: 16, color: COLORS.PRIMARY_PURPLE }}>
                                                                <CheckCircle sx={{ fontSize: '20px' }} />
                                                            </Box>

                                                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: COLORS.PRIMARY_PURPLE, mb: 0.5, letterSpacing: '0.02em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                                                {service.provider_name?.toUpperCase() || "PROVIDER"} ADDRESS
                                                            </Typography>

                                                            <Typography variant="body2" sx={{ fontWeight: 700, pr: 4, mb: 1, color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                                                                {service.service_address
                                                                    ? `${service.service_address.building_no}${service.service_address.floor ? `, ${service.service_address.floor} Floor` : ""}, ${service.service_address.address}`
                                                                    : service.service_provider_address || english.providers_location}
                                                            </Typography>

                                                            {service.service_address && (
                                                                <Typography variant="caption" sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT, fontWeight: 500, opacity: 0.8 }}>
                                                                    {service.service_address.city_town}, {service.service_address.state} - {service.service_address.pincode}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Box>
                                                )}
                                            </>
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </Box>

                            {/* Additional Notes */}
                            <Box sx={{ bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT, borderRadius: "16px", p: 3, mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                                    {english.additional_notes}
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    placeholder={english.write_additional_notes}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                />
                            </Box>

                            {/* Photo Upload */}
                            <Box sx={{ bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT, borderRadius: "16px", p: 3, mb: 3 }}>
                                <ImageUpload
                                    onUploadComplete={(urls) => setPhotoUrls(urls)}
                                    maxImages={6}
                                    label={english.upload_photos_optional}
                                    description={english.upload_photos_description}
                                />
                            </Box>

                            {/* Submit Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={() => handleSubmit(service?.service_id)}
                                disabled={submitting || success}
                                sx={{
                                    bgcolor: COLORS.PRIMARY_PURPLE,
                                    color: "white",
                                    borderRadius: "12px",
                                    py: 1.5,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
                                    "&:disabled": { bgcolor: isDark ? COLORS.BACKGROUND.SECONDARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT },
                                }}
                            >
                                {english.confirm_booking}
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
                        background: `linear-gradient(135deg, ${isDark ? "#E8D5F2" : "#F3E8FF"} 0%, ${isDark ? "#D5E8F2" : "#E0F2FE"} 100%)`,
                        position: "relative",
                        overflow: "hidden",
                    },
                }}
            >
                <DialogContent sx={{ p: 4, textAlign: "center", position: "relative" }}>
                    <Box sx={{ width: 80, height: 80, borderRadius: "50%", bgcolor: "#E0F2FE", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", position: "relative" }}>
                        <CheckCircle sx={{ fontSize: 48, color: COLORS.PRIMARY_PURPLE }} />
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#1E1E1E", mb: 1 }}>
                        {english.thank_you_booking}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
                        {english.booking_confirmed}
                    </Typography>

                    {bookingResponse && (
                        <Box sx={{ bgcolor: "rgba(255,255,255,0.8)", borderRadius: "12px", p: 2, mb: 3, textAlign: "left" }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" sx={{ color: "#666" }}>{english.booking_id}:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E1E1E" }}>
                                    #{bookingResponse.booking_id || "N/A"}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" sx={{ color: "#666" }}>{english.scheduled_for}:</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E1E1E" }}>
                                    {selectedDate?.format("MMM DD, YYYY")} {selectedTime && `${english.at_time} ${dayjs(selectedTime).format("h:mma")}`}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                        {english.service_provider_contact}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => router.push("/cus/bookings")}
                            sx={{
                                borderColor: COLORS.PRIMARY_PURPLE,
                                color: COLORS.PRIMARY_PURPLE,
                                borderRadius: "12px",
                                py: 1.5,
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": { borderColor: COLORS.PURPLE_HOVER, bgcolor: "rgba(94, 24, 233, 0.04)" },
                            }}
                        >
                            {english.view_booking_details}
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => router.push("/cus/servicesList")}
                            sx={{
                                bgcolor: COLORS.PRIMARY_PURPLE,
                                color: "white",
                                borderRadius: "12px",
                                py: 1.5,
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
                            }}
                        >
                            {english.back_to_services}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Address Drawer */}
            <AddressDrawer
                open={addressDrawerOpen}
                onClose={() => {
                    setAddressDrawerOpen(false);
                    refetchAddresses();
                }}
                mode="add"
            />
        </MainLayout>
    );
};

export default CustomerServiceBooking;
