import { GET } from "../api";
import { SERVICE_API_ENDPOINTS } from "./apiEndPoints";
import {
    ServiceListResponse,
    ServiceFilters,
    Service,
    Category,
} from "./listInteraface";

class ServiceListService {
    /**
     * Get list of services with optional filters
     */
    async getServices(filters?: ServiceFilters): Promise<ServiceListResponse> {
        try {
            const params: Record<string, any> = {};

            if (filters?.page) params.page = filters.page;
            if (filters?.limit) params.limit = filters.limit;
            if (filters?.category_id) params.category_id = filters.category_id;
            if (filters?.sub_category_id) params.sub_category_id = filters.sub_category_id;
            if (filters?.search) params.search = filters.search;
            if (filters?.status) params.status = filters.status;
            if (filters?.min_price) params.min_price = filters.min_price;
            if (filters?.max_price) params.max_price = filters.max_price;
            if (filters?.provider_id) params.provider_id = filters.provider_id;

            const response = await GET<ServiceListResponse>(
                SERVICE_API_ENDPOINTS.GET_SERVICES,
                params,
                false // requiresAuth = false for public services list
            );

            return response.data;
        } catch (error) {
            console.error("Error fetching services:", error);
            throw error;
        }
    }

    /**
     * Get service by ID
     */
    async getServiceById(id: string): Promise<Service> {
        try {
            const response = await GET<Service>(
                SERVICE_API_ENDPOINTS.GET_SERVICE_BY_ID(id),
                {},
                true // requiresAuth = true for service details
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching service:", error);
            throw error;
        }
    }

    /**
     * Get all categories
     */
    async getCategories(): Promise<Category[]> {
        try {
            const response = await GET<Category[]>(
                SERVICE_API_ENDPOINTS.GET_CATEGORIES,
                {},
                true // requiresAuth = true as per backend routes
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error;
        }
    }

    /**
     * Get category by ID
     */
    async getCategoryById(id: string): Promise<Category> {
        try {
            const response = await GET<Category>(
                SERVICE_API_ENDPOINTS.GET_CATEGORY_BY_ID(id),
                {},
                true
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching category:", error);
            throw error;
        }
    }
}

export const serviceListService = new ServiceListService();
