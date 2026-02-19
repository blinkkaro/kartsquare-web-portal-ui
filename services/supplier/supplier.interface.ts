import { pagination } from "../advertise/advertise.intreface";
import { SupplierQuotation } from "../supplierDashboard/supplierDashoard.interface";

export interface getQuotationsResponse {
  quotations: SupplierQuotation[];
  pagination: pagination;
}
