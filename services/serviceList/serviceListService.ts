import { GET, POST, PUT, DELETE } from "../api";
import { SERVICE_API_ENDPOINTS } from "./apiEndPoints";
import {
    ServiceListResponse,
    ServiceFilters,
    Service,
    Category,
    ServiceCreateRequest,
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
                false
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

    /**
     * Get provider services
     */
    async getProviderServices(filters?: { search?: string }): Promise<ServiceListResponse> {
        try {
            const params: Record<string, any> = {};
            if (filters?.search) params.search = filters.search;

            const response = await GET<Service[]>(
                SERVICE_API_ENDPOINTS.GET_PROVIDER_SERVICES,
                params,
                true // requiresAuth = true
            );

            // Mock pagination response structure since backend returns array
            return {
                services: response.data,
                pagination: {
                    total: response.data.length,
                    page: 1,
                    limit: response.data.length,
                    total_pages: 1
                }
            };
        } catch (error) {
            console.error("Error fetching provider services:", error);
            throw error;
        }
    }

    /**
     * Create a new service
     */
    async createService(data: ServiceCreateRequest): Promise<Service> {
        try {
            const response = await POST<Service>(
                SERVICE_API_ENDPOINTS.CREATE_SERVICE,
                data,
                {},
                true // requiresAuth = true
            );
            return response.data;
        } catch (error) {
            console.error("Error creating service:", error);
            throw error;
        }
    }

    /**
     * Update an existing service
     */
    async updateService(serviceId: string, data: ServiceCreateRequest): Promise<Service> {
        try {
            const response = await PUT<Service>(
                `/services/${serviceId}`,
                data,
                {},
                true // requiresAuth = true
            );
            return response.data;
        } catch (error) {
            console.error("Error updating service:", error);
            throw error;
        }
    }

    /**
     * Delete a service
     */
    async deleteService(serviceId: string): Promise<void> {
        try {
            await DELETE(
                `/services/${serviceId}`,
                {},
                true // requiresAuth = true
            );
        } catch (error) {
            console.error("Error deleting service:", error);
            throw error;
        }
    }

    /**
     * Update service status (ACTIVE/INACTIVE)
     */
    async toggleServiceStatus(serviceId: string, status: 'ACTIVE' | 'INACTIVE'): Promise<Service> {
        try {
            const response = await PUT<Service>(
                `/services/${serviceId}/status`,
                { status },
                {},
                true // requiresAuth = true
            );
            return response.data;
        } catch (error) {
            console.error("Error toggling service status:", error);
            throw error;
        }
    }

    /**
     * Increase phone number view count
     */
    async increasePhoneNumberViewCount(providerId: string): Promise<void> {
        try {
            await PUT(
                SERVICE_API_ENDPOINTS.INCREASE_PHONE_NUMBER(providerId),
                {},
                {},
                true // requiresAuth = true
            );
        } catch (error) {
            console.error("Error increasing phone number view count:", error);
            throw error;
        }
    }
}

export const serviceListService = new ServiceListService();
