import {
  Product,
  ProductBrand,
  ProductCategoriesInterface,
  ProductCategoriesResponse,
  ProductCreate,
  ProductDetail,
  productFilter,
  ProductSpecification,
  ProductSpecificationResponse,
  ProductStatusUpdate,
  ProductSubCategoryInterface,
  ProductSummary,
  ProductSummaryPagination,
  ProductUpdate,
  SupplierProductDetail,
} from "./product.interface";
import { DELETE, GET, POST, PUT } from "../api";
import { APIENDPOINTS } from "./apiEndPoints";
import { verifyDocumentService } from "../auth/verifyDocument.service";

class ProductService {
  async getProductCategories(
    search?: string,
    limit: number = 5,
  ): Promise<ProductCategoriesInterface[]> {
    try {
      let url = APIENDPOINTS.GET_PRODUCTS_CATEGORIES;
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      }
      if (limit) {
        params.append("limit", limit.toString());
      }
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      const response = await GET<ProductCategoriesResponse>(url);
      console.log("categories", response.data);
      return response.data.categories;
    } catch (error) {
      throw error;
    }
  }

  async getProductSubCategories(
    categoryId: string,
    search?: string,
    limit: number = 5,
  ): Promise<ProductSubCategoryInterface[]> {
    try {
      let url = APIENDPOINTS.GET_PRODUCTS_SUB_CATEGORIES(categoryId);
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      }
      if (limit) {
        params.append("limit", limit.toString());
      }
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      const response = await GET<ProductSubCategoryInterface[]>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProductBrands(
    subCategoryId: string,
    search?: string,
    limit: number = 5,
  ): Promise<ProductBrand[]> {
    try {
      let url = APIENDPOINTS.GET_PRODUCTS_BRANDS(subCategoryId);
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      }
      if (limit) {
        params.append("limit", limit.toString());
      }
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      const response = await GET<ProductBrand[]>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProductSpecifications(
    subCategoryId: string,
  ): Promise<ProductSpecification[]> {
    try {
      let url = APIENDPOINTS.GET_PRODUCTS_SPECIFICATIONS(subCategoryId);
      const response = await GET<ProductSpecificationResponse>(url);
      console.log("specifications", response.data);
      return response.data.specifications;
    } catch (error) {
      throw error;
    }
  }

  async getProducts(filter: productFilter): Promise<ProductSummaryPagination> {
    try {
      let url = APIENDPOINTS.PRODUCTS;
      const params = new URLSearchParams();
      if (filter.search) params.append("search", filter.search);
      if (filter.limit) params.append("limit", filter.limit.toString());
      else params.append("limit", "10");
      if (filter.page) params.append("page", filter.page.toString());
      else params.append("page", "1");
      if (filter.category_id) params.append("category_id", filter.category_id);
      if (filter.sub_category_id)
        params.append("sub_category_id", filter.sub_category_id);
      if (filter.brand_id) params.append("brand_id", filter.brand_id);

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await GET<ProductSummaryPagination>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId: string): Promise<SupplierProductDetail> {
    try {
      let url = APIENDPOINTS.PRODUCT_BY_ID(productId);
      const response = await GET<SupplierProductDetail>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getSupplierProducts(
    filter: productFilter,
  ): Promise<ProductSummaryPagination> {
    try {
      let url = APIENDPOINTS.GET_SUPPLIER_PRODUCTS;
      const params = new URLSearchParams();
      if (filter.search) params.append("search", filter.search);
      if (filter.limit) params.append("limit", filter.limit.toString());
      else params.append("limit", "10");
      if (filter.page) params.append("page", filter.page.toString());
      else params.append("page", "1");
      if (filter.category_id) params.append("category_id", filter.category_id);
      if (filter.sub_category_id)
        params.append("sub_category_id", filter.sub_category_id);
      if (filter.brand_id) params.append("brand_id", filter.brand_id);

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await GET<ProductSummaryPagination>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createProduct(product: ProductCreate) {
    try {
      let finalImages: string[] = [];
      const filesToUpload: File[] = [];
      const imageMap: { index: number; isFile: boolean }[] = [];

      product.product_images.forEach((img: any, idx) => {
        if (img instanceof File) {
          filesToUpload.push(img);
          imageMap.push({ index: idx, isFile: true });
        } else {
          imageMap.push({ index: idx, isFile: false });
          finalImages[idx] = img as string;
        }
      });

      if (filesToUpload.length > 0) {
        const uploadedUrls =
          await verifyDocumentService.uploadImages(filesToUpload);
        let uploadIdx = 0;
        imageMap.forEach((item) => {
          if (item.isFile) {
            finalImages[item.index] = uploadedUrls[uploadIdx++];
          }
        });
      }

      const payload = {
        ...product,
        product_images: finalImages,
      };

      let url = APIENDPOINTS.PRODUCTS;
      const response = await POST<Product>(url, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(product: ProductUpdate) {
    try {
      let finalImages: string[] = [];
      const filesToUpload: File[] = [];
      const imageMap: { index: number; isFile: boolean }[] = [];

      if (product.product_images) {
        product.product_images.forEach((img: any, idx) => {
          if (img instanceof File) {
            filesToUpload.push(img);
            imageMap.push({ index: idx, isFile: true });
          } else {
            imageMap.push({ index: idx, isFile: false });
            finalImages[idx] = img as string;
          }
        });

        if (filesToUpload.length > 0) {
          const uploadedUrls =
            await verifyDocumentService.uploadImages(filesToUpload);
          let uploadIdx = 0;
          imageMap.forEach((item) => {
            if (item.isFile) {
              finalImages[item.index] = uploadedUrls[uploadIdx++];
            }
          });
        }
      }

      const payload = {
        ...product,
        product_images: product.product_images ? finalImages : undefined,
      };

      let url = APIENDPOINTS.PRODUCT_BY_ID(product.product_id);
      const response = await PUT<Product>(url, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId: string) {
    try {
      let url = APIENDPOINTS.PRODUCT_BY_ID(productId);
      const response = await DELETE<Product>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProductStatus(product: ProductStatusUpdate) {
    try {
      let url = APIENDPOINTS.PRODUCT_STATUS(product.product_id);
      const response = await PUT<Product>(url, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const productService = new ProductService();
