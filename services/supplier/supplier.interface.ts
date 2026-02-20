import { pagination } from "../advertise/advertise.intreface";
import { SupplierQuotation } from "../supplierDashboard/supplierDashoard.interface";

export interface getQuotationsResponse {
  quotations: SupplierQuotation[];
  pagination: pagination;
}

export interface CreateSupplierQuotation {
  customer_name: string;
  country_code: string;
  phone_number: string;
  email: string;
  quantity: number;
  details?: string;
  supplier_id: string;
  product_id: string;
}
