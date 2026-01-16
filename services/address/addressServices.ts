import { DELETE, GET, POST, PUT } from "../api";
import { Address } from "./addressInterface";
import { APIENDPOINTS } from "./apiEndPoints";

class AddressServices {
  async getAddress(): Promise<Address[]> {
    try {
      const response = await GET(APIENDPOINTS.GET_ADDRESS);
      console.log("response", response);
      return response.data as Address[];
    } catch (error) {
      throw error;
    }
  }

  async addAddress(addressData: any) {
    try {
      const response = await POST(APIENDPOINTS.ADD_ADDRESS, addressData);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateAddress(id: string, addressData: Address) {
    try {
      console.log("addressData", addressData);
      const response = await PUT(APIENDPOINTS.UPDATE_ADDRESS(id), addressData);
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  }

  async deleteAddress(id: string) {
    try {
      const response = await DELETE(APIENDPOINTS.DELETE_ADDRESS(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const addressServices = new AddressServices();
