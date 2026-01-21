import { GET, POST, PUT, DELETE, PATCH } from "../api";
import { SUPPLIER_ENDPOINTS } from "./apiEndPoint";

export interface SupplierProfile {
  company_name: string;
  contact_person: string;
  contact_number: string;
  email: string; // Read-only usually
  website_url?: string;
  description?: string;
  business_type?: string;
  founded_year?: string;
  employee_count?: string;
  logo_url?: string;
  banner_url?: string;
}

export interface SupplierKyc {
  gst_number: string;
  gst_certificate_url: string;
  pan_number: string;
  pan_card_url: string;
  bank_account_number: string;
  ifsc_code: string;
  bank_name: string;
  cancelled_cheque_url: string;
}

export interface SupplierStore {
  display_name: string;
  slug: string;
  about_us?: string;
  logo_url?: string;
  banner_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  whatsapp_number?: string;
  social_links?: any;
  preferences?: {
    show_email: boolean;
    show_phone: boolean;
    show_whatsapp: boolean;
  };
}

class SupplierService {
  // Profile
  async getProfile() {
    return GET(SUPPLIER_ENDPOINTS.PROFILE, {}, true);
  }

  async updateProfile(data: Partial<SupplierProfile>) {
    return POST(SUPPLIER_ENDPOINTS.PROFILE, data, {}, true);
  }

  // KYC
  async getKyc() {
    return GET(SUPPLIER_ENDPOINTS.KYC, {}, true);
  }

  async updateKyc(data: SupplierKyc) {
    return POST(SUPPLIER_ENDPOINTS.KYC, data, {}, true);
  }

  // Store
  async getStore() {
    return GET(SUPPLIER_ENDPOINTS.STORE, {}, true);
  }

  async updateStore(data: Partial<SupplierStore>) {
    return POST(SUPPLIER_ENDPOINTS.STORE, data, {}, true);
  }

  // Products
  async getProducts(params: any = {}) {
    return GET(SUPPLIER_ENDPOINTS.PRODUCTS, params, true);
  }

  async getProduct(id: string) {
    return GET(SUPPLIER_ENDPOINTS.PRODUCT_DETAIL(id), {}, true);
  }

  async createProduct(data: any) {
    return POST(SUPPLIER_ENDPOINTS.PRODUCTS, data, {}, true);
  }

  async updateProduct(id: string, data: any) {
    return PUT(SUPPLIER_ENDPOINTS.PRODUCT_DETAIL(id), data, {}, true);
  }

  async deleteProduct(id: string) {
    return DELETE(SUPPLIER_ENDPOINTS.PRODUCT_DETAIL(id), {}, true);
  }

  // Enquiries
  async getEnquiries(params: any = {}) {
    return GET(SUPPLIER_ENDPOINTS.ENQUIRIES, params, true);
  }

  async updateEnquiryStatus(id: string, status: string) {
    return PUT(SUPPLIER_ENDPOINTS.ENQUIRIES + `/${id}/status`, { status }, {}, true);
  }

  // Dashboard
  async getDashboardMetrics() {
    return GET(SUPPLIER_ENDPOINTS.DASHBOARD_METRICS, {}, true);
  }
}

export const supplierService = new SupplierService();
