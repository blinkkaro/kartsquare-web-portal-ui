import { GET } from "../api";
import { APIENDPOINTS } from "./apiEndPoint";
import {
  SupplierDashboardChartResponse,
  SupplierDashboardResponse,
} from "./supplierDashoard.interface";

class SupplierDashboardService {
  async getSupplierDashboard(): Promise<SupplierDashboardResponse> {
    try {
      const response = await GET<SupplierDashboardResponse>(
        APIENDPOINTS.SUPPLIER_DASHBOARD,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getSupplierDashboardChart(): Promise<SupplierDashboardChartResponse> {
    try {
      const response = await GET<SupplierDashboardChartResponse>(
        APIENDPOINTS.SUPPLIER_DASHBOARD_CHART,
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new SupplierDashboardService();
