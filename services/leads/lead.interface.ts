export interface Lead {
  lead_id: string;
  provider_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country_code: string;
  created_at: Date;
  message: string;
}

export interface LeadCreate {
  provider_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country_code: string;
  message: string;
}

export interface GetLeadsResponse {
    leads: Lead[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}
