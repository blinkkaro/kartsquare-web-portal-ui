export interface SupplierQuotationRequest {
  phone_number: string;
  customer_name: string;
  email: string;
  quantity: number;
  details: string;
}

export interface SupplierQuotationResponse {
  id: string;
  status: string;
  message: string;
  data?: any;
}

export interface CreateSupplierQuotationParams {
  phone_number: string;
  customer_name: string;
  email: string;
  quantity: number;
  details: string;
  country_code: string;
  supplier_id: string;
  product_id: string;
}
