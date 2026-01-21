export const SUPPLIER_ENDPOINTS = {
  PROFILE: "/supplier/profile",
  KYC: "/supplier/kyc",
  STORE: "/supplier/store",
  PRODUCTS: "/supplier/products",
  PRODUCT_DETAIL: (id: string) => `/supplier/products/${id}`,
  ENQUIRIES: "/supplier/enquiries",
  ENQUIRY_STATUS: (id: string) => `/supplier/enquiries/${id}/status`,
  DASHBOARD_METRICS: "/supplier/dashboard",
};
