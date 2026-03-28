export interface SmtpSettings {
  id?: number;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password?: string; // Optional because GET usually hides it
  fromEmail: string;
  fromName: string;
}

export interface VendorCampaign {
  id: number;
  name: string;
  subject: string;
  status: "draft" | "scheduled" | "processing" | "completed" | "failed";
  createdAt: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
}

export interface VendorCampaignDetail extends VendorCampaign {
  recipients: {
    email: string;
    name?: string;
    status: "pending" | "sent" | "failed";
    error?: string;
  }[];
  bodyHtml?: string;
}

export interface CreateCampaignDTO {
  name: string;
  subject: string;
  bodyHtml: string;
  csvFile: File;
  scheduleTime?: string; // ISO string if scheduled 
}

export interface EmailMarketingDashboardStats {
  totalCampaigns: number;
  emailsSent: number;
  failedEmails: number;
  activeCampaigns: number;
}
