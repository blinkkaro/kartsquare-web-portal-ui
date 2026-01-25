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
    distance_km?: string;
    booking_at: string;
    booking_created_at?: string;
    service_id: string;
    service_location: "at_provider" | "at_customer" | "virtual";
    address_id?: string;
    booking_photo_url?: string[] | null;
    photo_url?: string[];
    booking_address?: {
        id: string;
        name: string;
        pincode: string;
        address: string;
        cityTown: string;
        landmark: string;
        state: string;
        country: string;
        latitude: number;
        longitude: number;
    };
    provider_details?: {
        id: string;
        first_name: string;
        last_name: string;
        profile_pic: string | null;
        username: string;
        contact_number: string;
        country_code: string;
    };
    customer_details?: {
        id: string;
        first_name: string;
        last_name: string;
        profile_pic: string | null;
        username: string;
        contact_number: string;
        country_code: string;
    };
    customer_notes?: string;
    category_name: string;
    service_price: number;
    provider_first_name?: string;
    provider_last_name?: string;
    provider_profile_pic?: string;
    contact_number?: string;
    otp?: number;
    service_currency?: string;
}

export interface BookingDetails {
    booking_id: string;
    provider_id: string;
    customer_id: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "ACTIVE";
    distance_km: string;
    customer_notes: string | null;
    service_id: string;
    service_location: "at_provider" | "at_customer" | "virtual";
    booking_photo_url?: string[] | null;
    photo_url?: string[];
    booking_address: {
        id: string;
        name: string;
        pincode: string;
        address: string;
        cityTown: string;
        landmark: string;
        state: string;
        country: string;
        latitude: number;
        longitude: number;
    };
    provider_details?: {
        id: string;
        first_name: string;
        last_name: string;
        profile_pic: string | null;
        username: string;
        contact_number: string;
        country_code: string;
    };
    customer_details?: {
        id: string;
        first_name: string;
        last_name: string;
        profile_pic: string | null;
        username: string;
        contact_number: string;
        country_code: string;
    };
    service_name: string;
    service_desc: string;
    service_image: string[];
    service_rating: string;
    service_currency: string;
    service_is_price_required: boolean;
    service_visiting_charge: number | null;
    service_provider_address_id: string;
    booking_at: string;
    booking_created_at?: string;
    booking_updated_at?: string;
    service_price: number;
    otp?: number;
    category_name?: string;
    contact_number?: string;
}
