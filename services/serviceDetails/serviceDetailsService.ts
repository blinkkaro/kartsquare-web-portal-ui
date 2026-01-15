import { GET } from "../api";
import { serviceListService } from "../serviceList/serviceListService";
import { Service } from "../serviceList/listInteraface";
import { ServiceDetails } from "./serviceDetailsInterface";

class ServiceDetailsService {
    /**
     * Get service details by ID
     */
    async getServiceById(id: string): Promise<ServiceDetails> {
        try {
            const service = await serviceListService.getServiceById(id);
            return service as ServiceDetails;
        } catch (error) {
            console.error("Error fetching service details:", error);
            throw error;
        }
    }

    /**
     * Get other services by the same provider
     */
    async getProviderServices(providerId: string, limit: number = 10): Promise<Service[]> {
        try {
            const response = await serviceListService.getServices({
                provider_id: providerId,
                limit,
            });
            return response.services;
        } catch (error) {
            console.error("Error fetching provider services:", error);
            throw error;
        }
    }
}

export const serviceDetailsService = new ServiceDetailsService();
