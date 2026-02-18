export const SUPPLIER_ENDPOINTS = {
  PROFILE: "/supplier/profile",
  KYC: "/supplier/kyc",
  STORE: "/supplier/store",
  PRODUCTS: "/supplier/products",
  PRODUCT_DETAIL: (id: string) => `/supplier/products/${id}`,
  ENQUIRIES: "/supplier/enquiries",
  ENQUIRY_STATUS: (id: string) => `/supplier/enquiries/${id}/status`,
  DASHBOARD_METRICS: "/supplier/dashboard",
  SUPPLIER_QUOTATIONS: "/supplier-quotations",
  QUOTATION_VIEWED: (id: string) => `/supplier-quotations/${id}/viewed`,
};
