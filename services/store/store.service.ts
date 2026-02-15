import { GET, POST } from "../api";

export interface SubCategory {
    product_sub_category_id: string;
    product_category_id: string;
    sub_category_name: string;
    sub_category_image: string;
    sub_category_des: string;
}

export interface Category {
    product_category_id: string;
    category_name: string;
    category_image: string;
    category_des: string;
    sub_categories: SubCategory[];
}

export interface Brand {
    product_brand_id: string;
    brand_name: string;
    brand_image: string;
    brand_des: string;
}

export interface StoreHomeData {
    categories: Category[];
    brands: Brand[];
}

export interface Specification {
    name: string;
    value: string[];
}

export interface ApiProduct {
    product_id: string;
    product_name: string;
    price: string;
    product_images: string[];
    product_description: string;
    sku_number: string;
    currency: string;
    is_returnable: boolean;
    product_origin: string;
    is_available: boolean;
    specifications: Specification[] | null;
}

export interface ProductResponse {
    products: ApiProduct[];
    total: number;
}

export interface ProductFilters {
    category_id?: string;
    sub_category_id?: string;
    brand_id?: string;
    sort?: string;
    page?: number;
    limit?: number;
}

export const storeService = {
    getStoreHome: async () => {
        return await GET<StoreHomeData>("/store/home", {}, false);
    },

    getProducts: async (filters: ProductFilters) => {
        return await POST<ProductResponse>("/store/products", filters, {}, false);
    }
};
