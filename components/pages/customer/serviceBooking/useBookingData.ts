import { useState, useEffect } from "react";
import { serviceDetailsService } from "@/services/serviceDetails/serviceDetailsService";
import { appointmentService } from "@/services/appointment/appointmentService";
import { userAddressService } from "@/services/userAddress/userAddressService";
import { ServiceDetails } from "@/services/serviceDetails/serviceDetailsInterface";
import { TimeSlot } from "@/services/appointment/appointmentInterface";
import { UserAddress } from "@/services/userAddress/userAddressInterface";
import { Dayjs } from "dayjs";

export const useBookingData = (
    serviceId: string,
    selectedDate: Dayjs | null,
    location: "at_provider" | "at_customer"
) => {
    const [service, setService] = useState<ServiceDetails | null>(null);
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);

    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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

    return {
        service,
        timeSlots,
        userAddresses,
        loading,
        slotsLoading,
        addressLoading,
        error,
        setError,
    };
};
