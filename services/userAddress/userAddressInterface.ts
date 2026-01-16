export interface UserAddress {
    address_id: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    is_default: boolean;
    label?: string;
}
