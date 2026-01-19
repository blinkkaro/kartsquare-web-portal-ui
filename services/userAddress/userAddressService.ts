import { GET } from "../api";
import { UserAddress } from "./userAddressInterface";

const ADDRESS_API_ENDPOINTS = {
    GET_USER_ADDRESSES: "/user/addresses/getUserAddresses",
};

class UserAddressService {
    /**
     * Get all addresses for the current user
     */
    async getUserAddresses(): Promise<UserAddress[]> {
        try {
            const response = await GET<any>(
                ADDRESS_API_ENDPOINTS.GET_USER_ADDRESSES,
                {},
                true // Requires authentication
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching user addresses:", error);
            throw error;
        }
    }
}

export const userAddressService = new UserAddressService();
