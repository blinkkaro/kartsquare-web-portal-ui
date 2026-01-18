export interface UserAddress {
    id: string;
    user_id: string;
    address_name: string;
    building_no: string;
    floor: string;
    address: string;
    landmark: string;
    pincode: string;
    city_town: string;
    state: string;
    country: string;
    is_default: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    is_deleted: boolean;
    latitude: number;
    longitude: number;
}
