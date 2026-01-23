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
import { CheckCircle } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Nav from "../../../common/Nav";
import { COLORS } from "../../../../constants/colors";
import ImageUpload from "../../../ImageUpload";
import { english } from "../../../../features/i18n/en";
import { useBookingData } from "./useBookingData";
import { useBookingForm } from "./useBookingForm";

const CustomerServiceBooking = () => {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookingResponse, setBookingResponse] = useState<any>(null);

    const {
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        location,
        setLocation,
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
        service: null,
        onSuccess: (response) => {
            setBookingResponse(response);
            setShowSuccessModal(true);
        },
    });

    const {
        service,
        timeSlots,
        userAddresses,
        loading,
        slotsLoading,
        addressLoading,
        error: dataError,
    } = useBookingData(serviceId, selectedDate, location);

    const error = dataError || formError;

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
                    <Typography variant="h6">{english.service_not_found}</Typography>
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
                            <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                                {service.service_name}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.PRIMARY_PURPLE }}>
                                    {service.currency} {service.price?.toFixed(2)}
                                </Typography>
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
                                                                    p: 2,
                                                                    border: `2px solid ${selectedAddressId === addr.id ? COLORS.PRIMARY_PURPLE : isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                                                                    borderRadius: "12px",
                                                                    cursor: "pointer",
                                                                    bgcolor: selectedAddressId === addr.id ? "rgba(94, 24, 233, 0.04)" : isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
                                                                    transition: "all 0.2s",
                                                                    "&:hover": { borderColor: COLORS.PRIMARY_PURPLE, bgcolor: "rgba(94, 24, 233, 0.04)" },
                                                                }}
                                                            >
                                                                {addr.address_name && (
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.PRIMARY_PURPLE, mb: 0.5 }}>
                                                                        {addr.address_name}
                                                                        {addr.is_default && <span style={{ marginLeft: "8px", fontSize: "0.75rem" }}>{english.default_address}</span>}
                                                                    </Typography>
                                                                )}
                                                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                                    {addr.building_no && `${addr.building_no}, `}
                                                                    {addr.floor && `${english.floor} ${addr.floor}, `}
                                                                    {addr.address}
                                                                </Typography>
                                                                {addr.landmark && (
                                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                                        {english.near} {addr.landmark}
                                                                    </Typography>
                                                                )}
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {addr.city_town}, {addr.state} - {addr.pincode}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{english.no_saved_addresses}</Typography>
                                                )}
                                            </Box>
                                        )}
                                        <FormControlLabel
                                            value="at_provider"
                                            control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                                            label={
                                                <Box>
                                                    <Typography variant="body1" fontWeight={600}>{english.at_service_provider_location}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{service.service_provider_address || english.providers_location}</Typography>
                                                </Box>
                                            }
                                        />
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
        </>
    );
};

export default CustomerServiceBooking;
