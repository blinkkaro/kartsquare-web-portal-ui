import { useQuery } from "@tanstack/react-query";
import { bookingListingService } from "@/services/booking/bookingListing";
import { providerBookingService } from "@/services/booking/providerBookingService";
import { UserBooking } from "@/services/booking/bookingInterface";

interface BookingListParams {
  status?: string;
  limit?: number;
  search?: string;
}

/**
 * Hook to fetch customer bookings with TanStack Query caching
 */
export const useCustomerBookings = (params?: BookingListParams) => {
  return useQuery({
    queryKey: ["customer-bookings", params],
    queryFn: () => bookingListingService.getUserBookings(params),
    staleTime: 1 * 60 * 1000, // 1 minute - bookings can change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnMount: true, // Refetch on mount to get latest bookings
  });
};

/**
 * Hook to fetch provider bookings with TanStack Query caching
 */
export const useProviderBookings = () => {
  return useQuery({
    queryKey: ["provider-bookings"],
    queryFn: () => providerBookingService.getProviderBookings(),
    staleTime: 1 * 60 * 1000, // 1 minute - bookings can change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnMount: true, // Refetch on mount to get latest bookings
  });
};
