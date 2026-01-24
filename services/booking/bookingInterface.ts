export interface CreateBookingRequest {
    service_id: string;
    service_location: "at_provider" | "at_customer" | "virtual";
    address_id?: string;
    photo_url?: string[];
    customer_notes?: string;
    schedule_at: string; // ISO datetime string
}

export interface BookingResponse {
    booking_id: string;
    created_at: Date;
    schedule_at: Date;
    address_id?: string;
    service_location: string;
}

export interface UserAddress {
    address_id: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    is_default: boolean;
}

export interface UserBooking {
    booking_id: string;
    service_images: string[];
    service_name: string;
    currency: string;
    service_category_id: string;
    provider_id: string;
    customer_id: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "ACTIVE";
    distance_km?: number;
    booking_at: Date;
    service_id: string;
    service_location: "at_provider" | "at_customer" | "virtual";
    address_id?: string;
    photo_url?: string[];
    customer_notes?: string;
    provider_first_name: string;
    provider_last_name: string;
    category_name: string;
    provider_profile_pic?: string;
    customer_first_name?: string;
    customer_last_name?: string;
    customer_profile_pic?: string;
    service_price: number;
}

export interface BookingDetails {
    booking_id: string;
    provider_id: string;
    customer_id: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "ACTIVE";
    distance_km: string;
    customer_notes: string;
    service_id: string;
    service_location: "at_provider" | "at_customer" | "virtual";
    address_id: string;
    photo_url: string[];
    contact_number: string;
    customer_first_name?: string;
    customer_last_name?: string;
    customer_rating?: number;
    customer_profile_pic?: string | null;
    provider_first_name?: string;
    provider_last_name?: string;
    provider_profile_pic?: string | null;
    category_name?: string;
    service_name: string;
    service_desc: string;
    service_image: string[];
    service_rating: string;
    service_currency: string;
    service_is_price_required: boolean;
    service_visiting_charge: number | null;
    service_provider_address_id: string;
    customer_address_name: string;
    customer_address_address: string;
    customer_address_city_town: string;
    customer_address_landmark: string;
    booking_at: string;
    service_price: number;
    otp?: number;
}
