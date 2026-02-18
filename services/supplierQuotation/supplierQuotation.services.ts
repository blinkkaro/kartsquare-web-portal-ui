import { POST } from "../api";
import { API_ENDPOINTS } from "./apiEndpoints";
import {
  SupplierQuotationRequest,
  SupplierQuotationResponse,
  CreateSupplierQuotationParams,
} from "./supplierQuotation.interfaces";

class SupplierQuotationServices {
  async createSupplierQuotation(
    quotationData: CreateSupplierQuotationParams,
  ): Promise<SupplierQuotationResponse> {
    try {
      const response = await POST<SupplierQuotationResponse>(
        `${API_ENDPOINTS.CREATE_SUPPLIER_QUOTATION}`,
        quotationData,
        {},
        true,
      );

      if (response.status !== "success") {
        throw new Error(
          response.message || "Failed to create supplier quotation",
        );
      }
      return response.data;
    } catch (error: any) {
      console.log("error", error);
      throw error;
    }
  }
}

export const supplierQuotationServices = new SupplierQuotationServices();
