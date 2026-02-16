import { pagination } from "../advertise/advertise.intreface";

export enum product_status {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  REJECTED = "rejected",
}

export enum product_specifications_option_type {
  TEXT = "text",
  DROPDOWN = "dropdown",
  RANGE = "range",
  DATE = "date",
  CHECKBOX = "checkbox",
}

export interface Product {
  product_id: string;
  product_category_id: string;
  product_sub_category_id: string;
  product_brand_id?: string;
  product_images: string[];
  product_name: string;
  product_description: string;
  sku_number: string;
  currency: string;
  price: number;
  is_available: boolean;
  product_origin: string;
  is_returnable: boolean;
  product_status: string;
  rejected_reason?: string;
  supplier_id: string;
  is_deleted: boolean;
  deleted_by?: string;
  deleted_by_user_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductSpecificationValue {
  product_specifications_value_id?: string;
  product_sub_category_id: string;
  product_id?: string;
  user_id?: string;
  product_specifications_id: string;
  product_specifications_entered_value: string[];
  product_specifications_value_type: string;
  is_deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductSpecificationValueCreate {
  product_specifications_id: string;
  product_specifications_entered_value: string[];
  product_specifications_value_type: string;
}

export interface ProductCreate {
  product_category_id: string;
  product_sub_category_id: string;
  product_brand_id?: string;
  product_images: (string | File)[];
  product_name: string;
  product_description: string;
  sku_number: string;
  currency: string;
  is_available: boolean;
  product_origin: string;
  price: number;
  is_returnable: boolean;
  rejected_reason?: string;
  specifications: ProductSpecificationValueCreate[];
}

export interface ProductUpdate {
  product_id: string;
  product_category_id?: string;
  product_sub_category_id?: string;
  product_brand_id?: string;
  product_images?: (string | File)[];
  product_name?: string;
  product_description?: string;
  is_available?: boolean;
  product_origin?: string;
  sku_number?: string;
  currency?: string;
  price?: number;
  is_returnable?: boolean;
  product_status?: product_status;
  rejected_reason?: string;
  specifications?: ProductSpecificationValueCreate[];
}

export interface ProductStatusUpdate {
  product_id: string;
  is_available?: boolean;
  product_status?: product_status;
}

export interface ProductSummary {
  product_id: string;
  product_name: string;
  sku_number: string;
  price: number;
  currency: string;
  product_brand_id?: string; // or brand name if joined
  is_available: boolean;
  product_origin: string;
  product_status: product_status;
  rejected_reason?: string;
  brand_name?: string;
  product_images: string[];
  category_name: string;
  sub_category_name: string;
  is_deleted: boolean;
}

export interface ProductSummaryPagination {
  pagination: pagination;
  products: ProductSummary[];
}

export interface ProductDetail extends Product {
  brand_name?: string;
  category_name: string;
  sub_category_name: string;
  specifications: {
    product_specifications_id: string;
    product_specifications_name: string;
    product_specifications_value_type: string;
    product_specifications_entered_value: string[];
  }[];
}

export interface ProductBrand {
  product_brand_id: string;
  brand_name: string;
  brand_image: string;
  brand_des: string;
  is_deleted: boolean;
  deleted_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductCategoriesInterface {
  product_category_id: string;
  category_name: string;
  category_image: string;
  category_des: string;
  is_deleted: boolean;
  deleted_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCategoriesResponse {
  categories: ProductCategoriesInterface[];
  total: number;
}

export interface ProductSpecification {
  product_specifications_id: string;
  product_sub_category_id: string;
  product_specifications_name: string;
  product_specifications_option_type: product_specifications_option_type;
  product_specifications_option_value:
    | string[]
    | [{ min: number; max: number }];
  product_specifications_is_required: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductSubCategoryInterface {
  product_sub_category_id: string;
  product_category_id: string;
  sub_category_name: string;
  sub_category_des: string;
  is_deleted: boolean;
  deleted_by: string;
  created_at: string;
  updated_at: string;
}

export interface productFilter {
  page: number;
  limit: number;
  search?: string;
  status?: product_status;
  category_id?: string;
  sub_category_id?: string;
  brand_id?: string;
}

export interface ProductSpecificationResponse {
  specifications: ProductSpecification[];
  total: number;
}
