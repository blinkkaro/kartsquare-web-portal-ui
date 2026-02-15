export const APIENDPOINTS = {
    GET_PRODUCTS_CATEGORIES: "/product-categories",
    GET_PRODUCTS_SUB_CATEGORIES: (categoryId: string) => `/product-sub-categories/${categoryId}`,
    GET_PRODUCTS_BRANDS: (subCategoryId: string) => `/product-brands/${subCategoryId}`,
    GET_PRODUCTS_SPECIFICATIONS: (subCategoryId: string) => `/product-specifications/${subCategoryId}`,
    PRODUCTS: "/products",
    PRODUCT_BY_ID: (productId: string) => `/products/${productId}`,
    GET_SUPPLIER_PRODUCTS: `/products/supplier`,
    PRODUCT_STATUS: (productId: string) => `/products/status/${productId}`,
}