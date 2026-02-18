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
export interface SimilarProduct {
  id: string;
  name: string;
  price: string;
  unit: string;
  image: string;
  images: string[];
  supplier: {
    name: string;
    location: string;
    rating: number;
    reviews: number;
    yearEstablished: number;
    gstVerified: boolean;
    trustSeal: boolean;
    responseRate: string;
    businessType: string;
    address: string;
    logo?: string;
    mobile?: string;
    gstNumber?: string;
  };
  specs: { [key: string]: string };
  description: string;
  gst: string;
  category: string;
  categoryId: string;
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
  similar_products?: SimilarProduct[];
  supplier_id?: string;
  supplier?: {
    gst_in?: string;
    logo_url?: string;
    store_name: string;
    is_verified?: boolean;
    user_rating?: number;
    website_url?: string | null;
    country_code?: string | null;
    store_address?: {
      floor?: string | null;
      state?: string | null;
      address?: string | null;
      country?: string | null;
      pincode?: string | null;
      landmark?: string | null;
      city_town?: string | null;
      address_id?: string | null;
      building_no?: string | null;
    };
    primary_mobile?: string;
    establishment_year?: string;
    verification_status?: string;
  };
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
  },

  getProductDetails: async (productId: string) => {
    return await GET<ApiProduct>(`/store/products/${productId}`, {}, false);
  },
};
