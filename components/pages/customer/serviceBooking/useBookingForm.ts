import { useState } from "react";
import { type Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { BookingPlace } from "@/lib/serviceLocation";
import { bookingService } from "@/services/booking/bookingService";
import type { BookingResponse, CreateBookingRequest } from "@/services/booking/bookingInterface";
import { type ServiceDetails } from "@/services/serviceDetails/serviceDetailsInterface";
import { english } from "@/features/i18n/en";
import { errorMessage } from "@/lib/http/errorMessage";

interface UseBookingFormProps {
  service: ServiceDetails | null;
  onSuccess: (response: BookingResponse) => void;
  selectedDate: Dayjs | null;
  setSelectedDate: (date: Dayjs | null) => void;
  location: BookingPlace;
  setLocation: (location: BookingPlace) => void;
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

      // The request needs a saved address: the backend checks it belongs to this customer.
      if (location === "at_customer" && !selectedAddressId) {
        setError(english.select_address_error_booking);
        return;
      }

      let scheduleAt: string;
      if (service?.have_slots && selectedTime) {
        scheduleAt = dayjs(selectedTime).toISOString();
      } else {
        // No slots: ask for 9:00 that day, or for today the next half hour at least 30 minutes away,
        // so a same-day request is never sent for a time already past.
        const nineAm = selectedDate.hour(9).minute(0).second(0).millisecond(0);
        const soonest = dayjs().add(30, "minute");
        const roundedSoonest =
          soonest.minute() <= 30
            ? soonest.minute(30).second(0).millisecond(0)
            : soonest.add(1, "hour").minute(0).second(0).millisecond(0);
        scheduleAt = (nineAm.isBefore(soonest) ? roundedSoonest : nineAm).toISOString();
      }

      const bookingData: CreateBookingRequest = {
        service_id: finalServiceId,
        service_location: location,
        customer_notes: notes.trim() || undefined,
        schedule_at: scheduleAt,
        // Only a real id: the API rejects null, which used to fail every request for a service
        // without a provider address (online-only services, at-home-only services booked "at provider").
        address_id:
          (location === "at_customer"
            ? selectedAddressId
            : location === "at_provider"
              ? service?.service_provider_address_id
              : undefined) || undefined,
        photo_url: photoUrls.length > 0 ? photoUrls : undefined,
      };

      const response = await bookingService.createBooking(bookingData);
      setSuccess(true);
      onSuccess(response);
    } catch (error) {
      console.error("Booking error:", error);
      setError(errorMessage(error, english.failed_create_booking));
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
