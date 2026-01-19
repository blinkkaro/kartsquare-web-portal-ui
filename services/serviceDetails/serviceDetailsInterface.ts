import { Service } from "../serviceList/listInteraface";

// Extended service details with additional information
export interface ServiceDetails extends Service {
    // Any additional fields that come from the detail endpoint
    full_description?: string;
    terms_and_conditions?: string;
    cancellation_policy?: string;
}

export interface ServiceDetailsParams {
    id: string;
}
