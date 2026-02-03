import { GET, POST, PUT } from "../api";
import { API_ENDPOINTS } from "./apiEndPoint";
import { IFreeLeadNumberResponse, IFreeLeadParams, IFreeLeadResponse } from "./auth.interface";

class FreeLeadService {
  async getNumber(id: string): Promise<IFreeLeadNumberResponse> {
    try {
      const response = await GET<IFreeLeadNumberResponse>(API_ENDPOINTS.GET_NUMBER(id), {}, false);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async verifyNumber(id: string, otp: string): Promise<boolean> {
    try {
      const response = await PUT<boolean>(
        API_ENDPOINTS.VERIFY_NUMBER(id),
        { otp },
        {},
        false,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async applyForFreeListing(params: IFreeLeadParams): Promise<IFreeLeadResponse> {
    try {
      const response = await POST<IFreeLeadResponse>(
        API_ENDPOINTS.APPLY_FOR_FREE_LISTING,
        params,
        {},
        false,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const freeLeadService = new FreeLeadService();
