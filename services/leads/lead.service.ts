import { POST, GET } from "../api";
import { API_ENDPOINTS } from "./apiEndPoint";
import { LeadCreate, GetLeadsResponse, Lead } from "./lead.interface";

class LeadService {
  async createLead(lead: LeadCreate): Promise<Lead> {
    try {
      const response = await POST<Lead>(API_ENDPOINTS.CREATE_LEAD, lead);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getLeads(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<GetLeadsResponse> {
    try {
      const response = await GET<GetLeadsResponse>(
        `${API_ENDPOINTS.CREATE_LEAD}?page=${page}&limit=${limit}&search=${search || ""}`,
        {},
        true,
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new LeadService();
