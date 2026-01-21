export interface TimeSlot {
    slot_time: string; // ISO datetime string in local timezone
    is_booked: boolean;
}

export interface GetSlotsRequest {
    service_id: string;
    provider_id: string;
    date: string; // YYYY-MM-DD format
    timezone: string; // e.g., "Asia/Bahrain"
}

export interface GetSlotsResponse {
    slots: TimeSlot[];
}
