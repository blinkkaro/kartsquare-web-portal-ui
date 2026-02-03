import { useState } from "react";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { bookingService } from "@/services/booking/bookingService";
import { ServiceDetails } from "@/services/serviceDetails/serviceDetailsInterface";
import { english } from "@/features/i18n/en";

interface UseBookingFormProps {
    service: ServiceDetails | null;
    onSuccess: (response: any) => void;
    selectedDate: Dayjs | null;
    setSelectedDate: (date: Dayjs | null) => void;
    location: "at_provider" | "at_customer";
    setLocation: (location: "at_provider" | "at_customer") => void;
}

export const useBookingForm = ({
    service,
    onSuccess,
    selectedDate,
    setSelectedDate,
    location,
    setLocation,
}: UseBookingFormProps) => {
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [selectedAddressId, setSelectedAddressId] = useState<string>("");
    const [photoUrls, setPhotoUrls] = useState<string[]>([]);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (serviceIdFromProps?: string) => {
        try {
            setError(null);
            setSubmitting(true);

            const finalServiceId = serviceIdFromProps || service?.service_id;

            if (!finalServiceId) {
                setError(english.service_not_found);
                return;
            }

            if (!selectedDate) {
                setError(english.select_date_error);
                return;
            }

            if (service?.have_slots && !selectedTime) {
                setError(english.select_time_slot_error);
                return;
            }

            if (location === "at_customer" && !selectedAddressId && !customerAddress.trim()) {
                setError(english.select_address_error_booking);
                return;
            }

            let scheduleAt: string;
            if (service?.have_slots && selectedTime) {
                scheduleAt = dayjs(selectedTime).toISOString();
            } else {
                scheduleAt = selectedDate.hour(9).minute(0).second(0).millisecond(0).toISOString();
            }

            const bookingData: any = {
                service_id: finalServiceId,
                service_location: location,
                customer_notes: notes.trim() || undefined,
                schedule_at: scheduleAt,
                address_id: location === "at_customer"
                    ? (selectedAddressId || undefined)
                    : service?.service_provider_address_id,
                photo_url: photoUrls.length > 0 ? photoUrls : undefined,
                distance_km: 10,
                service_radius: 10,
            };

            const response = await bookingService.createBooking(bookingData);
            setSuccess(true);
            onSuccess(response);
        } catch (error: any) {
            console.error("Booking error:", error);
            setError(error?.response?.data?.message || english.failed_create_booking);
        } finally {
            setSubmitting(false);
        }
    };

    return {
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        location,
        setLocation,
        customerAddress,
        setCustomerAddress,
        notes,
        setNotes,
        selectedAddressId,
        setSelectedAddressId,
        photoUrls,
        setPhotoUrls,
        submitting,
        error,
        setError,
        success,
        handleSubmit,
    };
};
