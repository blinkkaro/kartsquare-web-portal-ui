import { GET, POST, PUT, DELETE, PATCH } from "../api";
import { SUPPLIER_ENDPOINTS } from "./apiEndPoint";
import { secureStorage } from "@/helper/SecureStorage";
import { CreateSupplierQuotation, getQuotationsResponse } from "./supplier.interface";

export interface SupplierProfile {
  business_name: string;
  contact_person: string;
  contact_number: string;
  email: string; // Read-only usually
  website?: string;
  description?: string;
  business_type?: string;
  establishment_year?: number;
  employee_count?: string;
  logo_url?: string;
  banner_url?: string;
  register_step?: number;
}

export interface SupplierKyc {
  gst_number: string;
  gst_state: string;
  pan_number: string;
  owner_name: string;
  owner_mobile: string;
  owner_email: string;
  bank_account_number: string;
  ifsc_code: string;
  bank_name: string;
  gst_certificate_url: string;
  pan_card_url: string;
  cancelled_cheque_url: string;
  id_proof_type: string;
  id_proof_url: string;
  address_proof_url: string;
}

export interface SupplierStore {
  id?: string;
  supplier_id?: string;
  store_name: string;
  display_name?: string;
  slug?: string;
  about_us?: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  contact_email?: string;
  contact_phone?: string;
  primary_mobile?: string;
  whatsapp_number?: string;
  store_address_id?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  establishment_year?: string;
  country_code?: string;
  website_url?: string;
  business_type?: string;
  categories_served: string[];
  operating_locations: string[];
  contact_preferences: {
    show_phone: boolean;
    show_whatsapp: boolean;
    allow_calls: boolean;
    allow_chat: boolean;
    enquiry_only: boolean;
  };
}

class SupplierService {
  private getUserId() {
    const user = secureStorage.getItem("user_details");
    return user?.id;
  }

  // Profile
  async getProfile() {
    return GET<SupplierProfile>(
      SUPPLIER_ENDPOINTS.PROFILE,
      { userId: this.getUserId() },
      true,
    );
  }

  async updateProfile(data: Partial<SupplierProfile>) {
    return POST<SupplierProfile>(
      SUPPLIER_ENDPOINTS.PROFILE,
      { ...data, userId: this.getUserId() },
      {},
      true,
    );
  }

  // KYC
  async getKyc() {
    return GET<SupplierKyc>(
      SUPPLIER_ENDPOINTS.KYC,
      { userId: this.getUserId() },
      true,
    );
  }

  async updateKyc(data: SupplierKyc) {
    return POST<SupplierKyc>(
      SUPPLIER_ENDPOINTS.KYC,
      { ...data, userId: this.getUserId() },
      {},
      true,
    );
  }

  // Store
  async getStore() {
    return GET<SupplierStore>(
      SUPPLIER_ENDPOINTS.STORE,
      { userId: this.getUserId() },
      true,
    );
  }

  async updateStore(data: Partial<SupplierStore>) {
    return POST<SupplierStore>(
      SUPPLIER_ENDPOINTS.STORE,
      { ...data, userId: this.getUserId() },
      {},
      true,
    );
  }

  async editStore(data:Partial<SupplierStore>){
    return PUT<SupplierStore>(
      SUPPLIER_ENDPOINTS.STORE,
      data,
      {},
      true,
    );
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
    return PUT(
      SUPPLIER_ENDPOINTS.ENQUIRIES + `/${id}/status`,
      { status },
      {},
      true,
    );
  }

  // Dashboard
  async getDashboardMetrics() {
    return GET(SUPPLIER_ENDPOINTS.DASHBOARD_METRICS, {}, true);
  }

  // Quotations
  async getQuotations(params: {
    page?: number;
    limit?: number;
    search?: string;
    is_viewed?: boolean;
  }): Promise<getQuotationsResponse> {
    const query = new URLSearchParams(params as any).toString();
    const res = await GET<getQuotationsResponse>(
      SUPPLIER_ENDPOINTS.SUPPLIER_QUOTATIONS + `?${query}`,
      {},
      true,
    );
    return res.data;
  }

  async markQuotationViewed(id: string) {
    return PUT(SUPPLIER_ENDPOINTS.QUOTATION_VIEWED(id), {}, {}, true);
  }

  async createQuotation(data: CreateSupplierQuotation) {
    return POST(SUPPLIER_ENDPOINTS.SUPPLIER_QUOTATIONS, data, {}, false);
  }
}

export const supplierService = new SupplierService();
